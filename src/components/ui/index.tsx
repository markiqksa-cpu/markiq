// components/ui/index.tsx
// ============================================
// Markiq Reusable UI Components
// ============================================

import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

// ===== BUTTON =====
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "sm",
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 border-none",
    outline: "bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary-500 hover:text-primary-500",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-50 border-none",
    danger: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
    success: "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}

// ===== BADGE =====
interface BadgeProps {
  variant?: "blue" | "green" | "gold" | "red" | "gray" | "purple";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "blue", children, className }: BadgeProps) {
  const variants = {
    blue: "bg-primary-light text-primary-500 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-500 border-red-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ===== CARD =====
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-xl",
        padding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

// ===== CARD HEADER =====
interface CardHeaderProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3" dir="rtl">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
        {icon && <span className="text-primary-500">{icon}</span>}
        {title}
      </div>
      {action && (
        <span className="text-xs text-primary-500 cursor-pointer hover:text-primary-600">
          {action}
        </span>
      )}
    </div>
  );
}

// ===== KPI CARD =====
interface KpiCardProps {
  value: string | number;
  label: string;
  change?: string;
  changeType?: "up" | "down" | "warn" | "neutral";
  icon: ReactNode;
  iconColor?: string;
  iconBg?: string;
}

export function KpiCard({
  value, label, change, changeType = "neutral",
  icon, iconColor = "text-primary-500", iconBg = "bg-primary-light"
}: KpiCardProps) {
  const changeColors = {
    up: "text-green-600",
    down: "text-red-500",
    warn: "text-yellow-700",
    neutral: "text-gray-500",
  };

  return (
    <Card className="p-3">
      <div className={clsx("w-[26px] h-[26px] rounded-lg flex items-center justify-center mb-2", iconBg)}>
        <span className={clsx("text-sm", iconColor)}>{icon}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
      {change && (
        <div className={clsx("text-[10px] mt-1", changeColors[changeType])}>
          {change}
        </div>
      )}
    </Card>
  );
}

// ===== PROGRESS BAR =====
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value, max = 100, color = "#1B4FFF",
  height = "h-[4px]", showLabel = false
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>{value}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={clsx("w-full bg-gray-100 rounded-full overflow-hidden", height)}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ===== ALERT DOT =====
interface AlertDotProps {
  color?: "red" | "gold" | "blue" | "green";
  className?: string;
}

export function AlertDot({ color = "blue", className }: AlertDotProps) {
  const colors = {
    red: "bg-red-500",
    gold: "bg-yellow-400",
    blue: "bg-primary-500",
    green: "bg-green-500",
  };

  return (
    <div className={clsx("w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1", colors[color], className)} />
  );
}

// ===== PLATFORM ICON =====
interface PlatformIconProps {
  platform: string;
  size?: "sm" | "md";
}

const PLATFORM_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  instagram: { bg: "bg-purple-50", color: "text-purple-600", label: "IG" },
  snapchat: { bg: "bg-yellow-50", color: "text-yellow-700", label: "SN" },
  google: { bg: "bg-orange-50", color: "text-orange-500", label: "GG" },
  tiktok: { bg: "bg-blue-50", color: "text-blue-600", label: "TK" },
  twitter: { bg: "bg-sky-50", color: "text-sky-500", label: "TW" },
  youtube: { bg: "bg-red-50", color: "text-red-500", label: "YT" },
  facebook: { bg: "bg-blue-50", color: "text-blue-700", label: "FB" },
};

export function PlatformIcon({ platform, size = "sm" }: PlatformIconProps) {
  const style = PLATFORM_STYLES[platform] || { bg: "bg-gray-50", color: "text-gray-500", label: "?" };
  const sizeClass = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  return (
    <div className={clsx("rounded-md flex items-center justify-center font-bold flex-shrink-0", style.bg, style.color, sizeClass)}>
      {style.label}
    </div>
  );
}

// ===== STATUS BADGE =====
interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  active: { label: "نشط", variant: "green" },
  pending: { label: "قيد المراجعة", variant: "gold" },
  inactive: { label: "غير نشط", variant: "gray" },
  draft: { label: "مسودة", variant: "gray" },
  approved: { label: "معتمد", variant: "green" },
  rejected: { label: "مرفوض", variant: "red" },
  published: { label: "منشور", variant: "blue" },
  paused: { label: "موقوف", variant: "gold" },
  ended: { label: "منتهي", variant: "gray" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: "gray" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// ===== TOGGLE =====
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative w-9 h-5 rounded-full transition-colors flex-shrink-0",
        checked ? "bg-primary-500" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
          checked ? "right-0.5" : "right-[calc(100%-18px)]"
        )}
      />
    </button>
  );
}

// ===== EMPTY STATE =====
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" dir="rtl">
      {icon && <div className="text-gray-300 mb-3 text-4xl">{icon}</div>}
      <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
      {description && <div className="text-xs text-gray-400 mb-4 max-w-xs">{description}</div>}
      {action}
    </div>
  );
}

// ===== LOADING SPINNER =====
export function Spinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className={clsx("border-2 border-primary-500 border-t-transparent rounded-full animate-spin", sizes[size])} />
  );
}
