"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", leads: 12, demos: 8 },
  { month: "Feb", leads: 19, demos: 12 },
  { month: "Mar", leads: 15, demos: 10 },
  { month: "Apr", leads: 22, demos: 15 },
  { month: "May", leads: 28, demos: 18 },
  { month: "Jun", leads: 35, demos: 22 },
];

export function DashboardChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#0A1F78]">
            Lead Analytics
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Monthly leads and demo request trends
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            Leads
          </span>
          <span className="flex items-center gap-2 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00C2FF]" />
            Demos
          </span>
        </div>
      </div>

      <div className="p-6 pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorDemos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00C2FF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 32px -12px rgba(10,31,120,0.18)",
                background: "rgba(255,255,255,0.96)",
              }}
            />
            <Legend wrapperStyle={{ display: "none" }} />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#2563EB"
              fill="url(#colorLeads)"
              strokeWidth={2.5}
              animationDuration={1400}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="demos"
              stroke="#00C2FF"
              fill="url(#colorDemos)"
              strokeWidth={2.5}
              animationDuration={1600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
