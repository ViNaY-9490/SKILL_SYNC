import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEMO_CATEGORIES = [
  { id: 'cat_prog', name: 'Programming Languages', slug: 'programming', _count: { skills: 7 } },
  { id: 'cat_backend', name: 'Backend Development', slug: 'backend', _count: { skills: 6 } },
  { id: 'cat_frontend', name: 'Frontend Development', slug: 'frontend', _count: { skills: 5 } },
  { id: 'cat_db', name: 'Databases & Storage', slug: 'database', _count: { skills: 5 } },
  { id: 'cat_cloud', name: 'Cloud & DevOps', slug: 'cloud', _count: { skills: 6 } },
  { id: 'cat_aiml', name: 'AI / ML & Data Science', slug: 'ai-ml', _count: { skills: 8 } },
];

const DEMO_SKILLS = [
  { id: 'sk_py', name: 'Python', slug: 'python', category: DEMO_CATEGORIES[0], demandLevel: 95, description: 'High-level programming language widely used in AI, web backend, and data engineering.' },
  { id: 'sk_js', name: 'JavaScript', slug: 'javascript', category: DEMO_CATEGORIES[0], demandLevel: 93, description: 'Core language of the modern web.' },
  { id: 'sk_ts', name: 'TypeScript', slug: 'typescript', category: DEMO_CATEGORIES[0], demandLevel: 88, description: 'Typed superset of JavaScript.' },
  { id: 'sk_sql', name: 'SQL', slug: 'sql', category: DEMO_CATEGORIES[3], demandLevel: 90, description: 'Standard language for relational database management.' },
  { id: 'sk_rest', name: 'REST API', slug: 'rest-api', category: DEMO_CATEGORIES[1], demandLevel: 90, description: 'Architectural style for web services.' },
  { id: 'sk_dock', name: 'Docker', slug: 'docker', category: DEMO_CATEGORIES[4], demandLevel: 92, description: 'Containerization platform.' },
  { id: 'sk_react', name: 'React', slug: 'react', category: DEMO_CATEGORIES[2], demandLevel: 92, description: 'Frontend library for building user interfaces.' },
  { id: 'sk_node', name: 'Node.js', slug: 'nodejs', category: DEMO_CATEGORIES[1], demandLevel: 90, description: 'JavaScript runtime for server-side development.' },
  { id: 'sk_ml', name: 'Machine Learning', slug: 'machine-learning', category: DEMO_CATEGORIES[5], demandLevel: 90, description: 'Algorithms that learn from data.' },
  { id: 'sk_llm', name: 'LLMs & GenAI', slug: 'llms', category: DEMO_CATEGORIES[5], demandLevel: 95, description: 'Generative AI and Large Language Models.' },
];

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll(opts: { search?: string; categoryId?: string; page?: any; limit?: any } = {}) {
    const pageNum = Math.max(1, parseInt(String(opts.page || 1), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(opts.limit || 50), 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const filterDemo = () => {
      let filtered = DEMO_SKILLS;
      if (opts.search) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(String(opts.search).toLowerCase()));
      }
      return { skills: filtered, total: filtered.length, page: pageNum, limit: limitNum, pages: 1 };
    };

    if (!this.prisma.isConnected) {
      return filterDemo();
    }

    try {
      const { search, categoryId } = opts;
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (categoryId) where.categoryId = categoryId;

      const [skills, total] = await Promise.all([
        this.prisma.skill.findMany({ where, include: { category: true }, skip, take: limitNum }),
        this.prisma.skill.count({ where }),
      ]);

      return { skills, total, page: pageNum, limit: limitNum, pages: Math.max(1, Math.ceil(total / limitNum)) };
    } catch (err) {
      console.warn('⚠️ Skills DB query error, serving demo skills fallback:', (err as any)?.message);
      return filterDemo();
    }
  }

  async findOne(id: string) {
    if (!this.prisma.isConnected) {
      const skill = DEMO_SKILLS.find(s => s.id === id) || DEMO_SKILLS[0];
      return { ...skill, relatedSkills: [] };
    }

    try {
      const skill = await this.prisma.skill.findUnique({
        where: { id },
        include: { category: true },
      });
      if (!skill) {
        const demo = DEMO_SKILLS.find(s => s.id === id) || DEMO_SKILLS[0];
        return { ...demo, relatedSkills: [] };
      }
      return skill;
    } catch {
      const demo = DEMO_SKILLS.find(s => s.id === id) || DEMO_SKILLS[0];
      return { ...demo, relatedSkills: [] };
    }
  }

  async getCategories() {
    return this.prisma.safeExecute(
      () => this.prisma.skillCategory.findMany({ include: { _count: { select: { skills: true } } } }),
      DEMO_CATEGORIES as any,
    );
  }

  async getTrendingSkills(limit = 10) {
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 10);
    return this.prisma.safeExecute(
      () => this.prisma.skill.findMany({ orderBy: { demandLevel: 'desc' }, take: limitNum, include: { category: true } }),
      DEMO_SKILLS.slice(0, limitNum) as any,
    );
  }

  async getSkillDemand() {
    if (!this.prisma.isConnected) {
      return DEMO_SKILLS.map(s => ({ ...s, demandCount: Math.round(s.demandLevel * 1.5) }));
    }
    try {
      return await this.prisma.skill.findMany({ orderBy: { demandLevel: 'desc' }, take: 20 });
    } catch {
      return DEMO_SKILLS.map(s => ({ ...s, demandCount: Math.round(s.demandLevel * 1.5) }));
    }
  }

  async getSkillGraph(skillId: string) {
    return this.findOne(skillId);
  }
}
