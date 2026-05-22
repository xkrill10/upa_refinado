import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'danger' | 'success';
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

const inactiveStyles = {
  default: 'glass-card-premium border-slate-200/30 dark:border-slate-800/10 shadow-none text-muted-foreground/90 dark:text-slate-400',
  primary: 'glass-card-premium border-blue-200/50 dark:border-blue-500/15 shadow-[0_4px_12px_rgba(59,130,246,0.02)] hover:shadow-[0_12px_24px_rgba(59,130,246,0.12)] text-blue-900/90 dark:text-blue-200/90',
  accent: 'glass-card-premium border-purple-200/50 dark:border-purple-500/15 shadow-[0_4px_12px_rgba(168,85,247,0.02)] hover:shadow-[0_12px_24px_rgba(168,85,247,0.12)] text-purple-900/90 dark:text-purple-200/90',
  warning: 'glass-card-premium border-amber-200/50 dark:border-amber-500/15 shadow-[0_4px_12px_rgba(245,158,11,0.02)] hover:shadow-[0_12px_24px_rgba(245,158,11,0.12)] text-amber-900/90 dark:text-amber-200/90',
  danger: 'glass-card-premium border-red-200/50 dark:border-red-500/15 shadow-[0_4px_12px_rgba(239,68,68,0.02)] hover:shadow-[0_12px_24px_rgba(239,68,68,0.12)] text-red-900/90 dark:text-red-200/90',
  success: 'glass-card-premium border-emerald-200/50 dark:border-emerald-500/15 shadow-[0_4px_12px_rgba(16,185,129,0.02)] hover:shadow-[0_12px_24px_rgba(16,185,129,0.12)] text-emerald-900/90 dark:text-emerald-200/90',
};

const activeStyles = {
  default: 'glass-card-premium stat-card-active-default text-slate-950 dark:text-slate-50',
  primary: 'glass-card-premium stat-card-active-primary text-blue-950 dark:text-blue-50',
  accent: 'glass-card-premium stat-card-active-accent text-purple-950 dark:text-purple-50',
  warning: 'glass-card-premium stat-card-active-warning text-amber-950 dark:text-amber-50',
  danger: 'glass-card-premium stat-card-active-danger text-red-950 dark:text-red-50',
  success: 'glass-card-premium stat-card-active-success text-emerald-950 dark:text-emerald-50',
};

const labelStylesInactive = {
  default: 'text-muted-foreground/60 dark:text-slate-500',
  primary: 'text-blue-700/80 dark:text-blue-300/85 font-extrabold',
  accent: 'text-purple-700/80 dark:text-purple-300/85 font-extrabold',
  warning: 'text-amber-700/80 dark:text-amber-300/85 font-extrabold',
  danger: 'text-red-700/80 dark:text-red-300/85 font-extrabold',
  success: 'text-emerald-700/80 dark:text-emerald-300/85 font-extrabold',
};

const labelStylesActive = {
  default: 'text-slate-700 dark:text-slate-300 font-extrabold',
  primary: 'text-blue-800 dark:text-blue-200 font-extrabold',
  accent: 'text-purple-800 dark:text-purple-200 font-extrabold',
  warning: 'text-amber-800 dark:text-amber-200 font-extrabold',
  danger: 'text-red-800 dark:text-red-200 font-extrabold',
  success: 'text-emerald-800 dark:text-emerald-300 font-extrabold',
};

const valueStylesInactive = {
  default: 'text-foreground/85 dark:text-slate-300',
  primary: 'text-blue-950 dark:text-blue-100 font-extrabold',
  accent: 'text-purple-950 dark:text-purple-100 font-extrabold',
  warning: 'text-amber-950 dark:text-amber-100 font-extrabold',
  danger: 'text-red-950 dark:text-red-100 font-extrabold',
  success: 'text-emerald-950 dark:text-emerald-100 font-extrabold',
};

const valueStylesActive = {
  default: 'text-slate-950 dark:text-white',
  primary: 'text-blue-950 dark:text-blue-50',
  accent: 'text-purple-950 dark:text-purple-50',
  warning: 'text-amber-950 dark:text-amber-50',
  danger: 'text-red-950 dark:text-red-50',
  success: 'text-emerald-950 dark:text-emerald-50',
};

const iconBgInactive = {
  default: 'bg-slate-500/10 text-slate-500/80 dark:bg-slate-500/15 dark:text-slate-400',
  primary: 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200 shadow-sm',
  accent: 'bg-purple-500/20 text-purple-700 dark:bg-purple-500/25 dark:text-purple-200 shadow-sm',
  warning: 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/25 dark:text-amber-200 shadow-sm',
  danger: 'bg-red-500/20 text-red-700 dark:bg-red-500/25 dark:text-red-200 shadow-sm',
  success: 'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-200 shadow-sm',
};

