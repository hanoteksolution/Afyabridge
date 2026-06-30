import type { PrismaClient, SectionType } from "@prisma/client";

type SectionDef = {
  type: SectionType;
  title?: string;
  subtitle?: string;
  variant?: string;
  buttonText?: string;
  buttonLink?: string;
  description?: string;
};

type PageDef = {
  slug: string;
  title: string;
  description: string;
  sections: SectionDef[];
};

const ALL_MODULES = [
  { name: "Patient Registration & Records", slug: "registration", description: "Digitize patient information and access complete medical records instantly.", icon: "UserPlus", benefits: ["Digitize patient information", "Instant access to records", "Reduce paperwork"], order: 0 },
  { name: "Electronic Medical Records (EMR)", slug: "emr", description: "Centralized patient records with secure access, history tracking, and clinical documentation.", icon: "FileText", benefits: ["Centralized clinical records", "Secure history tracking", "Structured documentation"], order: 1 },
  { name: "Appointments & Scheduling", slug: "appointments", description: "Manage appointments efficiently, reduce congestion and improve patient flow.", icon: "Calendar", benefits: ["Doctor availability", "Queue management", "Reduced waiting times"], order: 2 },
  { name: "Billing & Payments", slug: "billing", description: "Accurate billing and invoicing with improved financial visibility.", icon: "CreditCard", benefits: ["Automated invoicing", "Payment tracking", "Insurance & claims"], order: 3 },
  { name: "Pharmacy Management", slug: "pharmacy", description: "Prescription tracking, inventory management, and dispensing accuracy.", icon: "Pill", benefits: ["Prescription tracking", "Stock management", "Dispensing accuracy"], order: 4 },
  { name: "Laboratory & Diagnostics", slug: "laboratory", description: "Integrated lab workflows, result tracking and reporting.", icon: "FlaskConical", benefits: ["Test orders", "Results management", "EMR integration"], order: 5 },
  { name: "Inventory & Supplies", slug: "inventory", description: "Track medical supplies, prevent stock-outs, and improve procurement.", icon: "Package", benefits: ["Track supplies", "Prevent stock-outs", "Procurement planning"], order: 6 },
  { name: "Dashboards & Reporting", slug: "dashboards", description: "Real-time operational, financial, and clinical insights.", icon: "BarChart3", benefits: ["Real-time insights", "Performance tracking", "Data-driven decisions"], order: 7 },
  { name: "Integrations & Administration", slug: "integrations", description: "Role-based access, audit logs, APIs and exports.", icon: "Workflow", benefits: ["Role-based access", "Audit logs", "APIs & data export"], order: 8 },
];

const CLINIC_MODULES = ALL_MODULES.filter((m) =>
  ["registration", "appointments", "billing", "pharmacy", "dashboards"].includes(m.slug)
);

const HOSPITAL_MODULES = ALL_MODULES.filter((m) =>
  ["emr", "appointments", "billing", "laboratory", "inventory", "dashboards", "integrations"].includes(m.slug)
);

const SOLUTIONS_INDUSTRIES = [
  { name: "Clinics", slug: "clinics", description: "Simple, modular tools that help clinics digitize operations and serve more patients.", benefits: { icon: "Stethoscope", items: ["Fast onboarding", "Essential modules", "Affordable pricing"] }, order: 0 },
  { name: "Hospitals", slug: "hospitals", description: "Integrated systems connecting departments and supporting leadership decisions.", benefits: { icon: "Building2", items: ["Multi-department workflows", "Leadership dashboards", "Phased rollout"] }, order: 1 },
  { name: "Health Centers", slug: "health-centers", description: "Community health centers delivering primary care with efficient digital workflows.", benefits: { icon: "HeartPulse", items: ["Primary care workflows", "Community outreach", "Donor reporting"] }, order: 2 },
  { name: "Growing Practices", slug: "growing-practices", description: "Scale without outgrowing your software as your practice expands.", benefits: { icon: "TrendingUp", items: ["Multi-location", "Growth analytics", "Flexible modules"] }, order: 3 },
  { name: "Healthcare Networks", slug: "healthcare-networks", description: "Unified platform for networks operating across multiple facilities.", benefits: { icon: "Network", items: ["Centralized reporting", "Network standards", "Resource sharing"] }, order: 4 },
  { name: "NGOs & Donors", slug: "ngos-donors", description: "Run community health programs with accountability and donor-ready reporting.", benefits: { icon: "Handshake", items: ["Program tracking", "Impact reporting", "Multi-site visibility"] }, order: 5 },
];

