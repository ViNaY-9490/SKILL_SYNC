import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'SHORTLISTED',
    title: "You've been shortlisted! 🎉",
    body: 'NovaStack Technologies shortlisted you for Backend Development Intern. Check your application status.',
    actionUrl: '/dashboard/student/applications',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    type: 'NEW_RECOMMENDATION',
    title: 'New opportunity match: 87%',
    body: 'CloudForge Innovations is hiring Full Stack Engineers. Your skills match 87% of requirements.',
    actionUrl: '/dashboard/student/opportunities',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, opts: { unread?: boolean; limit?: number } = {}) {
    if (!this.prisma.isConnected) {
      return { notifications: DEMO_NOTIFICATIONS, total: DEMO_NOTIFICATIONS.length, unreadCount: 2 };
    }

    const { unread, limit = 20 } = opts;
    const where: any = { userId };
    if (unread) where.isRead = false;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit }),
      this.prisma.notification.count({ where }),
    ]);

    return { notifications, total, unreadCount: notifications.filter(n => !n.isRead).length };
  }
}
