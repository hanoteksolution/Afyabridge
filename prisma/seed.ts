import { PrismaClient, SectionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Afya Bridge database...");

  const allPermissions = [
    "dashboard:read", "pages:read", "pages:write", "sections:read", "sections:write",
    "media:read", "media:write", "seo:read", "seo:write", "menus:read", "menus:write",
    "settings:read", "settings:write", "users:read", "users:write", "roles:read", "roles:write",
    "blogs:read", "blogs:write", "testimonials:read", "testimonials:write",
    "case-studies:read", "case-studies:write", "contacts:read", "contacts:write", "activity:read",
  ];

  const superAdminRole = await prisma.role.upsert({
    where: { slug: "super-admin" },
    update: {},
    create: {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full system access",
      permissions: allPermissions,
    },
  });

  await prisma.role.upsert({
    where: { slug: "editor" },
    update: {},
    create: {
      name: "Editor",
      slug: "editor",
      description: "Content management access",
      permissions: allPermissions.filter((p) => !p.startsWith("users") && !p.startsWith("roles")),
    },
  });

  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@afyabridge.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@afyabridge.com",
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  });

  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      title: "Home",
      slug: "home",
      description: "Afya Bridge — Bridging Technology & Care",
      isPublished: true,
      isHome: true,
    },
  });

  await prisma.sEO.upsert({
    where: { pageId: homePage.id },
    update: {},
    create: {
      pageId: homePage.id,
      metaTitle: "Afya Bridge — Bridging Technology & Care",
      metaDescription: "Modern healthcare software for clinics and hospitals across East Africa. Improve patient flow, efficiency, and decision-making.",
      ogTitle: "Afya Bridge — Healthcare Technology",
      ogDescription: "Empowering healthcare providers across Kenya and Tanzania.",
      metaKeywords: "healthcare software, hospital management, clinic software, Kenya, Tanzania, Afya Bridge",
    },
  });

  const sectionDefs: { type: SectionType; title: string; subtitle?: string; order: number; buttonText?: string; buttonLink?: string; buttonText2?: string; buttonLink2?: string }[] = [
    { type: "HERO", title: "Empower Clinics & Hospitals to Deliver Better Healthcare", subtitle: "Modern healthcare software that improves patient flow, operational efficiency, and decision-making — with local support.", order: 0, buttonText: "Request a Demo", buttonLink: "#contact", buttonText2: "See It In Action", buttonLink2: "#platform" },
    { type: "TRUST_BAR", title: "Trusted Across East Africa", order: 1 },
    { type: "WHY_AFYA", title: "Technology + Expertise", subtitle: "We provide both the platform and the guidance needed to improve healthcare operations.", order: 2 },
    { type: "WHO_WE_SERVE", title: "Healthcare Solutions for Every Scale", order: 3 },
    { type: "PLATFORM_MODULES", title: "Everything Your Facility Needs", subtitle: "Integrated modules that work together seamlessly.", order: 4 },
    { type: "OUR_APPROACH", title: "From Assessment to Success", subtitle: "A proven implementation process designed for healthcare.", order: 5 },
    { type: "MISSION_VISION", title: "Mission, Vision & Values", order: 6 },
    { type: "TESTIMONIALS", title: "Trusted by Healthcare Leaders", order: 7 },
    { type: "CASE_STUDIES", title: "Real Results, Real Impact", order: 8 },
    { type: "BLOG", title: "Healthcare Technology Insights", order: 9 },
    { type: "CTA", title: "Ready to Improve Care and Efficiency?", subtitle: "Join 200+ healthcare facilities across East Africa using Afya Bridge.", order: 10, buttonText: "Request a Demo", buttonLink: "#contact" },
    { type: "CONTACT", title: "Let's Start a Conversation", subtitle: "Tell us about your facility and we'll show you how Afya Bridge can help.", order: 11 },
  ];

  for (const def of sectionDefs) {
    const existing = await prisma.section.findFirst({
      where: { pageId: homePage.id, type: def.type },
    });
    if (existing) continue;

    const section = await prisma.section.create({
      data: {
        pageId: homePage.id,
        type: def.type,
        title: def.title,
        subtitle: def.subtitle,
        buttonText: def.buttonText,
        buttonLink: def.buttonLink,
        buttonText2: def.buttonText2,
        buttonLink2: def.buttonLink2,
        order: def.order,
        isVisible: true,
      },
    });

    if (def.type === "HERO") {
      await prisma.heroSlide.create({
        data: {
          sectionId: section.id,
          title: def.title,
          subtitle: def.subtitle,
          ctaText: def.buttonText,
          ctaLink: def.buttonLink,
          ctaText2: def.buttonText2,
          ctaLink2: def.buttonLink2,
          badge: "Trusted across East Africa",
          order: 0,
        },
      });
    }

    if (def.type === "TRUST_BAR") {
      await prisma.trustStat.createMany({
        data: [
          { sectionId: section.id, label: "Healthcare Facilities", value: 200, suffix: "+", icon: "Building2", order: 0 },
          { sectionId: section.id, label: "Patients Managed", value: 1000000, suffix: "+", icon: "Users", order: 1 },
          { sectionId: section.id, label: "System Availability", value: 99, suffix: ".9%", icon: "Shield", order: 2 },
          { sectionId: section.id, label: "Countries Served", value: 2, suffix: "", icon: "Globe", order: 3 },
        ],
      });
    }

    if (def.type === "WHY_AFYA") {
      await prisma.whyCard.createMany({
        data: [
          { sectionId: section.id, title: "Improve patient access and flow", description: "Streamline registration, triage, and care pathways.", icon: "Users", order: 0 },
          { sectionId: section.id, title: "Reduce administrative burden", description: "Automate billing, scheduling, and records.", icon: "Clock", order: 1 },
          { sectionId: section.id, title: "Strengthen operational visibility", description: "Real-time dashboards and reports.", icon: "BarChart3", order: 2 },
          { sectionId: section.id, title: "Support sustainable growth", description: "Scale from clinic to multi-facility network.", icon: "TrendingUp", order: 3 },
        ],
      });
    }

    if (def.type === "WHO_WE_SERVE") {
      await prisma.industry.createMany({
        data: [
          { sectionId: section.id, name: "Clinics", slug: "clinics", description: "Purpose-built for outpatient clinics.", benefits: ["Fast registration", "Queue management", "Basic billing"], order: 0 },
          { sectionId: section.id, name: "Hospitals", slug: "hospitals", description: "Comprehensive hospital management.", benefits: ["Ward management", "Lab integration", "Multi-department"], order: 1 },
          { sectionId: section.id, name: "Growing Practices", slug: "growing-practices", description: "Scale without outgrowing your software.", benefits: ["Multi-location", "Growth analytics", "Flexible modules"], order: 2 },
          { sectionId: section.id, name: "Healthcare Networks", slug: "healthcare-networks", description: "Unified platform for networks.", benefits: ["Centralized reporting", "Network standards", "Resource sharing"], order: 3 },
        ],
      });
    }

    if (def.type === "PLATFORM_MODULES") {
      await prisma.serviceModule.createMany({
        data: [
          { sectionId: section.id, name: "Patient Registration & Records", slug: "registration", description: "Complete patient demographics and digital records.", icon: "UserPlus", benefits: ["Digital records", "Insurance integration"], order: 0 },
          { sectionId: section.id, name: "Appointments & Scheduling", slug: "appointments", description: "Smart scheduling with reminders.", icon: "Calendar", benefits: ["SMS reminders", "Online booking"], order: 1 },
          { sectionId: section.id, name: "Billing & Payments", slug: "billing", description: "Automated invoicing and payments.", icon: "CreditCard", benefits: ["M-Pesa integration", "Insurance claims"], order: 2 },
          { sectionId: section.id, name: "Pharmacy Management", slug: "pharmacy", description: "Prescription and inventory management.", icon: "Pill", benefits: ["Stock alerts", "E-prescriptions"], order: 3 },
          { sectionId: section.id, name: "Laboratory & Diagnostics", slug: "laboratory", description: "Lab orders and results management.", icon: "FlaskConical", benefits: ["Result notifications", "HL7 compatible"], order: 4 },
          { sectionId: section.id, name: "Inventory Management", slug: "inventory", description: "Track supplies across departments.", icon: "Package", benefits: ["Reorder alerts", "Expiry tracking"], order: 5 },
          { sectionId: section.id, name: "Dashboards & Reporting", slug: "dashboards", description: "Real-time analytics and KPIs.", icon: "BarChart3", benefits: ["Custom reports", "Export to Excel"], order: 6 },
        ],
      });
    }

    if (def.type === "OUR_APPROACH") {
      await prisma.approachStep.createMany({
        data: [
          { sectionId: section.id, title: "Assessment", description: "We understand your facility and goals.", icon: "Search", order: 0 },
          { sectionId: section.id, title: "Configuration", description: "Tailored setup for your operations.", icon: "Settings", order: 1 },
          { sectionId: section.id, title: "Training", description: "Hands-on training for your team.", icon: "GraduationCap", order: 2 },
          { sectionId: section.id, title: "Go Live", description: "Smooth launch with on-site support.", icon: "Rocket", order: 3 },
          { sectionId: section.id, title: "Ongoing Support", description: "Local support when you need us.", icon: "Headphones", order: 4 },
        ],
      });
    }

    if (def.type === "MISSION_VISION") {
      await prisma.missionValue.createMany({
        data: [
          { sectionId: section.id, type: "mission", title: "Mission", content: "To bridge technology and care by enabling healthcare providers to operate efficiently, care compassionately, and grow sustainably.", order: 0 },
          { sectionId: section.id, type: "vision", title: "Vision", content: "A world where every healthcare provider, regardless of size or location, can deliver exceptional patient care.", order: 1 },
          { sectionId: section.id, type: "commitment", title: "Commitment", content: "Practical innovation that makes a real difference in East African healthcare.", order: 2 },
          { sectionId: section.id, type: "value", title: "Patient-Centric Care", content: "Every feature starts with the patient experience.", order: 3 },
          { sectionId: section.id, type: "value", title: "Practical Innovation", content: "Technology that works in real clinical environments.", order: 4 },
          { sectionId: section.id, type: "value", title: "Operational Excellence", content: "Streamlined workflows that save time.", order: 5 },
          { sectionId: section.id, type: "value", title: "Partnership & Trust", content: "Long-term relationships built on reliability.", order: 6 },
        ],
      });
    }
  }

  // --- Refresh key visual content to latest design copy (idempotent) ---
  const heroSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "HERO" } });
  if (heroSec) {
    const heroCopy = {
      title: "Healthcare Technology for Better Care",
      subtitle:
        "Empowering hospitals, clinics and healthcare networks across East Africa with intelligent patient management, digital records, and operational excellence.",
    };
    await prisma.section.update({
      where: { id: heroSec.id },
      data: {
        ...heroCopy,
        buttonText: "Request a Demo",
        buttonLink: "/contact",
        buttonText2: "Watch Platform Tour",
        buttonLink2: "/contact",
      },
    });
    const slideData = {
      ...heroCopy,
      ctaText: "Request a Demo",
      ctaLink: "/contact",
      ctaText2: "Watch Platform Tour",
      ctaLink2: "/contact",
      badge: "Trusted by 500+ healthcare facilities across East Africa",
    };
    const firstSlide = await prisma.heroSlide.findFirst({
      where: { sectionId: heroSec.id },
      orderBy: { order: "asc" },
    });
    if (firstSlide) {
      await prisma.heroSlide.update({ where: { id: firstSlide.id }, data: slideData });
    } else {
      await prisma.heroSlide.create({ data: { sectionId: heroSec.id, order: 0, ...slideData } });
    }

    const slide2Data = {
      title: "Healthcare Consulting & Digital Transformation",
      subtitle:
        "Beyond software, Afya Bridge helps healthcare organizations optimize operations, implement best practices, train teams, and improve service delivery.",
      ctaText: "Request a Demo",
      ctaLink: "/contact",
      ctaText2: "Watch Platform Tour",
      ctaLink2: "/contact",
      badge: "Trusted by 500+ healthcare facilities across East Africa",
    };
    const secondSlide = await prisma.heroSlide.findFirst({
      where: { sectionId: heroSec.id, order: 1 },
    });
    if (secondSlide) {
      await prisma.heroSlide.update({ where: { id: secondSlide.id }, data: slide2Data });
    } else {
      await prisma.heroSlide.create({
        data: { sectionId: heroSec.id, order: 1, ...slide2Data },
      });
    }
  }

  const trustSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "TRUST_BAR" } });
  if (trustSec) {
    await prisma.trustStat.deleteMany({ where: { sectionId: trustSec.id } });
    await prisma.trustStat.createMany({
      data: [
        { sectionId: trustSec.id, label: "Healthcare Facilities", value: 500, suffix: "+", icon: "Building2", order: 0 },
        { sectionId: trustSec.id, label: "Patients Managed", value: 2, suffix: "M+", icon: "Users", order: 1 },
        { sectionId: trustSec.id, label: "System Availability", value: 99, suffix: ".9%", icon: "Shield", order: 2 },
        { sectionId: trustSec.id, label: "Countries Served", value: 5, suffix: "", icon: "Globe", order: 3 },
        { sectionId: trustSec.id, label: "Years Healthcare Experience", value: 15, suffix: "+", icon: "Award", order: 4 },
      ],
    });
  }

  // Section structured content (editable in admin page editor)
  if (heroSec) {
    await prisma.section.update({
      where: { id: heroSec.id },
      data: {
        content: {
          trustBadges: [
            { label: "Secure & Compliant", icon: "Shield" },
            { label: "Local Support", icon: "Headphones" },
            { label: "Scalable Platform", icon: "Layers" },
            { label: "Proven Expertise", icon: "Award" },
          ],
        },
      },
    });
  }

  const whySec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "WHY_AFYA" } });
  if (whySec) {
    await prisma.section.update({
      where: { id: whySec.id },
      data: {
        title: "Technology + Expertise",
        subtitle: "We provide both the platform and the guidance needed to improve healthcare operations.",
        content: {
          eyebrow: "Two Pillars. One Mission.",
          productTitle: "Our Product",
          productDescription:
            "An all-in-one healthcare management system built to digitize and connect every part of your facility.",
          productFeatures: [
            "Patient Management",
            "Clinical & EMR",
            "Billing & Revenue Cycle",
            "Pharmacy & Inventory",
            "Laboratory & Diagnostics",
            "Analytics & Reporting",
            "Secure Cloud Infrastructure",
            "And more...",
          ],
          productImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          productLink: "#platform",
          productLinkText: "Explore Platform",
          consultingTitle: "Our Consulting",
          consultingDescription:
            "Expert guidance to optimize processes, build capacity and drive sustainable improvement.",
          consultingFeatures: [
            "Process Optimization",
            "Digital Transformation",
            "Training & Capacity Building",
            "Change Management",
          ],
          consultingImage: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=800&q=80",
          consultingLink: "#consulting",
          consultingLinkText: "Explore Consulting",
        },
      },
    });
  }

  const wwsSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "WHO_WE_SERVE" } });
  if (wwsSec) {
    await prisma.section.update({
      where: { id: wwsSec.id },
      data: {
        title: "Solutions for Every Healthcare Provider",
        subtitle: "From single clinics to national health networks — one intelligent platform.",
        content: { eyebrow: "Who We Serve" },
      },
    });
    await prisma.industry.deleteMany({ where: { sectionId: wwsSec.id } });
    await prisma.industry.createMany({
      data: [
        { sectionId: wwsSec.id, name: "Hospitals", slug: "hospitals", description: "Comprehensive hospital management from admission to discharge with full departmental integration.", benefits: { icon: "Building2", items: [] }, order: 0 },
        { sectionId: wwsSec.id, name: "Clinics", slug: "clinics", description: "Purpose-built for outpatient clinics managing high patient volumes with limited staff.", benefits: { icon: "Stethoscope", items: [] }, order: 1 },
        { sectionId: wwsSec.id, name: "Health Centers", slug: "health-centers", description: "Community health centers delivering primary care with efficient digital workflows.", benefits: { icon: "HeartPulse", items: [] }, order: 2 },
        { sectionId: wwsSec.id, name: "Growing Practices", slug: "growing-practices", description: "Scale without outgrowing your software as your practice expands.", benefits: { icon: "TrendingUp", items: [] }, order: 3 },
        { sectionId: wwsSec.id, name: "Healthcare Networks", slug: "healthcare-networks", description: "A unified platform for networks operating across multiple facilities and regions.", benefits: { icon: "Network", items: [] }, order: 4 },
        { sectionId: wwsSec.id, name: "NGOs & Donors", slug: "ngos-donors", description: "Run community health programs with reach, accountability, and donor-ready reporting.", benefits: { icon: "Handshake", items: [] }, order: 5 },
      ],
    });
  }

  const platformSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "PLATFORM_MODULES" } });
  if (platformSec) {
    await prisma.section.update({
      where: { id: platformSec.id },
      data: {
        title: "Everything You Need in One Platform",
        subtitle: "Integrated modules that work together seamlessly.",
        buttonText: "See All Modules",
        buttonLink: "/platform",
        content: { eyebrow: "Powerful Modules" },
      },
    });
    await prisma.serviceModule.deleteMany({ where: { sectionId: platformSec.id } });
    await prisma.serviceModule.createMany({
      data: [
        { sectionId: platformSec.id, name: "Patient Management", slug: "patient-management", description: "Complete patient records & history", icon: "Users", order: 0 },
        { sectionId: platformSec.id, name: "Appointments & Scheduling", slug: "appointments", description: "Smart scheduling with reminders", icon: "Calendar", order: 1 },
        { sectionId: platformSec.id, name: "Clinical & EMR", slug: "clinical-emr", description: "Electronic medical records & clinical notes", icon: "FileText", order: 2 },
        { sectionId: platformSec.id, name: "Billing & Payments", slug: "billing", description: "Automated invoicing and payments", icon: "CreditCard", order: 3 },
        { sectionId: platformSec.id, name: "Pharmacy Management", slug: "pharmacy", description: "Prescription and inventory management", icon: "Pill", order: 4 },
        { sectionId: platformSec.id, name: "Laboratory Management", slug: "laboratory", description: "Lab orders and results management", icon: "FlaskConical", order: 5 },
        { sectionId: platformSec.id, name: "Inventory Management", slug: "inventory", description: "Track supplies across departments", icon: "Package", order: 6 },
        { sectionId: platformSec.id, name: "Analytics & Reporting", slug: "analytics", description: "Real-time analytics and KPIs", icon: "BarChart3", order: 7 },
      ],
    });
  }

  let consultingSec = await prisma.section.findFirst({
    where: { pageId: homePage.id, type: "CUSTOM", content: { path: ["variant"], equals: "CONSULTING" } },
  });
  if (!consultingSec) {
    consultingSec = await prisma.section.create({
      data: {
        pageId: homePage.id,
        type: "CUSTOM",
        title: "We Help You Improve Operations and Deliver Better Care",
        order: 4,
        isVisible: true,
        content: {
          variant: "CONSULTING",
          consultingEyebrow: "Expert Consulting Services",
          consultingTitle: "We Help You Improve Operations and Deliver Better Care",
          consultingServices: [
            { title: "Process Optimization", description: "Analyze current workflows and redesign them for maximum efficiency and patient throughput.", icon: "Settings" },
            { title: "Digital Transformation", description: "Digitize paper-based processes and integrate systems for seamless data flow.", icon: "Monitor" },
            { title: "Training & Capacity Building", description: "Hands-on training programs that ensure your team adopts and masters the platform.", icon: "GraduationCap" },
            { title: "Change Management", description: "Guide your team through organizational change with proven adoption strategies.", icon: "Users" },
          ],
        },
      },
    });
  } else {
    await prisma.section.update({
      where: { id: consultingSec.id },
      data: {
        title: "We Help You Improve Operations and Deliver Better Care",
        content: {
          variant: "CONSULTING",
          consultingEyebrow: "Expert Consulting Services",
          consultingTitle: "We Help You Improve Operations and Deliver Better Care",
          consultingServices: [
            { title: "Process Optimization", description: "Analyze current workflows and redesign them for maximum efficiency and patient throughput.", icon: "Settings" },
            { title: "Digital Transformation", description: "Digitize paper-based processes and integrate systems for seamless data flow.", icon: "Monitor" },
            { title: "Training & Capacity Building", description: "Hands-on training programs that ensure your team adopts and masters the platform.", icon: "GraduationCap" },
            { title: "Change Management", description: "Guide your team through organizational change with proven adoption strategies.", icon: "Users" },
          ],
        },
      },
    });
  }

  const approachSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "OUR_APPROACH" } });
  if (approachSec) {
    await prisma.section.update({
      where: { id: approachSec.id },
      data: {
        title: "Our Implementation Process",
        subtitle: "A structured path from assessment to go-live and beyond.",
        content: { eyebrow: "Proven Implementation" },
      },
    });
    await prisma.approachStep.deleteMany({ where: { sectionId: approachSec.id } });
    await prisma.approachStep.createMany({
      data: [
        { sectionId: approachSec.id, title: "Assessment", description: "We understand your facility and goals.", icon: "Search", order: 0 },
        { sectionId: approachSec.id, title: "Planning", description: "We design the right solution for you.", icon: "ClipboardList", order: 1 },
        { sectionId: approachSec.id, title: "Implementation", description: "We set up and configure your system.", icon: "Settings", order: 2 },
        { sectionId: approachSec.id, title: "Training", description: "We train your team hands-on.", icon: "GraduationCap", order: 3 },
        { sectionId: approachSec.id, title: "Go-Live & Support", description: "We go live and stay with you.", icon: "Headphones", order: 4 },
      ],
    });
  }

  // Homepage section order: who we serve embeds inside WHY (after pillars); then modules → consulting → implementation
  const homeOrder: { type: SectionType; order: number; variant?: string }[] = [
    { type: "HERO", order: 0 },
    { type: "TRUST_BAR", order: 1 },
    { type: "WHY_AFYA", order: 2 },
    { type: "WHO_WE_SERVE", order: 3 },
    { type: "PLATFORM_MODULES", order: 4 },
    { type: "CUSTOM", order: 5, variant: "CONSULTING" },
    { type: "OUR_APPROACH", order: 6 },
    { type: "MISSION_VISION", order: 7 },
    { type: "TESTIMONIALS", order: 8 },
    { type: "CASE_STUDIES", order: 9 },
    { type: "BLOG", order: 10 },
    { type: "CTA", order: 11 },
    { type: "CONTACT", order: 12 },
  ];
  for (const item of homeOrder) {
    const sec = item.variant
      ? await prisma.section.findFirst({
          where: { pageId: homePage.id, type: item.type, content: { path: ["variant"], equals: item.variant } },
        })
      : await prisma.section.findFirst({ where: { pageId: homePage.id, type: item.type } });
    if (sec) {
      await prisma.section.update({ where: { id: sec.id }, data: { order: item.order } });
    }
  }

  const ctaSec = await prisma.section.findFirst({ where: { pageId: homePage.id, type: "CTA" } });
  if (ctaSec) {
    await prisma.section.update({
      where: { id: ctaSec.id },
      data: {
        title: "Ready to Transform Healthcare Operations?",
        subtitle: "Join 500+ healthcare facilities across East Africa delivering better patient care with Afya Bridge.",
        buttonText: "Request Demo",
        buttonLink: "#contact",
      },
    });
  }

  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { name: "Dr. Sarah Kimani", role: "Medical Director", hospital: "Nairobi Central Clinic", review: "Afya Bridge transformed how we manage patient flow. Wait times dropped 40% in the first month.", rating: 5, order: 0 },
      { name: "James Mwangi", role: "Hospital Administrator", hospital: "Coastal Regional Hospital", review: "The local support team understands our challenges. Implementation was smooth and our staff adopted it quickly.", rating: 5, order: 1 },
      { name: "Dr. Amina Hassan", role: "CEO", hospital: "Dar es Salaam Medical Group", review: "Scaling from one clinic to five locations was seamless. The reporting dashboards give us visibility we never had.", rating: 5, order: 2 },
    ],
  });

  await prisma.caseStudy.createMany({
    skipDuplicates: true,
    data: [
      { title: "Nairobi Central Clinic", slug: "nairobi-central", summary: "40% reduction in patient wait times", results: { waitTime: "-40%", satisfaction: "+35%" }, kpis: [{ label: "Patients/day", value: "200+" }, { label: "Staff saved", value: "15hrs/wk" }], order: 0 },
      { title: "Coastal Regional Hospital", slug: "coastal-regional", summary: "Unified 5 departments on one platform", results: { efficiency: "+60%", errors: "-75%" }, kpis: [{ label: "Departments", value: "5" }, { label: "Beds managed", value: "150" }], order: 1 },
    ],
  });

  const category = await prisma.blogCategory.upsert({
    where: { slug: "healthcare-technology" },
    update: {},
    create: { name: "Healthcare Technology", slug: "healthcare-technology" },
  });

  const admin = await prisma.user.findUnique({ where: { email: "admin@afyabridge.com" } });

  await prisma.blogPost.upsert({
    where: { slug: "digital-transformation-east-african-healthcare" },
    update: {},
    create: {
      title: "Digital Transformation in East African Healthcare",
      slug: "digital-transformation-east-african-healthcare",
      excerpt: "How clinics and hospitals across Kenya and Tanzania are embracing technology to improve patient care.",
      content: "<p>The healthcare landscape in East Africa is undergoing a significant transformation. From small clinics in Nairobi to regional hospitals in Dar es Salaam, technology is enabling providers to deliver better care more efficiently.</p><p>Key trends include cloud-based patient records, mobile payment integration, and real-time operational dashboards that give administrators visibility they've never had before.</p>",
      categoryId: category.id,
      authorId: admin?.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // --- Marketing pages (CMS-driven multi-page site) ---
  const marketingPages: { slug: string; title: string; description: string; sections: { type: SectionType; title?: string; subtitle?: string; variant?: string; buttonText?: string; buttonLink?: string }[] }[] = [
    { slug: "about", title: "About Afya Bridge", description: "Empowering Better Healthcare Through Practical Technology", sections: [
      { type: "CUSTOM", title: "About Afya Bridge", subtitle: "Our Story", variant: "PAGE_HEADER" },
      { type: "MISSION_VISION", title: "Mission, Vision & Values" },
      { type: "WHY_AFYA", title: "What Makes Us Different", subtitle: "Built for real healthcare environments." },
      { type: "CTA", title: "Partner With Afya Bridge", subtitle: "Build a future where technology elevates patient care.", buttonText: "Request a Demo", buttonLink: "/contact" },
    ]},
    { slug: "platform", title: "Platform & Modules", description: "One Connected Platform for Healthcare Operations", sections: [
      { type: "CUSTOM", title: "One Connected Platform for Healthcare Operations", subtitle: "The Platform", variant: "PAGE_HEADER" },
      { type: "PLATFORM_MODULES", title: "Everything You Need — One Platform", subtitle: "Modular, scalable, and built for East African healthcare." },
      { type: "CTA", title: "See the Platform in Action", buttonText: "Request a Demo", buttonLink: "/contact" },
    ]},
    { slug: "solutions", title: "Solutions", description: "One Connected Healthcare Platform", sections: [
      { type: "CUSTOM", title: "One Connected Healthcare Platform", subtitle: "Our Solutions", variant: "PAGE_HEADER" },
      { type: "WHO_WE_SERVE", title: "Solutions Designed for Every Care Environment" },
      { type: "PLATFORM_MODULES", title: "Platform Capabilities" },
      { type: "CTA", title: "Find the Right Solution", buttonText: "Request a Demo", buttonLink: "/contact" },
    ]},
    { slug: "clinics", title: "Healthcare Software for Clinics", description: "Serve More Patients. Reduce Admin Work.", sections: [
      { type: "CUSTOM", title: "Serve More Patients. Reduce Admin Work.", subtitle: "For Clinics", variant: "PAGE_HEADER" },
      { type: "WHY_AFYA", title: "Built for Clinics" },
      { type: "CTA", title: "Get Started for Clinics", buttonText: "Request a Clinic Demo", buttonLink: "/contact" },
    ]},
    { slug: "hospitals", title: "Healthcare Software for Hospitals", description: "Improve Patient Flow. Lead with Data.", sections: [
      { type: "CUSTOM", title: "Improve Patient Flow. Strengthen Operations.", subtitle: "For Hospitals", variant: "PAGE_HEADER" },
      { type: "WHY_AFYA", title: "Built for Hospitals" },
      { type: "CTA", title: "Get Started for Hospitals", buttonText: "Request a Hospital Demo", buttonLink: "/contact" },
    ]},
    { slug: "implementation", title: "Implementation & Support", description: "Simple, Structured, and Supportive", sections: [
      { type: "CUSTOM", title: "Simple, Structured, and Supportive", subtitle: "Implementation", variant: "PAGE_HEADER" },
      { type: "OUR_APPROACH", title: "From Assessment to Go-Live" },
      { type: "CTA", title: "Plan Your Implementation", buttonText: "Contact Our Team", buttonLink: "/contact" },
    ]},
    { slug: "why-afya-bridge", title: "Why Afya Bridge", description: "More Than Software — A Healthcare Partner", sections: [
      { type: "CUSTOM", title: "More Than Software — A Healthcare Partner", subtitle: "Why Afya Bridge", variant: "PAGE_HEADER" },
      { type: "WHY_AFYA", title: "The Afya Bridge Difference" },
      { type: "CTA", title: "Experience the Difference", buttonText: "Request a Demo", buttonLink: "/contact" },
    ]},
    { slug: "resources", title: "Resources & Insights", description: "Healthcare Technology Insights for East Africa", sections: [
      { type: "CUSTOM", title: "Healthcare Technology Insights", subtitle: "Resources", variant: "PAGE_HEADER" },
      { type: "BLOG", title: "Latest Insights" },
      { type: "CTA", title: "Stay Informed", buttonText: "Subscribe", buttonLink: "/contact" },
    ]},
    { slug: "faq", title: "Frequently Asked Questions", description: "Everything You Need to Know", sections: [
      { type: "CUSTOM", title: "Everything You Need to Know", subtitle: "FAQ", variant: "FAQ" },
    ]},
    { slug: "contact", title: "Contact Us", description: "Let's Start a Conversation", sections: [
      { type: "CONTACT", title: "Let's Start a Conversation", subtitle: "We would love to learn more about your facility." },
    ]},
  ];

  for (const mp of marketingPages) {
    const page = await prisma.page.upsert({
      where: { slug: mp.slug },
      update: { title: mp.title, description: mp.description },
      create: { title: mp.title, slug: mp.slug, description: mp.description, isPublished: true },
    });
    await prisma.sEO.upsert({
      where: { pageId: page.id },
      update: { metaTitle: `${mp.title} | Afya Bridge`, metaDescription: mp.description },
      create: { pageId: page.id, metaTitle: `${mp.title} | Afya Bridge`, metaDescription: mp.description },
    });
    for (let i = 0; i < mp.sections.length; i++) {
      const s = mp.sections[i];
      const existing = await prisma.section.findFirst({ where: { pageId: page.id, type: s.type, order: i } });
      if (existing) continue;
      await prisma.section.create({
        data: {
          pageId: page.id,
          type: s.type,
          title: s.title,
          subtitle: s.subtitle,
          content: s.variant ? { variant: s.variant } : undefined,
          buttonText: s.buttonText,
          buttonLink: s.buttonLink,
          order: i,
          isVisible: true,
        },
      });
    }
  }

  // --- FAQ content ---
  const faqData = [
    { question: "How long does implementation take?", answer: "Implementation timelines depend on facility size and selected modules. Clinics can typically go live within weeks, while hospitals follow a phased rollout." },
    { question: "Is Afya Bridge suitable for small clinics?", answer: "Yes. Afya Bridge is modular and affordable, making it ideal for clinics that want to digitize operations without unnecessary complexity." },
    { question: "Can Afya Bridge scale for hospitals?", answer: "Absolutely. The platform supports multi-department hospitals with integrated workflows, reporting, and leadership dashboards." },
    { question: "What training is provided?", answer: "We provide structured training for clinical, administrative, and management teams to ensure confident system use from day one." },
    { question: "How is patient data secured?", answer: "Afya Bridge uses healthcare-grade security, including role-based access, secure storage and backups, and audit-ready architecture." },
    { question: "Do you provide ongoing support?", answer: "Yes. Our partnership continues after go-live with ongoing support, optimization, and system updates." },
    { question: "How do we get started?", answer: "Simply request a demo. Our team will assess your needs and guide you through the next steps." },
  ];
  for (let i = 0; i < faqData.length; i++) {
    const f = faqData[i];
    const exists = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!exists) await prisma.fAQ.create({ data: { ...f, order: i } });
  }

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
  await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Consulting", url: "/implementation", order: 2 } });
  await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Implementation", url: "/implementation", order: 3 } });
  const resources = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Resources", url: "/resources", order: 4 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: resources.id, label: "Blog", url: "/blog", order: 0 },
      { menuId: headerMenu.id, parentId: resources.id, label: "Case Studies", url: "/resources", order: 1 },
      { menuId: headerMenu.id, parentId: resources.id, label: "FAQ", url: "/faq", order: 2 },
    ],
  });
  const company = await prisma.menuItem.create({ data: { menuId: headerMenu.id, label: "Company", url: "/about", order: 5 } });
  await prisma.menuItem.createMany({
    data: [
      { menuId: headerMenu.id, parentId: company.id, label: "About Us", url: "/about", order: 0 },
      { menuId: headerMenu.id, parentId: company.id, label: "Resources", url: "/resources", order: 1 },
      { menuId: headerMenu.id, parentId: company.id, label: "FAQ", url: "/faq", order: 2 },
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
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Resources", url: "/resources", order: 0 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Blog", url: "/blog", order: 1 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "FAQ", url: "/faq", order: 2 },
      { menuId: footerMenu.id, parentId: footerResources.id, label: "Request a Demo", url: "/contact", order: 3 },
    ],
  });

  const settings = [
    { key: "site_name", value: "Afya Bridge", group: "branding" },
    { key: "site_tagline", value: "The healthcare-software partner for East African clinics and hospitals, delivering local expertise and patient-centric design so providers can focus on care, not IT.", group: "branding" },
    { key: "site_logo", value: "", group: "branding" },
    { key: "site_logo_dark", value: "", group: "branding" },
    { key: "site_favicon", value: "", group: "branding" },
    { key: "color_primary", value: "#0A2A8B", group: "theme" },
    { key: "color_secondary", value: "#2563EB", group: "theme" },
    { key: "color_accent", value: "#00C2FF", group: "theme" },
    { key: "color_hero_bg", value: "#041B52", group: "theme" },
    { key: "contact_email", value: "hello@afyabridge.com", group: "contact" },
    { key: "phone_ke", value: "+254 700 000 000", group: "contact" },
    { key: "phone_tz", value: "+255 700 000 000", group: "contact" },
    { key: "address", value: "Nairobi, Kenya · Dar es Salaam, Tanzania", group: "contact" },
    { key: "region", value: "Kenya · Tanzania · East Africa", group: "contact" },
    { key: "watch_demo_text", value: "Watch Demo", group: "header" },
    { key: "watch_demo_link", value: "/contact", group: "header" },
    { key: "request_demo_text", value: "Request Demo", group: "header" },
    { key: "request_demo_link", value: "/contact", group: "header" },
    { key: "copyright_text", value: "", group: "footer" },
    { key: "footer_newsletter_title", value: "Stay ahead in healthcare technology", group: "footer" },
    { key: "footer_newsletter_subtitle", value: "Insights on digital transformation in East African healthcare.", group: "footer" },
    {
      key: "footer_trust_badges",
      value: JSON.stringify([
        { icon: "ShieldCheck", label: "Healthcare-grade data protection" },
        { icon: "Lock", label: "Role-based access & encryption" },
        { icon: "Award", label: "Audit-ready architecture" },
      ]),
      group: "footer",
    },
    { key: "contact_response_title", value: "< 24h response", group: "contact" },
    { key: "contact_response_subtitle", value: "Guaranteed reply time", group: "contact" },
    { key: "contact_security_title", value: "Data secure", group: "contact" },
    { key: "contact_security_subtitle", value: "Healthcare-grade privacy", group: "contact" },
    { key: "privacy_link", value: "/privacy", group: "footer" },
    { key: "terms_link", value: "/terms", group: "footer" },
    { key: "social_linkedin", value: "https://linkedin.com/company/afyabridge", group: "social" },
    { key: "social_twitter", value: "https://twitter.com/afyabridge", group: "social" },
    { key: "social_facebook", value: "https://facebook.com/afyabridge", group: "social" },
    { key: "social_youtube", value: "https://youtube.com/@afyabridge", group: "social" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("   Admin login: admin@afyabridge.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
