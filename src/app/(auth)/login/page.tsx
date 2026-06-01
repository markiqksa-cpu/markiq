"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Brain } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور"); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-blue-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg mb-4">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-yellow-400">M</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Markiq</h1>
          <p className="text-blue-200 text-sm mt-1">منصة التسويق الذكي</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-modal p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">تسجيل الدخول</h2>
          <p className="text-xs text-gray-500 mb-5">أدخل بياناتك للوصول إلى المنصة</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="omar@markiq.sa"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 text-right"
                dir="ltr"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50 pr-10"
                  dir="ltr"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                تذكرني
              </label>
              <a href="#" className="text-primary-500 hover:text-primary-600">نسيت كلمة المرور؟</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> جارٍ الدخول...</>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400 justify-center">
            <Brain size={11} className="text-primary-400" />
            مدعوم بـ Claude AI من Anthropic
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          سري — للاستخدام الداخلي فقط
        </p>
      </div>
    </div>
  );
}
