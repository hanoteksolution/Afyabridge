import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0A1F78] text-white",
        secondary: "border-transparent bg-[#2563EB]/10 text-[#2563EB]",
        accent: "border-transparent bg-[#00C2FF]/20 text-[#0A1F78]",
        outline: "border-slate-200 text-slate-700",
        success: "border-transparent bg-emerald-100 text-emerald-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
