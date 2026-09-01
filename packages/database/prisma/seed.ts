import { PrismaClient, UserRole, UserStatus, SkillLevel, OpportunityType, OpportunityStatus, WorkMode, ApplicationStatus, GapSeverity, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================
// DEMO CREDENTIALS (development/demo only — never use in prod)
// ============================================================
const DEMO_ACCOUNTS = [
  { email: 'student@demo.skillsync.local', password: 'Demo@1234', role: UserRole.STUDENT, firstName: 'Arjun', lastName: 'Sharma' },
  { email: 'student2@demo.skillsync.local', password: 'Demo@1234', role: UserRole.STUDENT, firstName: 'Priya', lastName: 'Nair' },
  { email: 'student3@demo.skillsync.local', password: 'Demo@1234', role: UserRole.STUDENT, firstName: 'Rohan', lastName: 'Patel' },
  { email: 'recruiter@demo.skillsync.local', password: 'Demo@1234', role: UserRole.INDUSTRY, firstName: 'Meera', lastName: 'Krishnan' },
  { email: 'faculty@demo.skillsync.local', password: 'Demo@1234', role: UserRole.FACULTY, firstName: 'Dr. Suresh', lastName: 'Menon' },
  { email: 'institution@demo.skillsync.local', password: 'Demo@1234', role: UserRole.INSTITUTION_ADMIN, firstName: 'Placement', lastName: 'Officer' },
  { email: 'admin@demo.skillsync.local', password: 'Demo@1234', role: UserRole.SUPER_ADMIN, firstName: 'Platform', lastName: 'Admin' },
];

async function main() {
  console.log('🌱 Starting SkillSync seed...');

  // -----------------------------------------------------------
  // SKILL CATEGORIES + SKILLS TAXONOMY
  // -----------------------------------------------------------
  console.log('Creating skill taxonomy...');

  const categories = await Promise.all([
    prisma.skillCategory.upsert({ where: { slug: 'programming' }, create: { name: 'Programming', slug: 'programming', description: 'Programming languages and paradigms' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'backend' }, create: { name: 'Backend Development', slug: 'backend' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'frontend' }, create: { name: 'Frontend Development', slug: 'frontend' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'database' }, create: { name: 'Database', slug: 'database' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'cloud' }, create: { name: 'Cloud & DevOps', slug: 'cloud' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'ai-ml' }, create: { name: 'AI/ML & Data Science', slug: 'ai-ml' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'mobile' }, create: { name: 'Mobile Development', slug: 'mobile' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'security' }, create: { name: 'Cybersecurity', slug: 'security' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'soft-skills' }, create: { name: 'Soft Skills', slug: 'soft-skills' }, update: {} }),
    prisma.skillCategory.upsert({ where: { slug: 'tools' }, create: { name: 'Tools & Platforms', slug: 'tools' }, update: {} }),
  ]);

  const [programming, backend, frontend, database, cloud, aiml, mobile, security, softSkills, tools] = categories;

  const skillsData = [
    // Programming
    { name: 'Python', slug: 'python', categoryId: programming.id, aliases: ['py'], demandLevel: 95 },
    { name: 'JavaScript', slug: 'javascript', categoryId: programming.id, aliases: ['JS', 'js'], demandLevel: 93 },
    { name: 'TypeScript', slug: 'typescript', categoryId: programming.id, aliases: ['TS'], demandLevel: 88 },
    { name: 'Java', slug: 'java', categoryId: programming.id, aliases: [], demandLevel: 85 },
    { name: 'C++', slug: 'cpp', categoryId: programming.id, aliases: ['c-plus-plus'], demandLevel: 70 },
    { name: 'Go', slug: 'golang', categoryId: programming.id, aliases: ['Golang'], demandLevel: 78 },
    { name: 'Rust', slug: 'rust', categoryId: programming.id, aliases: [], demandLevel: 65 },
    // Backend
    { name: 'Node.js', slug: 'nodejs', categoryId: backend.id, aliases: ['node', 'NodeJS'], demandLevel: 90 },
    { name: 'Django', slug: 'django', categoryId: backend.id, aliases: [], demandLevel: 82 },
    { name: 'FastAPI', slug: 'fastapi', categoryId: backend.id, aliases: [], demandLevel: 80 },
    { name: 'Spring Boot', slug: 'spring-boot', categoryId: backend.id, aliases: ['Spring'], demandLevel: 78 },
    { name: 'REST API', slug: 'rest-api', categoryId: backend.id, aliases: ['RESTful'], demandLevel: 90 },
    { name: 'GraphQL', slug: 'graphql', categoryId: backend.id, aliases: [], demandLevel: 75 },
    { name: 'NestJS', slug: 'nestjs', categoryId: backend.id, aliases: [], demandLevel: 72 },
    // Frontend
    { name: 'React', slug: 'react', categoryId: frontend.id, aliases: ['ReactJS', 'React.js'], demandLevel: 92 },
    { name: 'Next.js', slug: 'nextjs', categoryId: frontend.id, aliases: ['Next'], demandLevel: 88 },
    { name: 'Vue.js', slug: 'vuejs', categoryId: frontend.id, aliases: ['Vue'], demandLevel: 75 },
    { name: 'HTML/CSS', slug: 'html-css', categoryId: frontend.id, aliases: ['HTML', 'CSS'], demandLevel: 85 },
    { name: 'Tailwind CSS', slug: 'tailwind', categoryId: frontend.id, aliases: [], demandLevel: 82 },
    // Database
    { name: 'PostgreSQL', slug: 'postgresql', categoryId: database.id, aliases: ['Postgres', 'psql'], demandLevel: 88 },
    { name: 'MySQL', slug: 'mysql', categoryId: database.id, aliases: [], demandLevel: 80 },
    { name: 'MongoDB', slug: 'mongodb', categoryId: database.id, aliases: ['Mongo'], demandLevel: 82 },
    { name: 'SQL', slug: 'sql', categoryId: database.id, aliases: [], demandLevel: 90 },
    { name: 'Redis', slug: 'redis', categoryId: database.id, aliases: [], demandLevel: 78 },
    // Cloud & DevOps
    { name: 'Docker', slug: 'docker', categoryId: cloud.id, aliases: [], demandLevel: 92 },
    { name: 'Kubernetes', slug: 'kubernetes', categoryId: cloud.id, aliases: ['K8s'], demandLevel: 80 },
    { name: 'AWS', slug: 'aws', categoryId: cloud.id, aliases: ['Amazon Web Services'], demandLevel: 90 },
    { name: 'GCP', slug: 'gcp', categoryId: cloud.id, aliases: ['Google Cloud'], demandLevel: 78 },
    { name: 'Azure', slug: 'azure', categoryId: cloud.id, aliases: [], demandLevel: 78 },
    { name: 'CI/CD', slug: 'cicd', categoryId: cloud.id, aliases: ['GitHub Actions', 'Jenkins'], demandLevel: 85 },
    { name: 'Linux', slug: 'linux', categoryId: cloud.id, aliases: ['Unix'], demandLevel: 82 },
    // AI/ML
    { name: 'Machine Learning', slug: 'machine-learning', categoryId: aiml.id, aliases: ['ML'], demandLevel: 90 },
    { name: 'Deep Learning', slug: 'deep-learning', categoryId: aiml.id, aliases: ['DL', 'Neural Networks'], demandLevel: 85 },
    { name: 'TensorFlow', slug: 'tensorflow', categoryId: aiml.id, aliases: [], demandLevel: 82 },
    { name: 'PyTorch', slug: 'pytorch', categoryId: aiml.id, aliases: [], demandLevel: 83 },
    { name: 'Scikit-learn', slug: 'scikit-learn', categoryId: aiml.id, aliases: ['sklearn'], demandLevel: 82 },
    { name: 'Pandas', slug: 'pandas', categoryId: aiml.id, aliases: [], demandLevel: 85 },
    { name: 'NumPy', slug: 'numpy', categoryId: aiml.id, aliases: [], demandLevel: 83 },
    { name: 'Data Analysis', slug: 'data-analysis', categoryId: aiml.id, aliases: ['Data Analytics'], demandLevel: 88 },
    { name: 'Statistics', slug: 'statistics', categoryId: aiml.id, aliases: ['Statistical Analysis'], demandLevel: 82 },
    { name: 'LLMs', slug: 'llms', categoryId: aiml.id, aliases: ['Large Language Models', 'GenAI', 'Generative AI'], demandLevel: 95 },
    { name: 'MLOps', slug: 'mlops', categoryId: aiml.id, aliases: [], demandLevel: 78 },
    // Cybersecurity
    { name: 'Network Security', slug: 'network-security', categoryId: security.id, aliases: [], demandLevel: 80 },
    { name: 'Ethical Hacking', slug: 'ethical-hacking', categoryId: security.id, aliases: ['Penetration Testing', 'Pentesting'], demandLevel: 78 },
    { name: 'Cryptography', slug: 'cryptography', categoryId: security.id, aliases: [], demandLevel: 72 },
    { name: 'SIEM', slug: 'siem', categoryId: security.id, aliases: [], demandLevel: 75 },
    // Tools
    { name: 'Git', slug: 'git', categoryId: tools.id, aliases: ['GitHub', 'GitLab'], demandLevel: 95 },
    { name: 'Agile/Scrum', slug: 'agile', categoryId: tools.id, aliases: ['Scrum', 'Agile'], demandLevel: 85 },
    { name: 'Jira', slug: 'jira', categoryId: tools.id, aliases: [], demandLevel: 78 },
    // Soft Skills
    { name: 'Communication', slug: 'communication', categoryId: softSkills.id, aliases: [], demandLevel: 90 },
    { name: 'Problem Solving', slug: 'problem-solving', categoryId: softSkills.id, aliases: [], demandLevel: 92 },
    { name: 'Teamwork', slug: 'teamwork', categoryId: softSkills.id, aliases: ['Collaboration'], demandLevel: 88 },
    { name: 'Leadership', slug: 'leadership', categoryId: softSkills.id, aliases: [], demandLevel: 80 },
  ];

  const createdSkills: Record<string, string> = {};
  for (const skill of skillsData) {
    const created = await prisma.skill.upsert({
      where: { slug: skill.slug },
      create: skill,
      update: { demandLevel: skill.demandLevel },
    });
    createdSkills[skill.slug] = created.id;
  }

  console.log(`✓ Created ${Object.keys(createdSkills).length} skills`);

  // -----------------------------------------------------------
  // INSTITUTIONS
  // -----------------------------------------------------------
  console.log('Creating institutions...');
  const iitb = await prisma.institution.upsert({
    where: { id: 'inst_iitb' },
    create: {
      id: 'inst_iitb',
      name: 'IIT Bombay',
      shortName: 'IITB',
      type: 'IIT',
      city: 'Mumbai',
      state: 'Maharashtra',
      website: 'https://www.iitb.ac.in',
      naacGrade: 'A++',
      established: 1958,
      isVerified: true,
    },
    update: {},
  });

  const nit = await prisma.institution.upsert({
    where: { id: 'inst_nit' },
    create: {
      id: 'inst_nit',
      name: 'NIT Trichy',
      shortName: 'NITT',
      type: 'NIT',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      website: 'https://www.nitt.edu',
      naacGrade: 'A',
      established: 1964,
      isVerified: true,
    },
    update: {},
  });

  // -----------------------------------------------------------
  // ORGANIZATIONS (fictional but realistic)
  // -----------------------------------------------------------
  console.log('Creating organizations...');
  const orgs = await Promise.all([
    prisma.organization.upsert({
      where: { slug: 'novastack-technologies' },
      create: { name: 'NovaStack Technologies', slug: 'novastack-technologies', industry: 'Software', size: 'STARTUP', city: 'Bengaluru', state: 'Karnataka', isVerified: true, description: 'Full-stack software product company building enterprise SaaS solutions', website: 'https://novastack.example.com' },
      update: {},
    }),
    prisma.organization.upsert({
      where: { slug: 'bharatai-labs' },
      create: { name: 'BharatAI Labs', slug: 'bharatai-labs', industry: 'Artificial Intelligence', size: 'SME', city: 'Hyderabad', state: 'Telangana', isVerified: true, description: 'AI-first company building intelligent automation for Indian enterprises', website: 'https://bharatai.example.com' },
      update: {},
    }),
    prisma.organization.upsert({
      where: { slug: 'cloudforge-innovations' },
      create: { name: 'CloudForge Innovations', slug: 'cloudforge-innovations', industry: 'Cloud Computing', size: 'ENTERPRISE', city: 'Pune', state: 'Maharashtra', isVerified: true, description: 'Cloud-native infrastructure and DevOps solutions provider', website: 'https://cloudforge.example.com' },
      update: {},
    }),
    prisma.organization.upsert({
      where: { slug: 'medtech-analytics' },
      create: { name: 'MedTech Analytics', slug: 'medtech-analytics', industry: 'HealthTech', size: 'SME', city: 'Chennai', state: 'Tamil Nadu', isVerified: true, description: 'Healthcare data analytics and medical AI solutions', website: 'https://medtech.example.com' },
      update: {},
    }),
    prisma.organization.upsert({
      where: { slug: 'greengrid-systems' },
      create: { name: 'GreenGrid Systems', slug: 'greengrid-systems', industry: 'CleanTech', size: 'STARTUP', city: 'Ahmedabad', state: 'Gujarat', isVerified: true, description: 'Smart grid and renewable energy management systems', website: 'https://greengrid.example.com' },
      update: {},
    }),
  ]);

  const [novastack, bharatai, cloudforge, medtech, greengrid] = orgs;
  console.log(`✓ Created ${orgs.length} organizations`);

  // -----------------------------------------------------------
  // OPPORTUNITIES
  // -----------------------------------------------------------
  console.log('Creating opportunities...');
  const opportunities = await Promise.all([
    // Backend Intern at NovaStack
    prisma.opportunity.create({
      data: {
        organizationId: novastack.id,
        createdById: 'seed',
        title: 'Backend Development Intern',
        description: `Join NovaStack's engineering team to work on real production backend systems. 
You'll work with Python/FastAPI, PostgreSQL, and Redis to build scalable microservices. 
Mentorship from senior engineers, code reviews, and weekly 1:1s included.

Responsibilities:
- Design and implement REST APIs
- Write unit and integration tests
- Participate in sprint planning and retrospectives
- Deploy services using Docker and CI/CD

This is a high-impact internship with a pre-placement offer possibility.`,
        type: OpportunityType.INTERNSHIP,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.HYBRID,
        location: 'Bengaluru, Karnataka',
        duration: '3 months',
        stipend: '₹20,000/month',
        openings: 3,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibilityDegrees: ['B.Tech', 'B.E', 'MCA'],
        eligibilityYears: ['3', '4'],
        eligibilityMinCGPA: 7.0,
        skills: {
          create: [
            { skillId: createdSkills['python'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['rest-api'], isRequired: true, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['sql'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['git'], isRequired: true, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['docker'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['postgresql'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),

    // ML Engineer at BharatAI
    prisma.opportunity.create({
      data: {
        organizationId: bharatai.id,
        createdById: 'seed',
        title: 'ML Engineer Intern',
        description: `Work on cutting-edge AI/ML projects solving real Indian industry problems.
You'll build and deploy machine learning models for document processing, NLP, and computer vision.

What you'll do:
- Train and fine-tune ML models
- Build ML pipelines with MLflow
- Integrate models into production APIs
- Work with large datasets and feature engineering`,
        type: OpportunityType.INTERNSHIP,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.REMOTE,
        location: 'Remote (Hyderabad HQ)',
        duration: '6 months',
        stipend: '₹25,000/month',
        openings: 2,
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibilityDegrees: ['B.Tech', 'M.Tech', 'M.Sc'],
        eligibilityYears: ['3', '4', 'PG'],
        eligibilityMinCGPA: 7.5,
        skills: {
          create: [
            { skillId: createdSkills['python'], isRequired: true, requiredLevel: SkillLevel.ADVANCED },
            { skillId: createdSkills['machine-learning'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['pandas'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['numpy'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['statistics'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['deep-learning'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['pytorch'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['mlops'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),

    // Full Stack Job at CloudForge
    prisma.opportunity.create({
      data: {
        organizationId: cloudforge.id,
        createdById: 'seed',
        title: 'Full Stack Engineer',
        description: `Full-time role in CloudForge's product engineering team. 
Build and maintain cloud-native applications used by 100K+ users.

Stack: React + TypeScript, NestJS, PostgreSQL, Kubernetes, AWS.

Requirements:
- 0-2 years experience
- Strong fundamentals in JS/TS
- Understanding of cloud concepts
- Open source contributions a plus`,
        type: OpportunityType.JOB,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.HYBRID,
        location: 'Pune, Maharashtra',
        duration: 'Full-time',
        salary: '₹8–12 LPA',
        openings: 5,
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibilityDegrees: ['B.Tech', 'B.E', 'MCA'],
        skills: {
          create: [
            { skillId: createdSkills['react'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['typescript'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['nodejs'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['postgresql'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['docker'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['aws'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['kubernetes'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),

    // Data Science Live Project at MedTech
    prisma.opportunity.create({
      data: {
        organizationId: medtech.id,
        createdById: 'seed',
        title: 'Healthcare Data Analysis Live Project',
        description: `Collaborate with MedTech's data team on a real patient outcome prediction project.
Open to teams of 2-3 students. Work remotely with weekly industry mentor sessions.

Project Goal: Build an ML model to predict readmission risk from EMR data.
Skills gained: Healthcare NLP, data privacy, ML in regulated domains.`,
        type: OpportunityType.LIVE_PROJECT,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.REMOTE,
        location: 'Remote',
        duration: '8 weeks',
        openings: 6,
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        skills: {
          create: [
            { skillId: createdSkills['python'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['machine-learning'], isRequired: true, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['pandas'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['data-analysis'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['statistics'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),

    // Cybersecurity Workshop
    prisma.opportunity.create({
      data: {
        organizationId: greengrid.id,
        createdById: 'seed',
        title: 'IoT Security & Ethical Hacking Workshop',
        description: `3-day intensive workshop on securing IoT devices and industrial control systems.
Led by industry practitioners. Includes hands-on CTF challenges and certificate on completion.`,
        type: OpportunityType.WORKSHOP,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.ONSITE,
        location: 'Ahmedabad, Gujarat',
        duration: '3 days',
        openings: 30,
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        skills: {
          create: [
            { skillId: createdSkills['network-security'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['ethical-hacking'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),

    // LLM Research Intern at BharatAI
    prisma.opportunity.create({
      data: {
        organizationId: bharatai.id,
        createdById: 'seed',
        title: 'Generative AI Research Intern',
        description: `Join the LLM research team at BharatAI to work on Indic language AI.
Research focus: fine-tuning LLMs for Hindi/Tamil/Telugu, RAG systems, AI safety.

Publications possible. Strong mentorship from PhD researchers.`,
        type: OpportunityType.INTERNSHIP,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.HYBRID,
        location: 'Hyderabad, Telangana',
        duration: '6 months',
        stipend: '₹30,000/month',
        openings: 2,
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibilityDegrees: ['B.Tech', 'M.Tech', 'M.Sc'],
        eligibilityMinCGPA: 8.0,
        skills: {
          create: [
            { skillId: createdSkills['python'], isRequired: true, requiredLevel: SkillLevel.ADVANCED },
            { skillId: createdSkills['machine-learning'], isRequired: true, requiredLevel: SkillLevel.ADVANCED },
            { skillId: createdSkills['deep-learning'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['pytorch'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['llms'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['statistics'], isRequired: true, requiredLevel: SkillLevel.ADVANCED },
          ],
        },
      },
    }),

    // Frontend Internship at NovaStack
    prisma.opportunity.create({
      data: {
        organizationId: novastack.id,
        createdById: 'seed',
        title: 'Frontend Engineering Intern',
        description: `Build modern web interfaces used by enterprise clients worldwide.
Stack: React, TypeScript, Tailwind CSS, Storybook. 
You'll work directly with designers and product managers.`,
        type: OpportunityType.INTERNSHIP,
        status: OpportunityStatus.PUBLISHED,
        workMode: WorkMode.HYBRID,
        location: 'Bengaluru, Karnataka',
        duration: '3 months',
        stipend: '₹18,000/month',
        openings: 2,
        applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        eligibilityDegrees: ['B.Tech', 'B.E', 'BCA'],
        eligibilityYears: ['2', '3'],
        skills: {
          create: [
            { skillId: createdSkills['react'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['javascript'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['html-css'], isRequired: true, requiredLevel: SkillLevel.INTERMEDIATE },
            { skillId: createdSkills['typescript'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
            { skillId: createdSkills['tailwind'], isRequired: false, requiredLevel: SkillLevel.BEGINNER },
          ],
        },
      },
    }),
  ]);

  console.log(`✓ Created ${opportunities.length} opportunities`);

  // -----------------------------------------------------------
  // DEMO USERS
  // -----------------------------------------------------------
  console.log('Creating demo user accounts...');
  const BCRYPT_ROUNDS = 10;

  const users: Record<string, string> = {};
  for (const account of DEMO_ACCOUNTS) {
    const passwordHash = await bcrypt.hash(account.password, BCRYPT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: account.email },
      create: {
        email: account.email,
        passwordHash,
        role: account.role,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
      },
      update: {},
    });
    users[account.email] = user.id;

    // Create role-specific profiles
    if (account.role === UserRole.STUDENT) {
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName: account.firstName,
          lastName: account.lastName,
          bio: account.email === 'student@demo.skillsync.local'
            ? 'Final year Computer Science student passionate about backend development and distributed systems. Looking for opportunities to apply my skills in a real-world setting.'
            : 'Third year student interested in AI/ML and data science. Active open source contributor.',
          city: account.email === 'student@demo.skillsync.local' ? 'Mumbai' : 'Chennai',
          state: account.email === 'student@demo.skillsync.local' ? 'Maharashtra' : 'Tamil Nadu',
          linkedinUrl: `https://linkedin.com/in/${account.firstName.toLowerCase()}-${account.lastName.toLowerCase()}`,
          githubUrl: `https://github.com/${account.firstName.toLowerCase()}${account.lastName.toLowerCase()}`,
          onboardingCompleted: true,
          placementReadinessScore: account.email === 'student@demo.skillsync.local' ? 72 : 58,
        },
        update: {},
      });
    } else if (account.role === UserRole.INDUSTRY) {
      await prisma.industryProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName: account.firstName,
          lastName: account.lastName,
          organizationId: novastack.id,
          designation: 'Engineering Manager',
          bio: 'Engineering leader at NovaStack with 8 years of experience in hiring and mentoring engineers.',
          onboardingCompleted: true,
        },
        update: {},
      });
    } else if (account.role === UserRole.FACULTY) {
      await prisma.facultyProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName: account.firstName,
          lastName: account.lastName,
          designation: 'Associate Professor',
          department: 'Computer Science and Engineering',
          institutionName: 'IIT Bombay',
          expertise: ['Machine Learning', 'Natural Language Processing', 'Data Mining'],
          researchInterests: ['Generative AI', 'Federated Learning', 'AI for Social Good'],
          bio: 'PhD from IISc. Research focus on AI/ML with 40+ publications. Industry collaborations with Google and ISRO.',
          isAvailableForMentorship: true,
          isAvailableForConsultancy: true,
          onboardingCompleted: true,
        },
        update: {},
      });
    } else if (account.role === UserRole.INSTITUTION_ADMIN || account.role === UserRole.PLACEMENT_OFFICER) {
      await prisma.institutionProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName: account.firstName,
          lastName: account.lastName,
          institutionId: iitb.id,
          designation: 'Placement Coordinator',
          department: 'Training & Placement Cell',
        },
        update: {},
      });
    }
  }

  // -----------------------------------------------------------
  // STUDENT SKILLS for demo student 1 (Arjun Sharma)
  // -----------------------------------------------------------
  console.log('Setting up demo student profiles...');

  const studentUserId = users['student@demo.skillsync.local'];
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) throw new Error('Demo student not found');

  // Arjun is a Backend Dev student
  const arjunSkills = [
    { slug: 'python', level: SkillLevel.ADVANCED, score: 82, rating: 4, verified: true },
    { slug: 'sql', level: SkillLevel.INTERMEDIATE, score: 74, rating: 4, verified: false },
    { slug: 'javascript', level: SkillLevel.INTERMEDIATE, score: 68, rating: 3, verified: false },
    { slug: 'rest-api', level: SkillLevel.DEVELOPING, score: 60, rating: 3, verified: false },
    { slug: 'django', level: SkillLevel.DEVELOPING, score: 55, rating: 3, verified: false },
    { slug: 'git', level: SkillLevel.INTERMEDIATE, score: 78, rating: 4, verified: true },
    { slug: 'linux', level: SkillLevel.BEGINNER, score: 40, rating: 2, verified: false },
    { slug: 'postgresql', level: SkillLevel.BEGINNER, score: 45, rating: 2, verified: false },
    { slug: 'problem-solving', level: SkillLevel.ADVANCED, score: 85, rating: 5, verified: false },
    { slug: 'communication', level: SkillLevel.INTERMEDIATE, score: 70, rating: 3, verified: false },
  ];

  for (const s of arjunSkills) {
    const skillId = createdSkills[s.slug];
    if (!skillId) continue;
    await prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId: student.id, skillId } },
      create: {
        studentId: student.id,
        skillId,
        selfRating: s.rating,
        assessmentScore: s.score,
        computedLevel: s.level,
        confidenceScore: 0.75,
        verificationStatus: s.verified ? VerificationStatus.VERIFIED : VerificationStatus.UNVERIFIED,
        verifiedAt: s.verified ? new Date() : null,
      },
      update: {},
    });
  }

  // Arjun's skill gaps (for Backend Dev role)
  const arjunGaps = [
    { slug: 'docker', severity: GapSeverity.HIGH, required: SkillLevel.INTERMEDIATE, current: null },
    { slug: 'aws', severity: GapSeverity.HIGH, required: SkillLevel.BEGINNER, current: null },
    { slug: 'kubernetes', severity: GapSeverity.MEDIUM, required: SkillLevel.BEGINNER, current: null },
    { slug: 'nestjs', severity: GapSeverity.MEDIUM, required: SkillLevel.BEGINNER, current: null },
    { slug: 'redis', severity: GapSeverity.LOW, required: SkillLevel.BEGINNER, current: null },
  ];

  for (const gap of arjunGaps) {
    const skillId = createdSkills[gap.slug];
    if (!skillId) continue;
    await prisma.skillGap.upsert({
      where: { id: `gap_${student.id}_${skillId}` },
      create: {
        id: `gap_${student.id}_${skillId}`,
        studentId: student.id,
        skillId,
        targetRole: 'Backend Developer',
        severity: gap.severity,
        requiredLevel: gap.required,
        estimatedEffort: gap.severity === 'HIGH' ? '6-8 weeks' : '2-4 weeks',
        priority: arjunGaps.indexOf(gap),
      },
      update: {},
    });
  }

  // Arjun's projects
  await prisma.studentProject.upsert({
    where: { id: 'proj_arjun_1' },
    create: {
      id: 'proj_arjun_1',
      studentId: student.id,
      title: 'InventoryFlow — Inventory Management REST API',
      description: 'A FastAPI-based REST API for SME inventory management with JWT auth, PostgreSQL, and comprehensive testing.',
      repoUrl: 'https://github.com/arjunsharma/inventoryflow',
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'JWT', 'pytest'],
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-11-15'),
      isFeatured: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    update: {},
  });

  await prisma.studentProject.upsert({
    where: { id: 'proj_arjun_2' },
    create: {
      id: 'proj_arjun_2',
      studentId: student.id,
      title: 'StudyBuddy — Peer Learning Platform',
      description: 'Full-stack web app where students can create study groups, share notes, and schedule sessions.',
      repoUrl: 'https://github.com/arjunsharma/studybuddy',
      liveUrl: 'https://studybuddy.demo',
      techStack: ['React', 'Python', 'Django', 'PostgreSQL', 'WebSocket'],
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-30'),
      isFeatured: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    update: {},
  });

  // Arjun's education
  await prisma.education.upsert({
    where: { id: 'edu_arjun_1' },
    create: {
      id: 'edu_arjun_1',
      studentId: student.id,
      institution: 'IIT Bombay',
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      startYear: 2021,
      endYear: 2025,
      cgpa: 8.4,
      isCurrently: true,
    },
    update: {},
  });

  // Arjun's career goal
  await prisma.careerGoal.upsert({
    where: { id: 'goal_arjun_1' },
    create: {
      id: 'goal_arjun_1',
      studentId: student.id,
      targetRole: 'Backend Developer',
      targetIndustry: 'Software Product',
      targetTimeline: '6 months',
      description: 'Want to join a product company as a backend engineer, building scalable APIs and distributed systems.',
      isPrimary: true,
    },
    update: {},
  });

  // Arjun's certification
  await prisma.studentCertification.upsert({
    where: { id: 'cert_arjun_1' },
    create: {
      id: 'cert_arjun_1',
      studentId: student.id,
      title: 'Python for Data Science and AI',
      issuedBy: 'IBM (Coursera)',
      issuedAt: new Date('2024-03-15'),
      credentialId: 'IBM-PYAI-2024',
      credentialUrl: 'https://coursera.org/verify/ABC123',
      skills: ['Python', 'Data Analysis', 'Machine Learning'],
      verificationStatus: VerificationStatus.VERIFIED,
    },
    update: {},
  });

  // Demo application — Arjun applied to NovaStack Backend Intern
  await prisma.application.upsert({
    where: { id: 'app_arjun_novastack' },
    create: {
      id: 'app_arjun_novastack',
      studentId: student.id,
      opportunityId: opportunities[0].id, // Backend Intern at NovaStack
      status: ApplicationStatus.SHORTLISTED,
      coverLetter: 'I am very interested in this internship as it aligns perfectly with my backend development journey.',
      matchScore: 78,
      matchBreakdown: { skillScore: 82, proficiencyScore: 72, eligibilityScore: 90 },
      appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      shortlistedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    update: {},
  });

  // Demo recommendations for Arjun
  await prisma.recommendation.createMany({
    data: [
      {
        studentId: student.id,
        type: 'OPPORTUNITY',
        opportunityId: opportunities[0].id,
        score: 85,
        reasons: JSON.stringify([
          { type: 'SKILL_MATCH', description: 'Python and SQL skills match', skill: 'Python' },
          { type: 'CAREER_GOAL', description: 'Aligned with Backend Developer goal' },
        ]),
        isDemo: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: student.id,
        type: 'COURSE',
        score: 90,
        reasons: JSON.stringify([
          { type: 'SKILL_GAP', description: 'Closes Docker gap (HIGH severity)', skill: 'Docker' },
        ]),
        isDemo: true,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------------------------------------
  // NOTIFICATIONS
  // -----------------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUserId,
        type: 'SHORTLISTED',
        title: 'You\'ve been shortlisted! 🎉',
        body: 'NovaStack Technologies shortlisted you for Backend Development Intern. Check your application status.',
        actionUrl: '/applications',
        isRead: false,
      },
      {
        userId: studentUserId,
        type: 'NEW_RECOMMENDATION',
        title: 'New opportunity match: 87%',
        body: 'CloudForge Innovations is hiring Full Stack Engineers. Your skills match 87% of requirements.',
        actionUrl: '/opportunities',
        isRead: false,
      },
      {
        userId: studentUserId,
        type: 'PROFILE_INCOMPLETE',
        title: 'Complete your profile to unlock more matches',
        body: 'Add Docker to your learning plan to close a high-priority skill gap for Backend Developer roles.',
        actionUrl: '/profile/skills',
        isRead: true,
        readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Created demo data for students');

  // -----------------------------------------------------------
  // SKILLS MODULE - Create a sample assessment
  // -----------------------------------------------------------
  await prisma.assessment.upsert({
    where: { id: 'assessment_python_basic' },
    create: {
      id: 'assessment_python_basic',
      title: 'Python Fundamentals Assessment',
      description: 'Test your Python skills covering data structures, OOP, and error handling',
      type: 'SKILL_KNOWLEDGE',
      duration: 30,
      totalMarks: 20,
      passingMarks: 12,
      isPublic: true,
      difficulty: 'MEDIUM',
      skills: {
        create: [{ skillId: createdSkills['python'], weight: 1.0 }],
      },
      questions: {
        create: [
          {
            type: 'MCQ',
            text: 'What is the output of: `print(type([]))` in Python?',
            options: JSON.stringify([
              { id: 'a', text: "<class 'list'>" },
              { id: 'b', text: "<class 'array'>" },
              { id: 'c', text: "<class 'tuple'>" },
              { id: 'd', text: 'list' },
            ]),
            correctAnswer: JSON.stringify({ answerIds: ['a'] }),
            explanation: 'The `type()` function returns the type of an object. Lists are of type `list`.',
            marks: 1,
            difficulty: 'EASY',
            order: 1,
          },
          {
            type: 'MCQ',
            text: 'Which of the following is NOT a valid way to create a dictionary in Python?',
            options: JSON.stringify([
              { id: 'a', text: "d = {'key': 'value'}" },
              { id: 'b', text: "d = dict(key='value')" },
              { id: 'c', text: "d = dict({'key': 'value'})" },
              { id: 'd', text: "d = {'key' => 'value'}" },
            ]),
            correctAnswer: JSON.stringify({ answerIds: ['d'] }),
            explanation: 'Python uses `:` to separate keys and values in dictionaries, not `=>`.',
            marks: 1,
            difficulty: 'EASY',
            order: 2,
          },
          {
            type: 'MCQ',
            text: 'What is the time complexity of appending to a Python list using `append()`?',
            options: JSON.stringify([
              { id: 'a', text: 'O(n)' },
              { id: 'b', text: 'O(1) amortized' },
              { id: 'c', text: 'O(log n)' },
              { id: 'd', text: 'O(n²)' },
            ]),
            correctAnswer: JSON.stringify({ answerIds: ['b'] }),
            explanation: 'Python lists are dynamic arrays. Append is O(1) amortized because the list doubles in size periodically.',
            marks: 2,
            difficulty: 'MEDIUM',
            order: 3,
          },
        ],
      },
    },
    update: {},
  });

  console.log('\n✅ Seed completed successfully!\n');
  console.log('=== DEMO CREDENTIALS (development only) ===');
  for (const account of DEMO_ACCOUNTS) {
    console.log(`${account.role.padEnd(20)} | ${account.email.padEnd(45)} | ${account.password}`);
  }
  console.log('===========================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
