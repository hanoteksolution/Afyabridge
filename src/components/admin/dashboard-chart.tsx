"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
    <div className="rounded-xl border border-slate-200/80 bg-white p-6">
      <h3 className="text-lg font-semibold text-[#0A1F78] mb-4">Lead Analytics</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDemos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          />
          <Area type="monotone" dataKey="leads" stroke="#2563EB" fill="url(#colorLeads)" strokeWidth={2} />
          <Area type="monotone" dataKey="demos" stroke="#00C2FF" fill="url(#colorDemos)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
