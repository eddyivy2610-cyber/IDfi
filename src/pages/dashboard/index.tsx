// 'use client';
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/src/hooks/useAuth";
// import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
// import { AppSidebar } from "@/src/components/AppSidebar";
// import * as React from 'react';
// import { fetchProfile } from "@/src/Actions/profileActions";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/src/state/store";
// import { setAuth } from "@/src/state/authSlice";

// type UserType = {
//   fullName: string;
//   email: string;
//   role: string;
//   id: string;
// }
// type ProfileType = {
//   email: string;
//   bio: string;
//   studentId: string;
//   full_name: string;
//   program: string;
//   study_year: number;

// }


// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   loading: boolean;
//   profile: ProfileType;
//   user: UserType;
// }


// export function DashboardLayout({ profile, user, loading, children }: DashboardLayoutProps) {

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   const router = useRouter();

//   if (!user) {
//     // Redirect on unauthenticated, but return null to satisfy ReactNode
//     router.push("/auth");
//     return null;
//   }

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <div className="flex-1 flex flex-col">
//           <header className="h-14 flex items-center border-b bg-background px-4">
//             <SidebarTrigger />
//           </header>
//           <main className="flex-1 p-6 bg-background">
//             {children}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }

// const Dashboard = () => {

// const dispatch = useDispatch();
// const {user, profile, loading} = useSelector((state: RootState) => state.auth)
//   React.useEffect(()=>{},[profile])

//   return (
//     <DashboardLayout profile={profile} user={user} loading={loading}>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">
//             Welcome back, {user?.fullName?.split(" ")[0] || "Student"}!
//           </h1>
//           <p className="text-muted-foreground">
//             Access your student information and digital ID card
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
//             <h3 className="font-semibold">Digital ID Card</h3>
//             <p className="text-sm text-muted-foreground mt-2">
//               View and print your official student ID card
//             </p>
//           </div>

//           <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
//             <h3 className="font-semibold">My Courses</h3>
//             <p className="text-sm text-muted-foreground mt-2">
//               View your enrolled courses and schedules
//             </p>
//           </div>

//           <div className="rounded-lg border grow-1 bg-card text-card-foreground shadow-sm p-6">
//             <h3 className="font-semibold">Academic Year</h3>
//             <p className="text-sm text-muted-foreground mt-2">
//               Current academic year: 2024/2025
//             </p>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;

'use client';

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { AppSidebar } from "@/src/components/AppSidebar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import Link from "next/link";
import * as studentActions from "@/src/Actions/studentActions"
import { toast } from "@/src/hooks/use-toast";

type UserType = {
  fullName: string;
  email: string;
  role: string;
  id: string;
}
type ProfileType = {
  email: string;
  bio: string;
  studentId: string;
  full_name: string;
  program: string;
  study_year: number;
  sex?: string;
  dob?: string;
  stateOfOrigin?: string;
  signature?: string;
  nextOfKin?: string;
  kinAddress?: string;
  kinPhone?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}


import { Bell, CreditCard, GraduationCap, User, ShieldCheck, FileText, AlertTriangle, Clock } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  loading: boolean;
  profile: ProfileType;
  user: UserType;
}

