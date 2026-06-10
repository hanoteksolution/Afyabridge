"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Enterprise security",
    description: "Role-based access, encrypted sessions, and audit trails.",
    tone: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
  },
  {
    icon: LayoutDashboard,
    title: "Unified control",
    description: "Pages, media, leads, and SEO — one polished workspace.",
    tone: "from-sky-500/20 to-sky-500/5 text-sky-300",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description: "Premium CMS tooling designed for healthcare teams.",
    tone: "from-violet-500/20 to-violet-500/5 text-violet-300",
  },
];

const trustItems = ["256-bit sessions", "RBAC permissions", "Activity logging"];

function resolveCallbackUrl(callbackUrl: string | null) {
  if (!callbackUrl) return "/admin/dashboard";
  try {
    const path = callbackUrl.startsWith("http")
      ? new URL(callbackUrl).pathname
      : callbackUrl;
    if (path.startsWith("/admin") && path !== "/admin/login") {
      return path === "/admin" ? "/admin/dashboard" : path;
    }
  } catch {
    /* ignore malformed callback URLs */
  }
  return "/admin/dashboard";
}

function BrandMark({
  siteName,
  siteLogo,
  siteTagline,
  compact = false,
}: {
  siteName: string;
  siteLogo?: string;
  siteTagline: string;
  compact?: boolean;
}) {
  if (siteLogo) {
    return (
      <Image
        src={siteLogo}
        alt={siteName}
        width={compact ? 120 : 160}
        height={compact ? 36 : 48}
        className={cn("object-contain object-left", compact ? "h-9 w-auto" : "h-11 w-auto")}
        priority
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D7FF9] to-[#00C2FF] shadow-lg shadow-sky-500/30">
        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
        <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </div>
      <div className="leading-tight">
        <span className={cn("block font-bold text-white", compact ? "text-base" : "text-lg")}>
          {siteName}
        </span>
        {!compact && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/90">
            {siteTagline}
          </span>
        )}
      </div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.status === 401
            ? "Invalid email or password. Please try again."
            : "Unable to sign in right now. Ensure the database is running, then try again."
        );
        return;
      }

      if (!result?.ok) {
        setError("Sign in failed. Please try again.");
        return;
      }

      window.location.assign(
        resolveCallbackUrl(searchParams.get("callbackUrl"))
      );
    } catch {
      setError(
        "Connection error. Start the database with npm run db:dev, then retry."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[460px]"
    >
      <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-b from-white/30 via-white/10 to-sky-400/20 opacity-80" />
      <div className="absolute -inset-8 rounded-[40px] bg-sky-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[31px] border border-white/15 bg-white/[0.06] p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#00C2FF]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#2563EB]/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mb-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            Secure admin access
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Sign in to manage content, leads, and your digital experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-white/50">
              Work email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@afyabridge.com"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.06] pl-11 text-white placeholder:text-white/30 shadow-inner shadow-black/10 focus-visible:border-sky-400/40 focus-visible:ring-sky-400/20"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-white/50">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.06] pl-11 pr-12 text-white placeholder:text-white/30 shadow-inner shadow-black/10 focus-visible:border-sky-400/40 focus-visible:ring-sky-400/20"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            size="lg"
            className={cn(
              "group relative h-12 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0A1F78] via-[#1d4ed8] to-[#2563EB] text-base font-medium text-white shadow-[0_16px_40px_-12px_rgba(37,99,235,0.65)] transition-all hover:shadow-[0_20px_48px_-12px_rgba(37,99,235,0.75)]",
              loading && "pointer-events-none opacity-90"
            )}
            disabled={loading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in to dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-6">
          {trustItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/45"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="relative mt-5 text-center text-[11px] text-white/35">
          Dev:{" "}
          <span className="text-white/50">admin@afyabridge.com</span> /{" "}
          <span className="text-white/50">admin123</span>
        </p>
      </div>
    </motion.div>
  );
}

export function LoginView({
  siteName,
  siteTagline,
  siteLogo,
}: {
  siteName: string;
  siteTagline: string;
  siteLogo?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_10%_-10%,rgba(37,99,235,0.35),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_90%_110%,rgba(0,194,255,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.95))]" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[18%] h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[12%] right-[6%] h-96 w-96 rounded-full bg-cyan-400/15 blur-[110px]"
        animate={{ x: [0, -36, 0], y: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <div className="relative flex flex-1 flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12 xl:max-w-[54%]">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <BrandMark
                siteName={siteName}
                siteTagline={siteTagline}
                siteLogo={siteLogo}
              />
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              System online
            </div>
          </div>

          <div className="my-10 lg:my-0 lg:py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-sky-300" />
              Afya Bridge Admin
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-[3.35rem]"
            >
              Command your
              <span className="block bg-gradient-to-r from-[#7dd3fc] via-[#38bdf8] to-[#00C2FF] bg-clip-text text-transparent">
                healthcare platform
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg"
            >
              A premium control center for content, leads, SEO, and digital
              experiences — designed for teams that bridge technology and care.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="mt-8 hidden gap-3 sm:flex"
            >
              {["Pages", "Leads", "Media", "SEO"].map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="hidden space-y-3 lg:block">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 + index * 0.08, duration: 0.5 }}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                    feature.tone
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-white">{feature.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center border-t border-white/10 px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_65%)]" />
          <Suspense
            fallback={
              <div className="flex h-[480px] w-full max-w-[460px] items-center justify-center rounded-[31px] border border-white/10 bg-white/5 backdrop-blur-xl">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
