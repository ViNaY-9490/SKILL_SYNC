import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserRole, UserStatus } from '@prisma/client';
import { RegisterDto, LoginDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

const DEMO_USERS_FALLBACK: Record<string, { id: string; role: UserRole }> = {
  'student@demo.skillsync.local': { id: 'demo_student_1', role: UserRole.STUDENT },
  'student2@demo.skillsync.local': { id: 'demo_student_2', role: UserRole.STUDENT },
  'recruiter@demo.skillsync.local': { id: 'demo_recruiter_1', role: UserRole.INDUSTRY },
  'faculty@demo.skillsync.local': { id: 'demo_faculty_1', role: UserRole.FACULTY },
  'institution@demo.skillsync.local': { id: 'demo_inst_1', role: UserRole.INSTITUTION_ADMIN },
  'admin@demo.skillsync.local': { id: 'demo_admin_1', role: UserRole.SUPER_ADMIN },
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (!this.prisma.isConnected) {
      // Prototype mode response
      const fakeUser = { id: `user_${Date.now()}`, email: dto.email, role: dto.role, status: UserStatus.ACTIVE };
      const accessToken = this.jwtService.sign(
        { sub: fakeUser.id, email: fakeUser.email, role: fakeUser.role },
        { secret: this.config.get<string>('JWT_SECRET', 'skillsync-dev-jwt-secret-minimum-32-chars') },
      );
      return { user: fakeUser, accessToken, refreshToken: uuidv4() };
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          role: dto.role,
          status: UserStatus.ACTIVE,
          emailVerified: false,
        },
      });

      if (dto.role === UserRole.STUDENT) {
        await tx.studentProfile.create({
          data: { userId: newUser.id, firstName: dto.firstName, lastName: dto.lastName },
        });
      } else if (dto.role === UserRole.INDUSTRY) {
        await tx.industryProfile.create({
          data: { userId: newUser.id, firstName: dto.firstName, lastName: dto.lastName },
        });
      } else if (dto.role === UserRole.FACULTY) {
        await tx.facultyProfile.create({
          data: { userId: newUser.id, firstName: dto.firstName, lastName: dto.lastName },
        });
      } else if (
        dto.role === UserRole.INSTITUTION_ADMIN ||
        dto.role === UserRole.PLACEMENT_OFFICER
      ) {
        await tx.institutionProfile.create({
          data: { userId: newUser.id, firstName: dto.firstName, lastName: dto.lastName },
        });
      }

      return newUser;
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    if (!this.prisma.isConnected) {
      // Prototype mode fallback for demo accounts
      const demoAccount = DEMO_USERS_FALLBACK[dto.email] || {
        id: `demo_${Date.now()}`,
        role: UserRole.STUDENT,
      };

      const fakeUser = { id: demoAccount.id, email: dto.email, role: demoAccount.role, status: UserStatus.ACTIVE };
      const accessToken = this.jwtService.sign(
        { sub: fakeUser.id, email: fakeUser.email, role: fakeUser.role },
        { secret: this.config.get<string>('JWT_SECRET', 'skillsync-dev-jwt-secret-minimum-32-chars') },
      );
      return { user: fakeUser, accessToken, refreshToken: uuidv4() };
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(`Account temporarily locked. Try again in ${minutesLeft} minutes.`);
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DEACTIVATED) {
      throw new ForbiddenException('Account is not active.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      const newCount = user.failedLoginCount + 1;
      const updateData: Record<string, unknown> = { failedLoginCount: newCount };

      if (newCount >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
        updateData.failedLoginCount = 0;
      }

      await this.prisma.user.update({ where: { id: user.id }, data: updateData });
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, ipAddress, userAgent);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    if (!this.prisma.isConnected) {
      const accessToken = this.jwtService.sign(
        { sub: 'demo_user', email: 'student@demo.skillsync.local', role: 'STUDENT' },
        { secret: this.config.get<string>('JWT_SECRET', 'skillsync-dev-jwt-secret-minimum-32-chars') },
      );
      return {
        user: { id: 'demo_user', email: 'student@demo.skillsync.local', role: UserRole.STUDENT, status: UserStatus.ACTIVE },
        accessToken,
        refreshToken: uuidv4(),
      };
    }

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const { user } = tokenRecord;
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async logout(refreshToken: string) {
    if (!this.prisma.isConnected) return;
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET', 'skillsync-dev-jwt-secret-minimum-32-chars'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRY', '15m'),
    });

    const refreshTokenValue = uuidv4();
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (this.prisma.isConnected) {
      await this.prisma.refreshToken.create({
        data: {
          token: refreshTokenValue,
          userId,
          expiresAt: refreshExpiry,
          ipAddress,
          userAgent,
        },
      });
    }

    return { accessToken, refreshToken: refreshTokenValue };
  }

  private sanitizeUser(user: { id: string; email: string; role: UserRole; status: UserStatus }) {
    return { id: user.id, email: user.email, role: user.role, status: user.status };
  }
}
