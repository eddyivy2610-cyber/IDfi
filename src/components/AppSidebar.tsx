import * as React from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  CreditCard,
  BookOpen,
  Users,
  Settings,
  HelpCircle,
  MessageSquare,
  ArrowLeft,
  User,
  FileText,
  Fingerprint,
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { logOut } from '../state/authSlice';

// Student items mapped to match the visual names and layout from Invo mockup
type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string | number;
};

const studentItems: MenuItem[] = [
  { title: "Home",       url: "/dashboard",            icon: LayoutGrid },
  { title: "My Profile", url: "/dashboard/student-profile", icon: User },
  { title: "My ID Card", url: "/dashboard/id-card",    icon: CreditCard },
  { title: "Settings",   url: "/dashboard/profile",    icon: Settings },
  { title: "Help",       url: "/dashboard/complaints", icon: HelpCircle },
];

const adminItems: MenuItem[] = [
  { title: "Home",         url: "/dashboard",          icon: LayoutGrid },
  { title: "Users",        url: "/admin/users",        icon: Users },
  { title: "Applications", url: "/admin/applications", icon: FileText },
  { title: "Complaints",   url: "/admin/complaints",   icon: MessageSquare },
  { title: "Settings",     url: "/dashboard/profile",  icon: Settings },
];

// Beautiful Fingerprint Logo matching the new IDfi brand
const LogoIcon = () => (
  <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(0,82,255,0.2)]">
    <Fingerprint className="w-5 h-5 text-white" />
  </div>
);

export function AppSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin ? adminItems : studentItems;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    dispatch(logOut());
    router.push("/auth");
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(url);
  };

  return (
    <>
      <aside
        className="hidden md:flex w-[240px] h-screen bg-transparent flex-col fixed inset-y-0 left-0 z-20 select-none"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
      {/* ── Brand Logo Header ── */}
      <div className="pl-8 pt-8 pb-10 flex items-center gap-3">
        <LogoIcon />
        <span 
          className="text-xl font-bold tracking-tight text-[#111827]"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          IDfi<span className="text-[#0052FF]">.</span>
        </span>
      </div>

      {/* ── Main Navigation List ── */}
      <nav className="flex-1 px-4 space-y-1.5 pl-6 mt-12">
        {menuItems.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`
                group flex items-center gap-3.5 rounded-[14px] px-4 py-[11px]
                text-[14px] font-medium transition-all duration-200
                ${active
                  ? "bg-[#0052FF] text-white shadow-[0_4px_12px_rgba(0,82,255,0.2)]"
                  : "text-[#6E7C87] hover:text-[#111827] hover:bg-[#F3F4F6]/50"
                }
              `}
            >
              <item.icon
                className={`flex-shrink-0 w-5 h-5 transition-colors duration-200
                  ${active ? "text-white" : "text-[#9BA7B0] group-hover:text-[#4A5568]"}
                `}
              />
              <span className="leading-none mt-[1px]">{item.title}</span>
              
              {/* Optional Messages Notification Dot */}
              {!active && item.badge && (
                <span className="ml-auto w-5 h-5 bg-[#0052FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: Log Out ── */}
      <div className="pl-6 pb-8 pt-4">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3.5 px-4 py-[11px] text-[14px] font-medium text-[#6E7C87] hover:text-[#DC2626] transition-all duration-200"
        >
          <ArrowLeft className="flex-shrink-0 w-5 h-5 text-[#9BA7B0] group-hover:text-[#DC2626] transition-colors duration-200" />
          <span className="leading-none mt-[1px]">Log Out</span>
        </button>
      </div>
    </aside>
      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-white border-t border-[#EAECF0]/80 z-[100] flex justify-around items-center px-2 pb-safe" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {menuItems.map((item) => {
          const active = isActive(item.url);
          // Show only main navigation items on mobile to fit nicely (skip settings/help if too many, but let's keep all 5 as they fit in bottom nav)
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200 ${
                active ? "text-[#0052FF]" : "text-[#9BA7B0] hover:text-[#4A5568]"
              }`}
            >
              <div className={`relative flex items-center justify-center p-1.5 rounded-full ${active ? 'bg-[#EBF3FF]' : ''}`}>
                <item.icon className="w-[22px] h-[22px]" />
                {!active && item.badge && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#0052FF] rounded-full border-2 border-white"></span>
                )}
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-[#0052FF] font-bold' : ''}`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
