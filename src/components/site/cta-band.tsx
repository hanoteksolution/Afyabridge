import Link from "next/link";
import { ArrowRight, Calendar, Activity, Shield, Pill, BarChart3, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

const FLOAT = [Activity, CreditCard, Shield, Calendar, BarChart3, Pill];

export function CtaBand({
  title = "Ready to Improve Care and Efficiency?",
  subtitle = "See how Afya Bridge can transform your clinic or hospital operations.",
  primary = { label: "Request a Demo", href: "/contact" },
  secondary = { label: "Contact Our Team", href: "/contact" },
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-[#0A2A8B] via-[#2D7FF9] to-[#0A2A8B]" />
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      {FLOAT.map((Icon, i) => (
        <span
          key={i}
          className="animate-float-slow absolute text-white/10"
          style={{ top: `${(i * 29 + 8) % 78 + 6}%`, left: `${(i * 41 + 6) % 88 + 4}%`, animationDelay: `${(i % 5) * 0.6}s` }}
        >
          <Icon className="h-12 w-12" />
        </span>
      ))}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.7rem]">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">{subtitle}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-[#0A2A8B] shadow-xl hover:bg-blue-50">
              <Link href={primary.href}>{primary.label}<ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" asChild className="border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
