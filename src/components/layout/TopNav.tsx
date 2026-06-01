"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Megaphone, Calendar, Brain,
  BarChart2, Grid3X3, Image, DollarSign, UserCog,
  Settings, Bell, Search, ChevronDown, LogOut, User,
  Building2, X
} from "lucide-react";

// ===== TYPES =====
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  indicatorWidth: string;
}

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface Client {
  id: string;
  name: string;
}

interface TopNavProps {
  currentClient?: Client | null;
  onClientChange?: () => void;
  alertCount?: number;
  user?: { name: string; email: string; role: string };
}

// ===== NAV CONFIG =====
const NAV_ITEMS: NavItem[] = [
  { label: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard size={15} />, indicatorWidth: "14%" },
  { label: "العملاء", href: "/clients", icon: <Users size={15} />, indicatorWidth: "28%" },
  { label: "الحملات", href: "/campaigns", icon: <Megaphone size={15} />, indicatorWidth: "42%" },
  { label: "التقويم", href: "/calendar", icon: <Calendar size={15} />, indicatorWidth: "56%" },
  { label: "AI", href: "/ai", icon: <Brain size={15} />, indicatorWidth: "70%" },
  { label: "التقارير", href: "/reports", icon: <BarChart2 size={15} />, indicatorWidth: "84%" },
];

const MORE_ITEMS: DropdownItem[] = [
  { label: "مكتبة المحتوى", href: "/content", icon: <Image size={14} /> },
  { label: "المالية", href: "/finance", icon: <DollarSign size={14} /> },
  { label: "إدارة الفريق", href: "/team", icon: <UserCog size={14} /> },
  { label: "الإعدادات", href: "/settings", icon: <Settings size={14} /> },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "مدير عام",
  campaign_manager: "مدير حملات",
  content_specialist: "متخصص محتوى",
  data_analyst: "محلل بيانات",
  ads_specialist: "متخصص إعلانات",
};

// ===== COMPONENT =====
export default function TopNav({
  currentClient,
  onClientChange,
  alertCount = 0,
  user = { name: "عمر", email: "omar@markiq.sa", role: "admin" },
}: TopNavProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search input
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Active item indicator
  const activeItem = NAV_ITEMS.find((item) =>
    pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const indicatorWidth = activeItem?.indicatorWidth || "0%";

  // User initials
  const initials = user.name.charAt(0).toUpperCase();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="flex items-center px-4 h-[52px] gap-1">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 ml-5 flex-shrink-0">
          <div className="w-[30px] h-[30px] bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold text-yellow-400">
            M
          </div>
          <span className="text-lg font-semibold text-gray-900">Markiq</span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-0.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium h-9 whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary-500"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 h-9 transition-colors"
            >
              <Grid3X3 size={15} />
              المزيد
            </button>
            {moreOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-white border border-gray-200 rounded-xl shadow-dropdown py-1.5 min-w-[180px] z-50">
                {MORE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 mx-1 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 mr-auto flex-shrink-0">

          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث سريع..."
                className="bg-transparent border-none outline-none text-xs text-gray-700 w-32 placeholder-gray-400"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                <X size={12} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:border-primary-500 transition-colors"
            >
              <Search size={14} />
              <span>بحث سريع...</span>
              <span className="text-[9px] bg-white border border-gray-200 rounded px-1 py-0.5">⌘K</span>
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

          {/* Client Pill */}
          <button
            onClick={onClientChange}
            className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs transition-colors ${
              currentClient
                ? "bg-primary-light border-blue-200 text-primary-500 font-medium hover:bg-blue-100"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-primary-500"
            }`}
          >
            <div className="w-[7px] h-[7px] rounded-full bg-green-500 flex-shrink-0" />
            {currentClient ? currentClient.name : "جميع العملاء"}
            <ChevronDown size={10} className="text-current opacity-70" />
          </button>

          {/* Notifications */}
          <button className="relative w-[34px] h-[34px] rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-primary-500 transition-colors group">
            <Bell size={16} className="text-gray-500 group-hover:text-primary-500" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
            )}
          </button>

          {/* User Avatar */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-[34px] h-[34px] rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-yellow-400 hover:ring-2 hover:ring-primary-500 hover:ring-offset-1 transition-all"
            >
              {initials}
            </button>
            {userMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 rounded-xl shadow-dropdown py-1.5 min-w-[210px] z-50">
                {/* User Info */}
                <div className="px-3 py-2 pb-3 border-b border-gray-100 mb-1">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{user.email}</div>
                  <span className="inline-block mt-1.5 text-[9px] bg-primary-light text-primary-500 px-2 py-0.5 rounded-full">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 mx-1 rounded-lg transition-colors"
                >
                  <User size={13} className="text-gray-400" />
                  الملف الشخصي
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 mx-1 rounded-lg transition-colors"
                >
                  <Settings size={13} className="text-gray-400" />
                  الإعدادات
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { /* handle logout */ }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 mx-1 rounded-lg transition-colors w-full text-right"
                  >
                    <LogOut size={13} />
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Indicator Line */}
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-primary-500 rounded-r-sm transition-all duration-300"
          style={{ width: indicatorWidth }}
        />
      </div>
    </nav>
  );
}
