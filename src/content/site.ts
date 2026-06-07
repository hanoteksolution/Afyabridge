// Single source of truth for Afya Bridge marketing copy.
// All content is drawn directly from the Afya Bridge branding, mission/vision/
// values, website content, and website improvement documents.

import { HEALTHCARE_IMAGES } from "@/lib/images";

export const SITE = {
  name: "Afya Bridge",
  tagline: "Bridging Technology and Care",
  promise:
    "Technology that enables better patient care and hospital performance — regardless of your size or location.",
  positioning:
    "The healthcare-software partner for East African clinics and hospitals, delivering local expertise and patient-centric design so providers can focus on care, not IT.",
  guidingPrinciple:
    "If it doesn't improve patient care, efficiency, or trust — it's not Afya Bridge.",
  region: "Kenya · Tanzania · East Africa",
  email: "hello@afyabridge.com",
  phoneKE: "+254 700 000 000",
  phoneTZ: "+255 700 000 000",
  address: "Nairobi, Kenya · Dar es Salaam, Tanzania",
} as const;

// ---------- Navigation (multi-page) ----------
export const NAV: {
  label: string;
  href: string;
  children?: { label: string; href: string; desc: string }[];
}[] = [
  { label: "Platform", href: "/platform" },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "For Clinics", href: "/clinics", desc: "Fast onboarding, essential modules, affordable" },
      { label: "For Hospitals", href: "/hospitals", desc: "Integrated departments, leadership dashboards" },
    ],
  },
  { label: "Implementation", href: "/implementation" },
  { label: "Why Afya Bridge", href: "/why-afya-bridge" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/blog", desc: "Healthcare technology insights" },
      { label: "Case Studies", href: "/resources", desc: "Real results from real facilities" },
      { label: "FAQ", href: "/faq", desc: "Answers to common questions" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", desc: "Our mission, vision and values" },
      { label: "Why Afya Bridge", href: "/why-afya-bridge", desc: "What sets us apart" },
      { label: "Contact", href: "/contact", desc: "Get in touch with our team" },
    ],
  },
];

export const FOOTER_NAV = {
  Platform: [
    { label: "Platform Overview", href: "/platform" },
    { label: "Modules", href: "/platform" },
    { label: "Integrations", href: "/platform" },
    { label: "Security", href: "/platform" },
  ],
  Solutions: [
    { label: "For Clinics", href: "/clinics" },
    { label: "For Hospitals", href: "/hospitals" },
    { label: "For Labs", href: "/solutions" },
    { label: "For Pharmacies", href: "/solutions" },
  ],
  Consulting: [
    { label: "Process Optimization", href: "/implementation" },
    { label: "Digital Transformation", href: "/implementation" },
    { label: "Training", href: "/implementation" },
    { label: "Support", href: "/contact" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Case Studies", href: "/resources" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Why Afya Bridge", href: "/why-afya-bridge" },
    { label: "Careers", href: "/about" },
    { label: "Partners", href: "/contact" },
  ],
};

// ---------- Mission / Vision / Values ----------
export const MISSION = {
  mission:
    "To bridge technology and care by enabling healthcare providers to operate efficiently, care compassionately, and grow sustainably.",
  vision:
    "A world where every healthcare provider, regardless of size or location, can deliver exceptional patient care.",
  commitment:
    "We commit to being a trusted partner to healthcare providers by delivering practical, reliable technology, continuous support, and long-term value.",
};

export const VALUES = [
  {
    title: "Patient-Centric Care",
    icon: "Heart",
    body: "Patients always come first. Every decision we make is guided by how it improves patient outcomes, access, and experience.",
    quote:
      "At Afya Bridge, we never lose sight of why we exist. Every feature, workflow, and decision must ultimately help providers deliver better care to patients.",
  },
  {
    title: "Practical Innovation",
    icon: "Lightbulb",
    body: "We innovate with purpose — building technology that solves real healthcare problems and works in real clinical environments.",
    quote:
      "We don't innovate for the sake of innovation. We build technology that works — in busy clinics, hospitals, and real operational conditions.",
  },
  {
    title: "Operational Excellence",
    icon: "Gauge",
    body: "We simplify workflows, reduce errors, and improve visibility so healthcare teams can focus more on care and less on administration.",
    quote:
      "Efficiency is not about cutting corners. It's about removing friction so healthcare professionals can focus on what matters most.",
  },
  {
    title: "Partnership & Trust",
    icon: "Handshake",
    body: "We work closely with healthcare providers as long-term partners, listening first and building solutions together.",
    quote:
      "We see ourselves as long-term partners. Trust is earned through reliability, transparency, and consistent support.",
  },
] as const;

// ---------- Home: Hero ----------
export const HERO = {
  badge: "Built for East African clinics & hospitals",
  title: "Empower Clinics & Hospitals to Deliver Better Healthcare",
  subtitle:
    "Modern healthcare software that improves patient flow, operational efficiency, and decision-making — with practical implementation and long-term support.",
  supporting: "Trusted healthcare technology built for real clinical environments.",
  primaryCta: { label: "Request a Demo", href: "/contact" },
  secondaryCta: { label: "See How It Works", href: "/platform" },
};

