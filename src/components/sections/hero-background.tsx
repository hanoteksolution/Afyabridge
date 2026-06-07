"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  top: `${(i * 23 + 10) % 85}%`,
  size: 2 + (i % 3),
  delay: (i % 8) * 0.4,
  duration: 4 + (i % 5),
}));

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#041B52] via-[#072563] to-[#0D2F8E]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(45,127,249,0.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(0,194,255,0.12),transparent_55%)]" />

      {/* World map overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse cx="720" cy="400" rx="520" ry="280" fill="none" stroke="#60A5FA" strokeWidth="1" />
        <ellipse cx="720" cy="400" rx="380" ry="200" fill="none" stroke="#60A5FA" strokeWidth="0.75" />
        <path
          d="M200,350 Q400,280 620,320 T1040,300 Q1200,340 1280,380"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        <path
          d="M180,450 Q500,520 720,480 T1200,460"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1"
        />
        {[
          [320, 340], [520, 300], [680, 360], [860, 320], [1020, 380],
          [400, 420], [600, 460], [780, 440], [940, 400],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="#3B82F6" opacity="0.6" />
        ))}
      </svg>

      {/* Glow trails */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#2563EB]/25 via-[#2563EB]/5 to-transparent" />
      <motion.div
        className="absolute -bottom-20 left-[10%] h-40 w-[60%] rounded-full bg-[#2D7FF9]/20 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 right-[5%] h-32 w-[40%] rounded-full bg-[#00C2FF]/15 blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#60A5FA]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -18, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
