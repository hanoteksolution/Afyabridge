"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity, Users, Calendar, CreditCard, BedDouble, TrendingUp, Star,
  LayoutDashboard, UserPlus, FlaskConical, BarChart3, Settings,
} from "lucide-react";
import { HEALTHCARE_IMAGES } from "@/lib/images";

const SIDEBAR = [LayoutDashboard, UserPlus, Calendar, FlaskConical, BarChart3, Settings];

const KPIS = [
  { label: "Total Patients", value: "2,543", change: "+12%", icon: Users, tone: "from-blue-500 to-indigo-500" },
  { label: "Appointments", value: "128", change: "+8%", icon: Calendar, tone: "from-cyan-500 to-sky-500" },
  { label: "Revenue", value: "$48.2K", change: "+15%", icon: CreditCard, tone: "from-emerald-500 to-teal-500" },
  { label: "Active Beds", value: "86", change: "92%", icon: BedDouble, tone: "from-violet-500 to-purple-500" },
];

export function HeroDashboard() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-tr from-[#2D7FF9]/30 via-[#00C2FF]/20 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative flex h-full overflow-hidden rounded-[32px] border border-white/25 bg-white/12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
      >
        {/* Sidebar */}
        <div className="hidden w-12 shrink-0 flex-col items-center gap-3 border-r border-white/10 bg-white/5 py-4 sm:flex">
          {SIDEBAR.map((Icon, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                i === 0 ? "bg-[#2563EB]/40 text-white" : "text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6]">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Nairobi Central Hospital</p>
                <p className="text-[10px] text-blue-200/70">Afya Bridge Dashboard</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <div className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${k.tone}`}>
                  <k.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-sm font-bold text-white">{k.value}</p>
                <p className="text-[9px] text-blue-200/60">{k.label}</p>
                <p className="text-[9px] font-semibold text-emerald-400">{k.change}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">Patient Trends</span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                  <TrendingUp className="h-3 w-3" /> +18.2%
                </span>
              </div>
              <svg viewBox="0 0 320 80" className="h-20 w-full">
                <defs>
                  <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 C40,50 80,35 120,40 C160,45 200,20 240,28 C280,36 300,15 320,10 L320,80 L0,80 Z"
                  fill="url(#heroAreaGrad)"
                />
                <path
                  d="M0,60 C40,50 80,35 120,40 C160,45 200,20 240,28 C280,36 300,15 320,10"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:col-span-2">
              <span className="mb-2 text-xs font-semibold text-white/90">Department Overview</span>
              <div className="relative h-16 w-16">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="35 52" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#00C2FF" strokeWidth="4" strokeDasharray="22 65" strokeDashoffset="-35" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="15 72" strokeDashoffset="-57" />
                </svg>
              </div>
              <div className="mt-1 flex gap-2 text-[8px] text-blue-200/60">
                <span>OPD</span><span>IPD</span><span>Lab</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating KPI cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-2 top-6 z-10 rounded-2xl border border-white/30 bg-white/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:-left-5"
      >
        <p className="text-[10px] text-slate-500">Average Wait Time</p>
        <p className="text-lg font-bold text-[#041B52]">18 min</p>
        <p className="text-[10px] font-semibold text-emerald-600">↓ 25% improvement</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-16 right-0 z-10 rounded-2xl border border-white/30 bg-white/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl sm:right-4"
      >
        <p className="text-[10px] text-slate-500">Patient Satisfaction</p>
        <div className="flex items-center gap-1">
          <p className="text-lg font-bold text-[#041B52]">4.8</p>
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </div>
        <p className="text-[10px] text-slate-400">out of 5.0</p>
      </motion.div>

      {/* Doctor image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute -right-4 bottom-0 z-20 hidden h-[72%] w-[38%] overflow-hidden rounded-tl-3xl sm:block lg:-right-8"
      >
        <Image
          src={HEALTHCARE_IMAGES.africanDoctor}
          alt="Healthcare professional"
          fill
          className="object-cover object-top"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#041B52]/30" />
      </motion.div>
    </div>
  );
}