// ---------- Home: Problem statement ----------
export const PROBLEMS = {
  heading: "Healthcare Delivery Is Harder Than It Should Be",
  intro: "Clinics and hospitals face daily challenges:",
  items: [
    "Long patient wait times",
    "Manual, paper-based workflows",
    "Billing inaccuracies and revenue leakage",
    "Limited visibility into operations",
    "Overworked clinical and administrative staff",
  ],
  closing: "Technology should simplify care — not add complexity.",
};

// ---------- Why Afya Bridge ----------
export const WHY = {
  heading: "More Than Software — A Healthcare Partner",
  intro:
    "Healthcare providers face increasing pressure to deliver quality care while managing complex operations. Afya Bridge bridges technology and care with practical, reliable software that supports both clinical and administrative teams.",
  helps: [
    { title: "Improve patient access and flow", icon: "Users", image: HEALTHCARE_IMAGES.consultation, desc: "Reduce wait times and move patients smoothly from registration to discharge." },
    { title: "Reduce administrative burden", icon: "ClipboardList", image: HEALTHCARE_IMAGES.nurse, desc: "Automate paperwork and billing so teams focus on care, not admin." },
    { title: "Strengthen operational visibility", icon: "BarChart3", image: HEALTHCARE_IMAGES.dataAnalytics, desc: "Real-time dashboards give leadership the insight to decide with confidence." },
    { title: "Support sustainable growth", icon: "TrendingUp", image: HEALTHCARE_IMAGES.medicalTeam, desc: "Modular tools that scale from a single clinic to a multi-facility network." },
  ],
  differentiators: [
    "Built for real healthcare environments",
    "Modular and scalable from clinic to hospital",
    "Secure, compliant, and audit-ready",
    "Practical onboarding and staff training included",
    "Ongoing support and continuous improvement",
    "Local East Africa presence and expertise",
  ],
};

// ---------- Who We Serve ----------
export const AUDIENCES = [
  {
    key: "clinics",
    name: "For Clinics",
    href: "/clinics",
    image: HEALTHCARE_IMAGES.consultation,
    blurb: "Simple, modular tools that help clinics digitize operations, reduce paperwork, and serve more patients efficiently.",
    points: [
      "Fast onboarding with minimal disruption",
      "Essential modules to digitize daily operations",
      "Affordable, scalable pricing",
      "Serve more patients with less admin burden",
    ],
    idealFor: "Private clinics, specialty practices, outpatient centers",
  },
  {
    key: "hospitals",
    name: "For Hospitals",
    href: "/hospitals",
    image: HEALTHCARE_IMAGES.hospitalCorridor,
    blurb: "Integrated systems that connect departments, improve coordination, and support leadership decision-making.",
    points: [
      "Integrated workflows across departments",
      "Improved patient flow from admission to discharge",
      "Centralized dashboards for leadership visibility",
      "Phased implementation with structured training",
    ],
    idealFor: "Small to mid-size hospitals, healthcare networks",
  },
] as const;

// ---------- Platform Modules ----------
export const MODULES = [
  { name: "Patient Registration & Records", icon: "UserPlus", desc: "Digitize patient information and access complete medical records instantly.", points: ["Digitize patient information", "Instant access to records", "Reduce paperwork and duplication"] },
  { name: "Electronic Medical Records (EMR)", icon: "FileText", desc: "Centralized patient records with secure access, history tracking, and clinical documentation.", points: ["Centralized clinical records", "Secure history tracking", "Structured clinical documentation"] },
  { name: "Appointments & Scheduling", icon: "Calendar", desc: "Manage appointments efficiently, reduce congestion and improve patient flow.", points: ["Doctor availability", "Queue management", "Reduced waiting times"] },
  { name: "Billing & Payments", icon: "CreditCard", desc: "Accurate billing and invoicing, reduced revenue leakage, improved financial visibility.", points: ["Automated invoicing", "Payment tracking", "Insurance & claims management"] },
  { name: "Pharmacy Management", icon: "Pill", desc: "Prescription tracking, inventory management, and dispensing accuracy.", points: ["Prescription tracking", "Stock management", "Dispensing accuracy"] },
  { name: "Laboratory & Diagnostics", icon: "FlaskConical", desc: "Integrated lab workflows, result tracking and reporting with fewer errors.", points: ["Test orders", "Results management", "Integration with records"] },
  { name: "Inventory & Supplies", icon: "Package", desc: "Track medical supplies, prevent stock-outs, and improve procurement planning.", points: ["Track supplies & equipment", "Prevent stock-outs", "Procurement planning"] },
  { name: "Dashboards & Reporting", icon: "BarChart3", desc: "Real-time operational, financial, and clinical insights for better decisions.", points: ["Real-time insights", "Performance tracking", "Data-driven decisions"] },
  { name: "Integrations & Administration", icon: "Workflow", desc: "Role-based access, audit logs, APIs and exports for external systems.", points: ["Role-based access", "Audit logs & compliance", "APIs & data export"] },
] as const;

