"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import {
  Building2, Hospital, BookOpen, FileText, HelpCircle, Users, Info, Mail, Layers,
} from "lucide-react";

type DropdownChild = { label: string; href: string; desc: string };

const CHILD_ICONS: Record<string, LucideIcon> = {
  "For Clinics": Building2,
  "For Hospitals": Hospital,
  Blog: BookOpen,
  "Case Studies": FileText,
  FAQ: HelpCircle,
  "About Us": Info,
  Resources: Layers,
  Contact: Mail,
  "Why Afya Bridge": Users,
};

const CHILD_DESC: Record<string, string> = {
  "For Clinics": "Fast onboarding, essential modules, affordable",
  "For Hospitals": "Integrated departments, leadership dashboards",
  Blog: "Healthcare technology insights",
  "Case Studies": "Real results from real facilities",
  FAQ: "Answers to common questions",
  "About Us": "Our mission, vision and values",
  Contact: "Get in touch with our team",
};

export function NavDropdownMobile({
  children,
  parentHref,
}: {
  children: DropdownChild[];
  parentHref: string;
}) {
  return (
    <ul className="m-0 list-none space-y-1 p-0 pl-2">
      {children.map((child) => {
        const Icon = CHILD_ICONS[child.label] ?? ArrowRight;
        return (
          <li key={child.href + child.label}>
            <Link
              href={child.href}
              className="flex items-start gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#041B52] to-[#2563EB]">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#001A41]">{child.label}</div>
                <div className="text-xs text-slate-500">
                  {child.desc || CHILD_DESC[child.label]}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
      <li>
        <Link
          href={parentHref}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2563EB]"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </li>
    </ul>
  );
}
