"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-5 py-1.5 bg-gray-50 border-b border-gray-200 text-xs"
      dir="rtl"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronLeft size={12} className="text-gray-300 rotate-180" />
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-primary-500 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-800 font-medium" : "text-gray-500"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