const IMPLEMENTATION_STEPS = [
  { title: "Assessment", description: "Understand your workflows, needs, and goals before anything is configured.", icon: "Search", order: 0 },
  { title: "Setup & Configuration", description: "Tailor modules, roles, and workflows to your facility's operations.", icon: "Settings", order: 1 },
  { title: "Training", description: "Hands-on training for clinical, administrative, and management teams.", icon: "GraduationCap", order: 2 },
  { title: "Go-Live", description: "Phased rollout with on-site or remote support to minimize disruption.", icon: "Rocket", order: 3 },
  { title: "Ongoing Support", description: "Optimization, updates, and assistance long after go-live.", icon: "Headphones", order: 4 },
];

const CONSULTING_CONTENT = {
  variant: "CONSULTING",
  consultingEyebrow: "Expert Consulting Services",
  consultingTitle: "We Help You Improve Operations and Deliver Better Care",
  consultingServices: [
    { title: "Process Optimization", description: "Analyze current workflows and redesign them for maximum efficiency and patient throughput.", icon: "Settings" },
    { title: "Digital Transformation", description: "Digitize paper-based processes and integrate systems for seamless data flow.", icon: "Monitor" },
    { title: "Training & Capacity Building", description: "Hands-on training programs that ensure your team adopts and masters the platform.", icon: "GraduationCap" },
    { title: "Change Management", description: "Guide your team through organizational change with proven adoption strategies.", icon: "Users" },
  ],
};

const MISSION_VALUES = [
  { type: "mission", title: "Mission", content: "To bridge technology and care by enabling healthcare providers to operate efficiently, care compassionately, and grow sustainably.", order: 0 },
  { type: "vision", title: "Vision", content: "A world where every healthcare provider, regardless of size or location, can deliver exceptional patient care.", order: 1 },
  { type: "commitment", title: "Commitment", content: "We commit to being a trusted partner by delivering practical, reliable technology, continuous support, and long-term value.", order: 2 },
  { type: "value", title: "Patient-Centric Care", content: "Every decision we make is guided by how it improves patient outcomes, access, and experience.", order: 3 },
  { type: "value", title: "Practical Innovation", content: "Technology that solves real healthcare problems and works in real clinical environments.", order: 4 },
  { type: "value", title: "Operational Excellence", content: "Simplify workflows, reduce errors, and improve visibility so teams focus on care.", order: 5 },
  { type: "value", title: "Partnership & Trust", content: "Long-term relationships built on reliability, transparency, and consistent support.", order: 6 },
];