const iconBgActive = {
  default: 'bg-slate-500/25 text-slate-700 dark:bg-slate-500/35 dark:text-slate-200 shadow-sm',
  primary: 'bg-blue-500/25 text-blue-700 dark:bg-blue-500/35 dark:text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  accent: 'bg-purple-500/25 text-purple-700 dark:bg-purple-500/35 dark:text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  warning: 'bg-amber-500/25 text-amber-700 dark:bg-amber-500/35 dark:text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  danger: 'bg-red-500/25 text-red-700 dark:bg-red-500/35 dark:text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  success: 'bg-emerald-500/25 text-emerald-700 dark:bg-emerald-500/35 dark:text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', onClick, className, active = false }: StatCardProps) {
  const { theme } = useTheme();

  const gradientsLightInactive = {
    default: "linear-gradient(135deg, rgba(148, 163, 184, 0.17) 0%, rgba(148, 163, 184, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
    primary: "linear-gradient(135deg, rgba(59, 130, 246, 0.17) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
    accent: "linear-gradient(135deg, rgba(168, 85, 247, 0.17) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
    warning: "linear-gradient(135deg, rgba(245, 158, 11, 0.17) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
    danger: "linear-gradient(135deg, rgba(239, 68, 68, 0.17) 0%, rgba(239, 68, 68, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
    success: "linear-gradient(135deg, rgba(16, 185, 129, 0.17) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
  };

  const gradientsLightActive = {
    default: "linear-gradient(135deg, rgba(148, 163, 184, 0.38) 0%, rgba(148, 163, 184, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
    primary: "linear-gradient(135deg, rgba(59, 130, 246, 0.38) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
    accent: "linear-gradient(135deg, rgba(168, 85, 247, 0.38) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
    warning: "linear-gradient(135deg, rgba(245, 158, 11, 0.38) 0%, rgba(245, 158, 11, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
    danger: "linear-gradient(135deg, rgba(239, 68, 68, 0.38) 0%, rgba(239, 68, 68, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
    success: "linear-gradient(135deg, rgba(16, 185, 129, 0.38) 0%, rgba(16, 185, 129, 0.12) 50%, rgba(255, 255, 255, 0.5) 100%)",
  };

  const gradientsDarkInactive = {
    default: "linear-gradient(135deg, rgba(71, 85, 105, 0.32) 0%, rgba(51, 65, 85, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
    primary: "linear-gradient(135deg, rgba(30, 64, 175, 0.32) 0%, rgba(30, 58, 138, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
    accent: "linear-gradient(135deg, rgba(109, 40, 217, 0.32) 0%, rgba(91, 33, 182, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
    warning: "linear-gradient(135deg, rgba(146, 64, 14, 0.32) 0%, rgba(120, 53, 4, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
    danger: "linear-gradient(135deg, rgba(153, 27, 27, 0.32) 0%, rgba(127, 29, 29, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
    success: "linear-gradient(135deg, rgba(6, 95, 70, 0.32) 0%, rgba(4, 120, 87, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
  };

  const gradientsDarkActive = {
    default: "linear-gradient(135deg, rgba(71, 85, 105, 0.48) 0%, rgba(51, 65, 85, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
    primary: "linear-gradient(135deg, rgba(30, 64, 175, 0.48) 0%, rgba(30, 58, 138, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
    accent: "linear-gradient(135deg, rgba(109, 40, 217, 0.48) 0%, rgba(91, 33, 182, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
    warning: "linear-gradient(135deg, rgba(146, 64, 14, 0.48) 0%, rgba(120, 53, 4, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
    danger: "linear-gradient(135deg, rgba(153, 27, 27, 0.48) 0%, rgba(127, 29, 29, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
    success: "linear-gradient(135deg, rgba(6, 95, 70, 0.48) 0%, rgba(4, 120, 87, 0.22) 50%, rgba(15, 24, 42, 0.65) 100%)",
  };

  const gradient = theme === 'dark'
    ? (active ? gradientsDarkActive[variant] : gradientsDarkInactive[variant])
    : (active ? gradientsLightActive[variant] : gradientsLightInactive[variant]);

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "select-none outline-none focus:outline-none focus:ring-0 transition-opacity duration-300", 
        onClick && !active ? "opacity-[0.88] hover:opacity-100" : "opacity-100",
        className
      )}
    >
      <Card 
        onClick={onClick}
        className={cn(
          active ? activeStyles[variant] : inactiveStyles[variant],
          "relative overflow-hidden group transition-all duration-500 rounded-xl select-none outline-none border focus:outline-none focus:ring-0",
          onClick && "cursor-pointer"
        )}
        style={{
          background: gradient
        }}
      >
        <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={cn(
                "text-[9px] font-black uppercase tracking-[0.15em] transition-colors duration-300",
                active ? labelStylesActive[variant] : labelStylesInactive[variant]
              )}>
                {title}
              </p>
              <p className={cn(
                "text-[28px] font-black leading-none tracking-tighter mission-control-title transition-colors duration-300", 
                active ? valueStylesActive[variant] : valueStylesInactive[variant]
              )}>
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border transition-all duration-300",
                    variant === 'default' 
                      ? 'bg-primary/5 text-primary border-primary/20' 
                      : active 
                        ? 'bg-white/20 dark:bg-black/25 text-current border-current/30 shadow-sm' 
                        : 'bg-white/10 dark:bg-black/10 text-current border-current/15'
                  )}>
                    {trend}
                  </span>
                </div>
              )}
            </div>
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-md",
              active ? iconBgActive[variant] : iconBgInactive[variant]
            )}>
              <Icon className="h-6 w-6 stroke-[2.2]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

