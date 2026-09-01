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

  async findAll(opts: { search?: string; categoryId?: string; page?: number; limit?: number } = {}) {
    if (!this.prisma.isConnected) {
      let filtered = DEMO_SKILLS;
      if (opts.search) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(opts.search!.toLowerCase()));
      }
      return { skills: filtered, total: filtered.length, page: 1, limit: 50, pages: 1 };
    }

    const { search, categoryId, page = 1, limit = 50 } = opts;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({ where, include: { category: true }, skip, take: limit }),
      this.prisma.skill.count({ where }),
    ]);

    return { skills, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    if (!this.prisma.isConnected) {
      const skill = DEMO_SKILLS.find(s => s.id === id) || DEMO_SKILLS[0];
      return { ...skill, relatedSkills: [] };
    }

    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async getCategories() {
    if (!this.prisma.isConnected) return DEMO_CATEGORIES;
    return this.prisma.skillCategory.findMany({ include: { _count: { select: { skills: true } } } });
  }

  async getTrendingSkills(limit = 10) {
    if (!this.prisma.isConnected) return DEMO_SKILLS.slice(0, limit);
    return this.prisma.skill.findMany({ orderBy: { demandLevel: 'desc' }, take: limit, include: { category: true } });
  }

  async getSkillDemand() {
    if (!this.prisma.isConnected) {
      return DEMO_SKILLS.map(s => ({ ...s, demandCount: Math.round(s.demandLevel * 1.5) }));
    }
    return DEMO_SKILLS;
  }

  async getSkillGraph(skillId: string) {
    return this.findOne(skillId);
  }
}