export function DashboardLayout({ profile, user, loading, children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data?.unreadCount) setUnreadCount(data.unreadCount);
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
    router.push("/auth");
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);
  const [adminStats, setAdminStats] = React.useState({ students: 0, applications: 0, valid: 0, activeCards: 0 });

  const handleStudentRegister = async (userId: string) => {
    const { error, message } = await studentActions.registerStudent({ userId: user.id });
    if (error) return toast({ title: message, variant: "destructive" });
    toast({ title: message, variant: "success" });
  };

  React.useEffect(() => {
    if (user?.id && user.role !== 'admin') {
      handleStudentRegister(user.id);
    }
  }, [user?.id, user?.role]);

  React.useEffect(() => {
    if (user?.role === 'admin') {
      const fetchStats = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        try {
          const res = await fetch('/api/admin/dashboard-stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data) setAdminStats(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStats();
    }
  }, [user?.role]);

  if (user?.role === 'admin') {
    return (
      <DashboardLayout profile={profile} user={user} loading={loading}>
        <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]/60 items-center">
          
          {/* Card 1: Total Students */}
          <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0 md:first:pl-0">
            <div className="w-12 h-12 rounded-full bg-[#EBF3FF] flex items-center justify-center flex-shrink-0 text-[#0052FF] shadow-[0_2px_8px_rgba(0,82,255,0.05)]">
              <User className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Students</p>
              <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{adminStats.students}</span>
            </div>
          </div>

          {/* Card 2: Applications */}
          <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#FFF4ED] flex items-center justify-center flex-shrink-0 text-[#EA580C] shadow-[0_2px_8px_rgba(234,88,12,0.05)]">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Applications</p>
              <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{adminStats.applications}</span>
            </div>
          </div>

          {/* Card 3: Valid Accounts */}
          <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0">
            <div className="w-12 h-12 rounded-full bg-[#E8F8F0] flex items-center justify-center flex-shrink-0 text-[#10B981] shadow-[0_2px_8px_rgba(16,185,129,0.05)]">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Valid Accounts</p>
              <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{adminStats.valid}</span>
            </div>
          </div>

          {/* Card 4: Active ID Cards */}
          <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0 md:last:pr-0">
            <div className="w-12 h-12 rounded-full bg-[#E6F7F7] flex items-center justify-center flex-shrink-0 text-[#00B4D8] shadow-[0_2px_8px_rgba(0,180,216,0.05)]">
              <CreditCard className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Active ID Cards</p>
              <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{adminStats.activeCards}</span>
            </div>
          </div>

        </div>
      </DashboardLayout>
    );
  }

  const isIdActive = !!(profile?.studentId && profile?.full_name);
  const idStatus = isIdActive ? "Active" : "N/A";
  const level = profile?.study_year ? `${profile.study_year * 100} Level` : "N/A";

  const fields = [
    profile?.studentId,
    profile?.full_name,
    profile?.email,
    profile?.study_year,
    profile?.program,
    profile?.bio
  ];
  const filledFields = fields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / fields.length) * 100) || 0;
  
  const dbVerificationStatus = (profile as any)?.verificationStatus || 'unapplied';
  let displayStatus = 'Not Applied';
  let VerificationIcon = AlertTriangle;
  let iconColor = 'text-amber-500';
  let iconBg = 'bg-amber-50 shadow-[0_2px_8px_rgba(245,158,11,0.05)]';

  if (dbVerificationStatus === 'unapplied') {
    displayStatus = 'Not Applied';
    VerificationIcon = AlertTriangle;
    iconColor = 'text-amber-500';
    iconBg = 'bg-amber-50 shadow-[0_2px_8px_rgba(245,158,11,0.05)]';
  } else if (dbVerificationStatus === 'pending') {
    displayStatus = 'Processing';
    VerificationIcon = Clock;
    iconColor = 'text-[#00B4D8]';
    iconBg = 'bg-[#E6F7F7] shadow-[0_2px_8px_rgba(0,180,216,0.05)]';
  } else if (dbVerificationStatus === 'approved') {
    displayStatus = 'Successful';
    VerificationIcon = ShieldCheck;
    iconColor = 'text-[#10B981]';
    iconBg = 'bg-[#E8F8F0] shadow-[0_2px_8px_rgba(16,185,129,0.05)]';
  } else if (dbVerificationStatus === 'rejected') {
    displayStatus = 'Rejected';
    VerificationIcon = AlertTriangle;
    iconColor = 'text-red-500';
    iconBg = 'bg-red-50 shadow-[0_2px_8px_rgba(239,68,68,0.05)]';
  }

  // Student dashboard: 4 clean cards in a single row panel matching the reference image layout
  return (
    <DashboardLayout profile={profile} user={user} loading={loading}>
      <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]/60 items-center">
        {/* Card 1: ID Status */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0 md:first:pl-0 md:last:pr-0">
          <div className="w-12 h-12 rounded-full bg-[#FFEFEF] flex items-center justify-center flex-shrink-0 text-[#FF4D4D] shadow-[0_2px_8px_rgba(255,77,77,0.05)]">
            <CreditCard className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>ID Status</p>
            <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{idStatus}</span>
          </div>
        </div>

        {/* Card 2: Level */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0">
          <div className="w-12 h-12 rounded-full bg-[#E8F8F0] flex items-center justify-center flex-shrink-0 text-[#10B981] shadow-[0_2px_8px_rgba(16,185,129,0.05)]">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Level</p>
            <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{level}</span>
          </div>
        </div>

        {/* Card 3: Profile Completion */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0">
          <div className="w-12 h-12 rounded-full bg-[#EBF3FF] flex items-center justify-center flex-shrink-0 text-[#0052FF] shadow-[0_2px_8px_rgba(0,82,255,0.05)]">
            <User className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Profile Progress</p>
            <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{profileCompletion}%</span>
          </div>
        </div>

        {/* Card 4: Verification */}
        <div className="flex items-center gap-4 px-4 md:px-6 py-4 md:py-0 md:last:pr-0">
          <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 ${iconColor}`}>
            <VerificationIcon className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#8E9CAE] tracking-wide mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Verification</p>
            <span className="text-2xl font-bold text-[#111827] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>{displayStatus}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;