export const MARKETING_PAGE_DEFS: PageDef[] = [
  {
    slug: "about",
    title: "About Afya Bridge",
    description: "Empowering better healthcare through practical technology across East Africa.",
    sections: [
      { type: "CUSTOM", title: "About Afya Bridge", subtitle: "Our Story", variant: "PAGE_HEADER", description: "We bridge technology and care — helping clinics and hospitals deliver better outcomes with software built for real healthcare environments." },
      { type: "MISSION_VISION", title: "Mission, Vision & Values" },
      { type: "WHY_AFYA", title: "What Makes Us Different", subtitle: "Built for real healthcare environments." },
      { type: "TESTIMONIALS", title: "Trusted by Healthcare Leaders" },
      { type: "CTA", title: "Partner With Afya Bridge", subtitle: "Build a future where technology elevates patient care.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "platform",
    title: "Platform & Modules",
    description: "One connected platform for healthcare operations — modular, scalable, and built for East Africa.",
    sections: [
      { type: "CUSTOM", title: "One Connected Platform for Healthcare Operations", subtitle: "The Platform", variant: "PAGE_HEADER", description: "Integrated modules that work together seamlessly — from patient registration to leadership dashboards." },
      { type: "PLATFORM_MODULES", title: "Everything You Need — One Platform", subtitle: "Modular, scalable, and built for East African healthcare." },
      { type: "TRUST_BAR", title: "Healthcare-Grade Security & Compliance" },
      { type: "CTA", title: "See the Platform in Action", subtitle: "Request a personalized walkthrough of the modules that matter most to your facility.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "solutions",
    title: "Solutions",
    description: "Healthcare software solutions for every care environment — clinics, hospitals, networks, and more.",
    sections: [
      { type: "CUSTOM", title: "One Connected Healthcare Platform", subtitle: "Our Solutions", variant: "PAGE_HEADER", description: "Purpose-built solutions for every scale of healthcare delivery in East Africa." },
      { type: "WHO_WE_SERVE", title: "Solutions Designed for Every Care Environment" },
      { type: "PLATFORM_MODULES", title: "Platform Capabilities", subtitle: "The modules that power every solution." },
      { type: "CTA", title: "Find the Right Solution", subtitle: "Tell us about your facility and we'll recommend the right modules and rollout plan.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "clinics",
    title: "Healthcare Software for Clinics",
    description: "Serve more patients. Reduce admin work. Affordable, modular software built for outpatient clinics.",
    sections: [
      { type: "CUSTOM", title: "Serve More Patients. Reduce Admin Work.", subtitle: "For Clinics", variant: "PAGE_HEADER", description: "Simple, modular tools that help clinics digitize operations, reduce paperwork, and serve more patients efficiently." },
      { type: "WHY_AFYA", title: "Built for Clinics", subtitle: "Everything a busy outpatient practice needs — without enterprise complexity." },
      { type: "PLATFORM_MODULES", title: "Essential Modules for Clinics" },
      { type: "TESTIMONIALS", title: "Clinics Using Afya Bridge" },
      { type: "CTA", title: "Get Started for Clinics", subtitle: "Go live in weeks with training and local support included.", buttonText: "Request a Clinic Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "hospitals",
    title: "Healthcare Software for Hospitals",
    description: "Improve patient flow. Strengthen operations. Integrated hospital management for East Africa.",
    sections: [
      { type: "CUSTOM", title: "Improve Patient Flow. Strengthen Operations.", subtitle: "For Hospitals", variant: "PAGE_HEADER", description: "Integrated systems that connect departments, improve coordination, and support leadership decision-making." },
      { type: "WHY_AFYA", title: "Built for Hospitals", subtitle: "Multi-department workflows, leadership visibility, and phased implementation." },
      { type: "PLATFORM_MODULES", title: "Hospital-Grade Modules" },
      { type: "OUR_APPROACH", title: "Phased Hospital Rollout" },
      { type: "TESTIMONIALS", title: "Hospitals Using Afya Bridge" },
      { type: "CTA", title: "Get Started for Hospitals", subtitle: "Structured implementation designed for complex hospital environments.", buttonText: "Request a Hospital Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "consulting",
    title: "Healthcare Consulting",
    description: "Expert guidance to optimize operations, digitize workflows, and build team capacity.",
    sections: [
      { type: "CUSTOM", title: "Beyond Software — Expert Healthcare Consulting", subtitle: "Consulting", variant: "PAGE_HEADER", description: "We help healthcare organizations optimize processes, implement best practices, train teams, and improve service delivery." },
      { type: "CUSTOM", title: "We Help You Improve Operations and Deliver Better Care", variant: "CONSULTING" },
      { type: "OUR_APPROACH", title: "How We Work With You" },
      { type: "CTA", title: "Start a Consulting Engagement", subtitle: "Let's assess your operations and design a practical improvement plan.", buttonText: "Contact Our Team", buttonLink: "/contact" },
    ],
  },
  {
    slug: "implementation",
    title: "Implementation & Support",
    description: "Simple, structured, and supportive — from assessment to go-live and beyond.",
    sections: [
      { type: "CUSTOM", title: "Simple, Structured, and Supportive", subtitle: "Implementation", variant: "PAGE_HEADER", description: "We work closely with healthcare teams to ensure technology fits real clinical environments." },
      { type: "OUR_APPROACH", title: "From Assessment to Go-Live" },
      { type: "CUSTOM", title: "Training & Ongoing Partnership", variant: "CONSULTING" },
      { type: "CTA", title: "Plan Your Implementation", subtitle: "Our team will guide you through every step of the rollout.", buttonText: "Contact Our Team", buttonLink: "/contact" },
    ],
  },
  {
    slug: "why-afya-bridge",
    title: "Why Afya Bridge",
    description: "More than software — a healthcare partner with local expertise and long-term support.",
    sections: [
      { type: "CUSTOM", title: "More Than Software — A Healthcare Partner", subtitle: "Why Afya Bridge", variant: "PAGE_HEADER", description: "Healthcare providers face increasing pressure to deliver quality care while managing complex operations." },
      { type: "WHY_AFYA", title: "The Afya Bridge Difference" },
      { type: "TRUST_BAR", title: "Built on Trust & Security" },
      { type: "TESTIMONIALS", title: "What Our Partners Say" },
      { type: "CTA", title: "Experience the Difference", subtitle: "See why 500+ facilities across East Africa trust Afya Bridge.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "resources",
    title: "Resources & Insights",
    description: "Healthcare technology insights, case studies, and practical guides for East Africa.",
    sections: [
      { type: "CUSTOM", title: "Healthcare Technology Insights", subtitle: "Resources", variant: "PAGE_HEADER", description: "Practical articles and stories from clinics and hospitals transforming care with technology." },
      { type: "BLOG", title: "Latest Insights" },
      { type: "CASE_STUDIES", title: "Real Results, Real Impact" },
      { type: "CTA", title: "Stay Informed", subtitle: "Request a demo or subscribe to hear about new resources.", buttonText: "Contact Us", buttonLink: "/contact" },
    ],
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description: "Real results from clinics and hospitals using Afya Bridge across East Africa.",
    sections: [
      { type: "CUSTOM", title: "Real Results, Real Impact", subtitle: "Case Studies", variant: "PAGE_HEADER", description: "See how healthcare facilities improved patient flow, efficiency, and outcomes with Afya Bridge." },
      { type: "CASE_STUDIES", title: "Featured Success Stories" },
      { type: "CTA", title: "Write Your Success Story", subtitle: "Join the growing community of facilities transforming healthcare operations.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    description: "Everything you need to know about Afya Bridge — implementation, pricing, security, and support.",
    sections: [
      { type: "CUSTOM", title: "Everything You Need to Know", subtitle: "FAQ", variant: "FAQ" },
      { type: "CTA", title: "Ready to Get Started?", subtitle: "Simply request a demo. Our team will assess your needs and guide you through the next steps.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ],
  },
  {
    slug: "contact",
    title: "Contact Us",
    description: "Let's start a conversation about your facility's needs.",
    sections: [
      { type: "CONTACT", title: "Let's Start a Conversation", subtitle: "We would love to learn more about your facility and how we can help." },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How Afya Bridge collects, uses, and protects your information.",
    sections: [
      { type: "CUSTOM", title: "Privacy Policy", subtitle: "Legal", variant: "PAGE_HEADER", description: "Last updated: January 2025" },
      { type: "CUSTOM", title: "Privacy Policy", variant: "CONTENT" },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "Terms and conditions for using Afya Bridge services.",
    sections: [
      { type: "CUSTOM", title: "Terms of Service", subtitle: "Legal", variant: "PAGE_HEADER", description: "Last updated: January 2025" },
      { type: "CUSTOM", title: "Terms of Service", variant: "CONTENT" },
    ],
  },
];

async function findPageSection(
  prisma: PrismaClient,
  pageSlug: string,
  type: SectionType,
  variant?: string
) {
  const page = await prisma.page.findUnique({ where: { slug: pageSlug } });
  if (!page) return null;
  if (variant) {
    return prisma.section.findFirst({
      where: {
        pageId: page.id,
        type: "CUSTOM",
        content: { path: ["variant"], equals: variant },
      },
    });
  }
  return prisma.section.findFirst({ where: { pageId: page.id, type } });
}

async function seedModules(
  prisma: PrismaClient,
  sectionId: string,
  modules: typeof ALL_MODULES
) {
  await prisma.serviceModule.deleteMany({ where: { sectionId } });
  await prisma.serviceModule.createMany({
    data: modules.map((m) => ({
      sectionId,
      name: m.name,
      slug: m.slug,
      description: m.description,
      icon: m.icon,
      benefits: m.benefits,
      order: m.order,
    })),
  });
}

async function seedWhyCards(
  prisma: PrismaClient,
  sectionId: string,
  cards: { title: string; description: string; icon: string; order: number }[]
) {
  await prisma.whyCard.deleteMany({ where: { sectionId } });
  await prisma.whyCard.createMany({ data: cards.map((c) => ({ sectionId, ...c })) });
}

async function seedIndustries(
  prisma: PrismaClient,
  sectionId: string,
  industries: typeof SOLUTIONS_INDUSTRIES
) {
  await prisma.industry.deleteMany({ where: { sectionId } });
  await prisma.industry.createMany({
    data: industries.map((i) => ({
      sectionId,
      name: i.name,
      slug: i.slug,
      description: i.description,
      benefits: i.benefits,
      order: i.order,
    })),
  });
}

async function seedApproach(
  prisma: PrismaClient,
  sectionId: string,
  steps: typeof IMPLEMENTATION_STEPS
) {
  await prisma.approachStep.deleteMany({ where: { sectionId } });
  await prisma.approachStep.createMany({
    data: steps.map((s) => ({ sectionId, ...s })),
  });
}

async function seedMission(
  prisma: PrismaClient,
  sectionId: string,
  values: typeof MISSION_VALUES
) {
  await prisma.missionValue.deleteMany({ where: { sectionId } });
  await prisma.missionValue.createMany({
    data: values.map((v) => ({ sectionId, ...v })),
  });
}

async function seedTrustStats(
  prisma: PrismaClient,
  sectionId: string,
  stats: { label: string; value: number; suffix: string; icon: string; order: number }[]
) {
  await prisma.trustStat.deleteMany({ where: { sectionId } });
  await prisma.trustStat.createMany({ data: stats.map((s) => ({ sectionId, ...s })) });
}

const PRIVACY_BODY = `<p>Afya Bridge ("we", "our", or "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you use our website and services.</p>
<h3>Information We Collect</h3>
<p>We may collect contact information you submit through forms (name, email, phone, facility name), usage data about how you interact with our website, and technical data such as IP address and browser type.</p>
<h3>How We Use Information</h3>
<p>We use your information to respond to inquiries, provide demos and services, improve our platform, and communicate updates you have opted into.</p>
<h3>Data Security</h3>
<p>We implement healthcare-grade security practices including encryption, role-based access controls, and secure storage. Our platform is designed with audit-ready architecture.</p>
<h3>Contact</h3>
<p>Questions about this policy? Email us at hello@afyabridge.com.</p>`;

const TERMS_BODY = `<p>By accessing or using Afya Bridge services, you agree to these Terms of Service.</p>
<h3>Services</h3>
<p>Afya Bridge provides healthcare management software, implementation support, and consulting services. Specific terms for your facility are defined in your service agreement.</p>
<h3>Acceptable Use</h3>
<p>You agree to use our services lawfully and in compliance with applicable healthcare data protection regulations. You are responsible for maintaining the confidentiality of account credentials.</p>
<h3>Intellectual Property</h3>
<p>All software, branding, and content provided by Afya Bridge remain our intellectual property unless otherwise agreed in writing.</p>
<h3>Limitation of Liability</h3>
<p>To the extent permitted by law, Afya Bridge is not liable for indirect or consequential damages arising from use of our services.</p>
<h3>Contact</h3>
<p>For questions about these terms, contact hello@afyabridge.com.</p>`;

export async function ensureAndBackfillMarketingPages(prisma: PrismaClient) {
  for (const mp of MARKETING_PAGE_DEFS) {
    const page = await prisma.page.upsert({
      where: { slug: mp.slug },
      update: { title: mp.title, description: mp.description, isPublished: true },
      create: {
        title: mp.title,
        slug: mp.slug,
        description: mp.description,
        isPublished: true,
      },
    });

    await prisma.sEO.upsert({
      where: { pageId: page.id },
      update: { metaTitle: `${mp.title} | Afya Bridge`, metaDescription: mp.description },
      create: { pageId: page.id, metaTitle: `${mp.title} | Afya Bridge`, metaDescription: mp.description },
    });

    for (let i = 0; i < mp.sections.length; i++) {
      const s = mp.sections[i];
      const contentBase = s.variant
        ? {
            variant: s.variant,
            ...(s.variant === "PAGE_HEADER" && s.description ? { description: s.description } : {}),
          }
        : undefined;

      const existing = s.variant
        ? await prisma.section.findFirst({
            where: {
              pageId: page.id,
              type: s.type,
              content: { path: ["variant"], equals: s.variant },
            },
          })
        : await prisma.section.findFirst({ where: { pageId: page.id, type: s.type } });

      if (existing) {
        await prisma.section.update({
          where: { id: existing.id },
          data: {
            title: s.title,
            subtitle: s.subtitle,
            buttonText: s.buttonText,
            buttonLink: s.buttonLink,
            order: i,
            isVisible: true,
            ...(contentBase ? { content: contentBase } : {}),
          },
        });
      } else {
        await prisma.section.create({
          data: {
            pageId: page.id,
            type: s.type,
            title: s.title,
            subtitle: s.subtitle,
            content: contentBase,
            buttonText: s.buttonText,
            buttonLink: s.buttonLink,
            order: i,
            isVisible: true,
          },
        });
      }
    }
  }

  // --- Per-page child content (idempotent refresh) ---
  const aboutWhy = await findPageSection(prisma, "about", "WHY_AFYA");
  if (aboutWhy) {
    await prisma.section.update({
      where: { id: aboutWhy.id },
      data: { content: { eyebrow: "Our Approach" } },
    });
    await seedWhyCards(prisma, aboutWhy.id, [
      { title: "Built for real healthcare environments", description: "Software that works in busy clinics and hospitals — not just demos.", icon: "Building2", order: 0 },
      { title: "Local East Africa expertise", description: "Teams in Kenya and Tanzania who understand your regulations and workflows.", icon: "MapPin", order: 1 },
      { title: "Practical onboarding included", description: "Structured training and go-live support so your team adopts with confidence.", icon: "GraduationCap", order: 2 },
      { title: "Long-term partnership", description: "Ongoing support, optimization, and updates — we stay engaged after go-live.", icon: "Handshake", order: 3 },
    ]);
  }

  const aboutMission = await findPageSection(prisma, "about", "MISSION_VISION");
  if (aboutMission) await seedMission(prisma, aboutMission.id, MISSION_VALUES);

  const platformModules = await findPageSection(prisma, "platform", "PLATFORM_MODULES");
  if (platformModules) await seedModules(prisma, platformModules.id, ALL_MODULES);

  const platformTrust = await findPageSection(prisma, "platform", "TRUST_BAR");
  if (platformTrust) {
    await seedTrustStats(prisma, platformTrust.id, [
      { label: "Role-based access controls", value: 100, suffix: "%", icon: "Shield", order: 0 },
      { label: "Secure backups", value: 24, suffix: "/7", icon: "Lock", order: 1 },
      { label: "Audit-ready architecture", value: 100, suffix: "%", icon: "FileCheck", order: 2 },
      { label: "Healthcare data standards", value: 100, suffix: "%", icon: "ShieldCheck", order: 3 },
    ]);
  }

  const solutionsWws = await findPageSection(prisma, "solutions", "WHO_WE_SERVE");
  if (solutionsWws) {
    await prisma.section.update({
      where: { id: solutionsWws.id },
      data: { content: { eyebrow: "Who We Serve" } },
    });
    await seedIndustries(prisma, solutionsWws.id, SOLUTIONS_INDUSTRIES);
  }
  const solutionsModules = await findPageSection(prisma, "solutions", "PLATFORM_MODULES");
  if (solutionsModules) await seedModules(prisma, solutionsModules.id, ALL_MODULES);

  const clinicsWhy = await findPageSection(prisma, "clinics", "WHY_AFYA");
  if (clinicsWhy) {
    await seedWhyCards(prisma, clinicsWhy.id, [
      { title: "Fast onboarding with minimal disruption", description: "Go live in weeks with a phased rollout designed for busy clinics.", icon: "Zap", order: 0 },
      { title: "Reduce paperwork and admin burden", description: "Digitize registration, billing, and records so staff focus on patients.", icon: "ClipboardList", order: 1 },
      { title: "Serve more patients efficiently", description: "Queue management and scheduling tools that improve patient flow.", icon: "Users", order: 2 },
      { title: "Affordable, scalable pricing", description: "Start with essential modules and add more as your practice grows.", icon: "TrendingUp", order: 3 },
    ]);
  }
  const clinicsModules = await findPageSection(prisma, "clinics", "PLATFORM_MODULES");
  if (clinicsModules) await seedModules(prisma, clinicsModules.id, CLINIC_MODULES);

  const hospitalsWhy = await findPageSection(prisma, "hospitals", "WHY_AFYA");
  if (hospitalsWhy) {
    await seedWhyCards(prisma, hospitalsWhy.id, [
      { title: "Integrated departmental workflows", description: "Connect admission, wards, lab, pharmacy, and billing on one platform.", icon: "Workflow", order: 0 },
      { title: "Leadership visibility", description: "Real-time dashboards for occupancy, revenue, and clinical KPIs.", icon: "BarChart3", order: 1 },
      { title: "Improved patient flow", description: "Reduce bottlenecks from admission to discharge.", icon: "Activity", order: 2 },
      { title: "Phased implementation", description: "Roll out department by department with structured training.", icon: "Layers", order: 3 },
    ]);
  }
  const hospitalsModules = await findPageSection(prisma, "hospitals", "PLATFORM_MODULES");
  if (hospitalsModules) await seedModules(prisma, hospitalsModules.id, HOSPITAL_MODULES);
  const hospitalsApproach = await findPageSection(prisma, "hospitals", "OUR_APPROACH");
  if (hospitalsApproach) await seedApproach(prisma, hospitalsApproach.id, IMPLEMENTATION_STEPS);

  const consultingBlock = await findPageSection(prisma, "consulting", "CUSTOM", "CONSULTING");
  if (consultingBlock) {
    await prisma.section.update({
      where: { id: consultingBlock.id },
      data: { content: CONSULTING_CONTENT },
    });
  }
  const consultingApproach = await findPageSection(prisma, "consulting", "OUR_APPROACH");
  if (consultingApproach) await seedApproach(prisma, consultingApproach.id, IMPLEMENTATION_STEPS);

  const implApproach = await findPageSection(prisma, "implementation", "OUR_APPROACH");
  if (implApproach) await seedApproach(prisma, implApproach.id, IMPLEMENTATION_STEPS);
  const implConsulting = await findPageSection(prisma, "implementation", "CUSTOM", "CONSULTING");
  if (implConsulting) {
    await prisma.section.update({
      where: { id: implConsulting.id },
      data: {
        title: "Training & Ongoing Partnership",
        content: {
          ...CONSULTING_CONTENT,
          consultingEyebrow: "Support Beyond Go-Live",
          consultingTitle: "Training, Optimization & Long-Term Support",
          consultingServices: [
            { title: "Staff Training Programs", description: "Role-based training for clinical, admin, and management teams.", icon: "GraduationCap" },
            { title: "Process Optimization", description: "Continuous improvement of workflows after go-live.", icon: "Settings" },
            { title: "Technical Support", description: "Local support team available when you need assistance.", icon: "Headphones" },
            { title: "System Updates", description: "Regular platform updates with new features and security patches.", icon: "RefreshCw" },
          ],
        },
      },
    });
  }

  const whyPage = await findPageSection(prisma, "why-afya-bridge", "WHY_AFYA");
  if (whyPage) {
    await prisma.section.update({
      where: { id: whyPage.id },
      data: {
        content: {
          eyebrow: "Four Pillars. One Mission.",
          productTitle: "Better Patient Care",
          productDescription: "Every feature is built to help providers deliver timely, coordinated, high-quality care.",
          productFeatures: ["Patient flow optimization", "Coordinated care pathways", "Reduced wait times", "Better clinical outcomes"],
          productLink: "/platform",
          productLinkText: "Explore Platform",
          consultingTitle: "Local Partnership",
          consultingDescription: "We're your East Africa partner — we speak your language and know your regulations.",
          consultingFeatures: ["Kenya & Tanzania presence", "Local implementation teams", "Regulatory awareness", "Long-term support"],
          consultingLink: "/contact",
          consultingLinkText: "Talk to Our Team",
        },
      },
    });
    await seedWhyCards(prisma, whyPage.id, [
      { title: "Improve patient access and flow", description: "Streamline registration, triage, and care pathways.", icon: "Users", order: 0 },
      { title: "Reduce administrative burden", description: "Automate billing, scheduling, and records.", icon: "Clock", order: 1 },
      { title: "Strengthen operational visibility", description: "Real-time dashboards and reports for leadership.", icon: "BarChart3", order: 2 },
      { title: "Support sustainable growth", description: "Scale from clinic to multi-facility network.", icon: "TrendingUp", order: 3 },
    ]);
  }
  const whyTrust = await findPageSection(prisma, "why-afya-bridge", "TRUST_BAR");
  if (whyTrust) {
    await seedTrustStats(prisma, whyTrust.id, [
      { label: "Healthcare Facilities", value: 500, suffix: "+", icon: "Building2", order: 0 },
      { label: "Years Experience", value: 15, suffix: "+", icon: "Award", order: 1 },
      { label: "System Availability", value: 99, suffix: ".9%", icon: "Shield", order: 2 },
      { label: "Countries Served", value: 5, suffix: "", icon: "Globe", order: 3 },
    ]);
  }

  const privacyContent = await findPageSection(prisma, "privacy", "CUSTOM", "CONTENT");
  if (privacyContent) {
    await prisma.section.update({
      where: { id: privacyContent.id },
      data: { content: { variant: "CONTENT", body: PRIVACY_BODY } },
    });
  }
  const termsContent = await findPageSection(prisma, "terms", "CUSTOM", "CONTENT");
  if (termsContent) {
    await prisma.section.update({
      where: { id: termsContent.id },
      data: { content: { variant: "CONTENT", body: TERMS_BODY } },
    });
  }

  // Enrich case studies with full stories for detail pages
  await prisma.caseStudy.updateMany({
    where: { slug: "nairobi-central" },
    data: {
      story: "<p>Nairobi Central Clinic faced growing patient volumes and long wait times. After implementing Afya Bridge, they digitized registration, scheduling, and billing — reducing average wait times by 40% within the first month.</p><p>Staff now spend less time on paperwork and more time with patients. Leadership uses real-time dashboards to monitor daily operations and plan capacity.</p>",
      summary: "40% reduction in patient wait times with digitized clinic workflows",
    },
  });
  await prisma.caseStudy.updateMany({
    where: { slug: "coastal-regional" },
    data: {
      story: "<p>Coastal Regional Hospital needed to unify five departments on a single platform. Afya Bridge delivered a phased rollout across outpatient, lab, pharmacy, billing, and wards.</p><p>The hospital achieved 60% efficiency gains and a 75% reduction in billing errors, with leadership gaining visibility they never had before.</p>",
      summary: "Unified 5 departments on one platform with 60% efficiency gains",
    },
  });

  console.log("   Marketing pages backfilled with full CMS content.");
}

export async function seedMarketingMenus(prisma: PrismaClient) {
  const headerMenu = await prisma.menu.upsert({
    where: { slug: "header" },
    update: {},
    create: { name: "Header Navigation", slug: "header", location: "header" },
  });

  await prisma.menuItem.deleteMany({ where: { menuId: headerMenu.id } });
  const platform = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Platform", url: "/platform", order: 0 } });
  const solutions = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Solutions", url: "/solutions", order: 1 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: solutions.id, label: "For Clinics", url: "/clinics", order: 0 },
      { menuId: headerMenu.id, parentId: solutions.id, label: "For Hospitals", url: "/hospitals", order: 1 },
    ],
  });
  await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Consulting", url: "/consulting", order: 2 } });
  await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Implementation", url: "/implementation", order: 3 } });
  const resources = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Resources", url: "/resources", order: 4 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: resources.id, label: "Blog", url: "/blog", order: 0 },
      { menuId: headerMenu.id, parentId: resources.id, label: "Case Studies", url: "/case-studies", order: 1 },
      { menuId: headerMenu.id, parentId: resources.id, label: "FAQ", url: "/faq", order: 2 },
    ],
  });
  const company = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Company", url: "/about", order: 5 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: company.id, label: "About Us", url: "/about", order: 0 },
      { menuId: headerMenu.id, parentId: company.id, label: "Why Afya Bridge", url: "/why-afya-bridge", order: 1 },
      { menuId: headerMenu.id, parentId: company.id, label: "Contact", url: "/contact", order: 2 },
    ],
  });
  void platform;

  const footerMenu = await prisma.menu.upsert({
    where: { slug: "footer" },
    update: {},
    create: { name: "Footer Navigation", slug: "footer", location: "footer" },
  });

  await prisma.menuItem.deleteMany({ where: { menuId: footerMenu.id } });
  const footerPlatform = await prisma.menuItem.create({ data: { menuId: footerMenu.id, label: "Platform", url: "/platform", order: 0 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footerMenu.id, parentId: footerPlatform.id, label: "Platform Overview", url: "/platform", order: 0 },
      { menuId: footerMenu.id, parentId: footerPlatform.id, label: "Solutions", url: "/solutions", order: 1 },
      { menuId: footerMenu.id, parentId: footerPlatform.id, label: "For Clinics", url: "/clinics", order: 2 },
      { menuId: footerMenu.id, parentId: footerPlatform.id, label: "For Hospitals", url: "/hospitals", order: 3 },
    ],
  });
  const footerCompany = await prisma.menuItem.create({ data: { menuId: footerMenu.id, label: "Company", url: "/about", order: 1 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footerMenu.id, parentId: footerCompany.id, label: "About Us", url: "/about", order: 0 },
      { menuId: footerMenu.id, parentId: footerCompany.id, label: "Why Afya Bridge", url: "/why-afya-bridge", order: 1 },
      { menuId: footerMenu.id, parentId: footerCompany.id, label: "Implementation", url: "/implementation", order: 2 },
      { menuId: footerMenu.id, parentId: footerCompany.id, label: "Contact", url: "/contact", order: 3 },
    ],
  });
  const footerResources = await prisma.menuItem.create({ data: { menuId: footerMenu.id, label: "Resources", url: "/resources", order: 2 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Blog", url: "/blog", order: 0 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Case Studies", url: "/case-studies", order: 1 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "FAQ", url: "/faq", order: 2 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Request a Demo", url: "/contact", order: 3 },
    ],
  });
}