// ---------- Implementation ----------
export const IMPLEMENTATION = {
  heading: "Simple, Structured, and Supportive",
  intro:
    "We work closely with healthcare teams to ensure technology fits real clinical environments. We don't just deploy software — we build long-term partnerships.",
  steps: [
    { title: "Assessment", icon: "Search", desc: "Understand your workflows, needs, and goals before anything is configured." },
    { title: "Setup & Configuration", icon: "Settings", desc: "Tailor the system, modules, and roles to your facility's operations." },
    { title: "Training", icon: "GraduationCap", desc: "Empower clinical, administrative and management teams to use the system confidently." },
    { title: "Go-Live", icon: "Rocket", desc: "Phased rollout with on-site or remote support to minimize disruption." },
    { title: "Ongoing Support", icon: "Headphones", desc: "Optimization, updates, and assistance — we stay engaged long after go-live." },
  ],
};

// ---------- Trust & security ----------
export const TRUST = {
  heading: "Healthcare-Grade Security & Compliance",
  items: [
    { title: "Role-based access controls", icon: "Shield" },
    { title: "Secure data storage and backups", icon: "Lock" },
    { title: "Audit-ready system architecture", icon: "FileCheck" },
    { title: "Meets healthcare data protection standards", icon: "ShieldCheck" },
  ],
};

export const STATS = [
  { value: 5, suffix: "+", label: "Core platform modules", icon: "LayoutGrid" },
  { value: 2, suffix: "", label: "Countries — Kenya & Tanzania", icon: "Globe" },
  { value: 100, suffix: "%", label: "Implementation includes training", icon: "GraduationCap" },
  { value: 24, suffix: "/7", label: "Ongoing partner support", icon: "Headphones" },
];

// ---------- FAQ ----------
export const FAQS = [
  { q: "How long does implementation take?", a: "Implementation timelines depend on facility size and selected modules. Clinics can typically go live within weeks, while hospitals follow a phased rollout to ensure smooth adoption." },
  { q: "Is Afya Bridge suitable for small clinics?", a: "Yes. Afya Bridge is modular and affordable, making it ideal for clinics that want to digitize operations without unnecessary complexity." },
  { q: "Can Afya Bridge scale for hospitals?", a: "Absolutely. The platform is designed to support multi-department hospitals with integrated workflows, reporting, and leadership dashboards." },
  { q: "What training is provided?", a: "We provide structured training for clinical, administrative, and management teams to ensure confident system use from day one." },
  { q: "How is patient data secured?", a: "Afya Bridge uses healthcare-grade security, including role-based access, secure storage and backups, and audit-ready architecture." },
  { q: "Do you provide ongoing support?", a: "Yes. Our partnership continues after go-live with ongoing support, optimization, and system updates." },
  { q: "How do we get started?", a: "Simply request a demo. Our team will assess your needs and guide you through the next steps." },
];

// ---------- Messaging pillars (Why page) ----------
export const PILLARS = [
  { title: "Better Patient Care", message: "Your bridge to better healthcare.", icon: "Heart", desc: "Every feature is built to help providers deliver timely, coordinated, high-quality care." },
  { title: "Operational Efficiency", message: "Fewer errors, faster throughput, better resource use.", icon: "Gauge", desc: "From front desk to discharge, our system connects all your departments seamlessly." },
  { title: "Financial & Sustainability", message: "Grow your hospital sustainably with data-driven decisions.", icon: "TrendingUp", desc: "Lower cost of ownership, faster implementation, and a better return." },
  { title: "Local Partnership", message: "We're your East Africa partner — we speak your language and know your regulations.", icon: "MapPin", desc: "Installed in Kenya and Tanzania, we understand your unique environment." },
];

// ---------- Resources ----------
export const RESOURCES = [
  { title: "Top 5 Ways Digital Tools Improve Clinic Operations", category: "Operations", read: "5 min read", image: HEALTHCARE_IMAGES.reception, excerpt: "Practical ways clinics across East Africa are reducing paperwork and serving more patients with digital workflows." },
  { title: "How Hospitals Can Improve Patient Flow with HMIS", category: "Hospitals", read: "6 min read", image: HEALTHCARE_IMAGES.hospitalCorridor, excerpt: "From admission to discharge — coordinating departments to reduce wait times and bottlenecks." },
  { title: "Digital Transformation in East African Healthcare", category: "Insights", read: "7 min read", image: HEALTHCARE_IMAGES.dataAnalytics, excerpt: "Why local context, training and support matter as much as the software itself." },
  { title: "Data-Driven Decisions in Clinics & Hospitals", category: "Analytics", read: "4 min read", image: HEALTHCARE_IMAGES.surgeon, excerpt: "Using real-time dashboards to reduce stock-outs, wastage, and revenue leakage." },
];
