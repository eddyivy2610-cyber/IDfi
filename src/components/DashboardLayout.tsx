import React from 'react';
import { useRouter, usePathname } from "next/navigation";
import { AppSidebar } from "@/src/components/AppSidebar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import Link from "next/link";
import { Bell } from "lucide-react";

export type UserType = {
  fullName: string;
  email: string;
  role: string;
  id: string;
};

export type ProfileType = {
  email?: string;
  bio?: string;
  studentId?: string;
  full_name?: string;
  program?: string;
  study_year?: number;
  sex?: string;
  dob?: string;
  stateOfOrigin?: string;
  signature?: string;
  nextOfKin?: string;
  kinAddress?: string;
  kinPhone?: string;
  phone?: string;
  verificationStatus?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export interface DashboardLayoutProps {
  children: React.ReactNode;
  loading: boolean;
  profile: ProfileType | null | undefined;
  user: UserType | null | undefined;
}

export function DashboardLayout({ profile, user, loading, children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.unreadCount !== undefined) setUnreadCount(data.unreadCount);
        else if (Array.isArray(data?.notifications)) setUnreadCount(data.notifications.length);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      router.push("/auth");
    }
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : (isAdmin ? "Admin" : "Student");
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  const getHeaderDetails = () => {
    const renderTitle = (firstWord: string, secondWord: string) => (
      <>
        {firstWord} <span className="text-[#7C3AED] font-extrabold">{secondWord}</span>
      </>
    );

    if (pathname === "/dashboard/student-profile") {
      return { 
        subtitle: "Manage your student information", 
        title: renderTitle("My", "Profile") 
      };
    }
    if (pathname === "/dashboard/id-card") {
      return { 
        subtitle: "Your official digital student ID card", 
        title: renderTitle("My", "ID Card") 
      };
    }
    if (pathname === "/dashboard/notifications") {
      return { 
        subtitle: "System alerts and application updates", 
        title: renderTitle("My", "Notifications") 
      };
    }
    if (pathname === "/dashboard/courses") {
      return { 
        subtitle: "View your enrolled academic courses and curriculum", 
        title: renderTitle("My", "Courses") 
      };
    }
    if (pathname === "/dashboard/lecturers") {
      return { 
        subtitle: "Browse your university professors and teaching staff", 
        title: renderTitle("Our", "Lecturers") 
      };
    }
    if (pathname === "/dashboard/complaints") {
      return { 
        subtitle: "File or view feedback, grievances, and support tickets", 
        title: renderTitle("Submit", "Complaint") 
      };
    }
    if (pathname === "/dashboard/profile") {
      return { 
        subtitle: "Configure security preferences ", 
        title: renderTitle("Account", "Settings") 
      };
    }
    if (pathname === "/admin/users") {
      return { 
        subtitle: "Audit and manage signed up user accounts", 
        title: renderTitle("Manage", "Users") 
      };
    }
    if (pathname === "/admin/applications") {
      return { 
        subtitle: "Review and process ID card applications", 
        title: renderTitle("Manage", "Applications") 
      };
    }
    if (pathname === "/admin/admin-lecturers") {
      return { 
        subtitle: "Assign lecturers to courses and departments", 
        title: renderTitle("Manage", "Lecturers") 
      };
    }
    if (pathname === "/admin/complaints") {
      return { 
        subtitle: "Review and respond to student inquiries", 
        title: renderTitle("Manage", "Complaints") 
      };
    }
    return {
      subtitle: "Access your student identification and details",
      title: renderTitle("Hello,", firstName)
    };
  };

  const header = getHeaderDetails();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative bg-[#F8FAFC] overflow-hidden">
        {/* Top-Right Soft Glow */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_65%)] pointer-events-none" />

        {/* Bottom-Left Soft Glow */}
        <div className="absolute bottom-0 left-0 w-[650px] h-[650px] bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.09),transparent_65%)] pointer-events-none" />

        <AppSidebar />

        {/* Content offset to clear the fixed 240px sidebar */}
        <div className="flex-1 flex flex-col h-screen md:ml-[240px] ml-0 transition-all duration-200 relative z-1 overflow-hidden pb-[70px] md:pb-0">
          {/* Header */}
          <header className="flex items-center justify-between px-6 md:px-10 pt-8 md:pt-10 pb-4 md:pb-6 bg-transparent shrink-0">
            {/* Page / Welcome Title */}
            <div>
              <p
                className="text-[12px] font-medium text-[#8E9CAE] tracking-wider uppercase mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {header.subtitle}
              </p>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {header.title}
              </h1>
            </div>

            {/* Account & Notification */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Link href="/dashboard/notifications" className="relative w-11 h-11 rounded-full bg-white border border-[#EAECF0]/80 flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 text-[#6E7C87] hover:text-[#111827]">
                <Bell className="w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </Link>

              {/* Profile Avatar with Sunset/Purple Gradient */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#F59E0B] flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:scale-105 transition-all duration-200">
                <span
                  className="text-white text-base font-bold tracking-wider select-none"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {initial}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
