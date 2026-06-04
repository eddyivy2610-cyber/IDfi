// import StudentIDCard from '@/src/components/StudentIdCard';
// import { UserContext, useUser } from '@/src/state/userContext';
// import { useAuth } from '@/src/hooks/useAuth';
// import * as React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/src/state/store';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useEffect } from 'react';

// const StudentID = () => {
//     useEffect(() => {}, [])
//     const router = useRouter();
//     const {user, profile, loading} = useSelector((state: RootState) => state.auth);

//     if(!loading && user?.role === "admin") return router.push("/dashboard");

//   return !loading && !profile?.full_name 
//     ? (<>Go to The profile page and complete your profile,
//         <Link className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0' href={"/dashboard/profile"}>Here</Link></> )
//    : (<StudentIDCard student={{
//         study_year: profile?.study_year,
//         full_name: profile?.full_name,
//         program: profile?.program,
//         studentId: profile?.studentId,
//         avatar: profile?.avatar
//     }} profile={{
//         user_id: user?.id,
//         email: user?.email
//     }} />)
// }

// export default StudentID;

import StudentIDCard from '@/src/components/StudentIdCard';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/state/store';
import { setAuth } from '@/src/state/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/pages/dashboard';
import { CreditCard, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import * as profileActions from '@/src/Actions/profileActions';

const StudentID = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, profile, loading } = useSelector((state: RootState) => state.auth);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        if (!loading && user?.role === "admin") {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <DashboardLayout loading={loading} profile={profile} user={user}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) return null;

    const isProfileIncomplete = 
        !profile?.full_name || 
        !profile?.studentId || 
        !profile?.program ||
        !profile?.avatar ||
        !profile?.sex ||
        !profile?.dob ||
        !profile?.stateOfOrigin ||
        !profile?.phone ||
        !profile?.nextOfKin ||
        !profile?.kinPhone ||
        !profile?.kinAddress;

    if (isProfileIncomplete) {
        return (
            <DashboardLayout loading={loading} profile={profile} user={user}>
                <div className="max-w-xl mx-auto py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center flex flex-col items-center">
                        {/* Glow Icon Container */}
                        <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/5 flex items-center justify-center text-[#0052FF] mb-6 shadow-sm">
                            <CreditCard className="w-8 h-8" />
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-[#111827] mb-2 font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Profile Setup Required
                        </h2>
                        
                        {/* Description */}
                        <p className="text-[#6E7C87] text-[14px] leading-relaxed max-w-md mb-8">
                            Before we can generate and issue your digital Student ID Card, you must complete your student profile details. This information is required for the card's front and back pages.
                        </p>

                        {/* Required info list split to two columns */}
                        <div className="w-full border border-[#EAECF0]/60 rounded-lg p-5 bg-[#F8FAFC]/50 mb-8">
                            <h4 className="font-semibold text-[#111827] text-xs uppercase tracking-wider mb-3 font-sora text-center" style={{ fontFamily: "'Sora', sans-serif" }}>
                                Required Profile Information
                            </h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#6E7C87] text-left">
                                <div className="space-y-1.5">
                                    <p>• Passport Photograph</p>
                                    <p>• Full Name</p>
                                    <p>• Registration Number</p>
                                    <p>• Course of Study</p>
                                    <p>• Sex & Date of Birth</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p>• State of Origin</p>
                                    <p>• Holder's Phone No</p>
                                    <p>• Next of Kin Name</p>
                                    <p>• Next of Kin Phone</p>
                                    <p>• Next of Kin Address</p>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action Button */}
                        <Link
                            href="/dashboard/student-profile"
                            className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg px-6 py-3 shadow-[0_4px_12px_rgba(0,82,255,0.15)] hover:shadow-[0_6px_20px_rgba(0,82,255,0.25)] transition-all duration-200"
                        >
                            <span>Complete Student Profile</span>
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }
    const verificationStatus = profile?.verificationStatus || 'unapplied';

    if (verificationStatus === 'unapplied') {
        const handleApply = async () => {
            setIsApplying(true);
            try {
                const updatedProfile = await profileActions.updateProfile({ user_id: user.id, studentId: profile.studentId, study_year: profile.study_year, program: profile.program, full_name: profile.full_name, email: profile.email, bio: profile.bio, verificationStatus: 'pending' } as any);
                dispatch(setAuth({ user, profile: updatedProfile, loading: false, token: localStorage.getItem("auth_token") }));
            } catch (err) {
                console.error("Apply error:", err);
            } finally {
                setIsApplying(false);
            }
        };

        return (
            <DashboardLayout loading={loading} profile={profile} user={user}>
                <div className="max-w-xl mx-auto py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/5 flex items-center justify-center text-[#0052FF] mb-6 shadow-sm">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-[#111827] mb-2 font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Review & Apply
                        </h2>
                        <p className="text-[#6E7C87] text-[14px] leading-relaxed max-w-md mb-8">
                            Your profile is complete! Please review your details on the Profile page. Once you are sure everything is correct, submit your application for the digital ID card.
                        </p>
                        
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard/student-profile"
                                className="inline-flex items-center justify-center gap-2 bg-white border border-[#EAECF0] text-[#111827] text-sm font-semibold rounded-lg px-6 py-3 shadow-sm hover:bg-[#F8FAFC] transition-all duration-200"
                            >
                                <span>Review Profile</span>
                            </Link>
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg px-6 py-3 shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span>{isApplying ? "Submitting..." : "Submit Application"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (verificationStatus === 'pending') {
        return (
            <DashboardLayout loading={loading} profile={profile} user={user}>
                <div className="max-w-xl mx-auto py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#E8F8F0] flex items-center justify-center text-[#10B981] mb-6 shadow-sm">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-[#111827] mb-2 font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Success! Application Submitted
                        </h2>
                        <p className="text-[#6E7C87] text-[14px] leading-relaxed max-w-md mb-4">
                            Your profile has been submitted successfully and is currently being reviewed by the administration.
                        </p>
                        <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-4 text-sm max-w-md w-full mx-auto">
                            <strong>Note:</strong> This process may take up to 7 business days. You will be notified once your ID card is approved and ready for use.
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (verificationStatus === 'rejected') {
        const handleResubmit = async () => {
            await profileActions.updateProfile({ user_id: user.id, verificationStatus: 'pending' } as any);
            window.location.reload();
        };

        return (
            <DashboardLayout loading={loading} profile={profile} user={user}>
                <div className="max-w-xl mx-auto py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <div className="bg-white border border-[#EAECF0]/80 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-sm">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-[#111827] mb-2 font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Application Rejected
                        </h2>
                        <p className="text-[#6E7C87] text-[14px] leading-relaxed max-w-md mb-8">
                            Your ID card application was rejected by the administration. Please double check your profile details (e.g., matching names, valid passport photograph) and resubmit your application.
                        </p>
                        
                        <div className="flex gap-4">
                            <Link
                                href="/dashboard/student-profile"
                                className="inline-flex items-center justify-center gap-2 bg-white border border-[#EAECF0] text-[#111827] text-sm font-semibold rounded-lg px-6 py-3 shadow-sm hover:bg-[#F8FAFC] transition-all duration-200"
                            >
                                <span>Edit Profile</span>
                            </Link>
                            <button
                                onClick={handleResubmit}
                                className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg px-6 py-3 shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all duration-200"
                            >
                                <span>Resubmit Application</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Active Card Layout (Approved)
    const cardCreatedAt = profile?.createdAt ? new Date(profile.createdAt) : new Date();
    const oneYearFromCreation = new Date(cardCreatedAt.getTime() + 1000 * 60 * 60 * 24 * 365);
    const canCancel = new Date() > oneYearFromCreation;

    const handleCancelCard = async () => {
        if (!canCancel) return;
        if (confirm("Are you sure you want to cancel this card? This will reset your profile so you can apply for a new one.")) {
            await profileActions.updateProfile({ user_id: user.id, studentId: profile.studentId, study_year: profile.study_year, program: profile.program, full_name: profile.full_name, email: profile.email, bio: profile.bio, verificationStatus: 'unapplied' } as any);
            window.location.reload();
        }
    };

    return (
        <DashboardLayout loading={loading} profile={profile} user={user}>
            <div className="max-w-4xl mx-auto py-4 md:py-8">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl font-bold text-[#111827] font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>Your Active ID Card</h1>
                    <p className="text-[#6E7C87] mt-1 text-sm">This is your official digital student identification card.</p>
                </div>
                
                <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-2xl p-4 md:p-8 flex items-center justify-center min-h-[400px] overflow-hidden">
                    <div className="w-full overflow-x-auto pb-2 -mb-2">
                        <div className="min-w-fit mx-auto flex items-center justify-center">
                            <StudentIDCard student={profile} profile={{
                                user_id: user.id,
                                email: user.email
                            }} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 bg-white border border-[#EAECF0] rounded-xl p-4 md:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-semibold text-[#111827]">Request New Card</h3>
                            <p className="text-sm text-[#6E7C87] mt-1 max-w-xl">
                                If you have lost your card or need to update your details, you can cancel your current active card. This is only allowed after 1 year of active validity.
                            </p>
                        </div>
                        <button
                            onClick={handleCancelCard}
                            disabled={!canCancel}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                canCancel 
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            }`}
                        >
                            Cancel Active Card
                        </button>
                    </div>
                    {!canCancel && (
                        <p className="text-xs text-red-500 mt-3 font-medium">
                            * Card can only be cancelled after 1 year of active validity (Eligible on {oneYearFromCreation.toLocaleDateString()}).
                        </p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentID;