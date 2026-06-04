import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/src/pages/dashboard";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2, CheckCircle2, Lock, User, Mail, Award, Calendar, MapPin, Phone, Shield, FileSignature, Upload, Sparkles, FileText } from "lucide-react";
import * as profileActions from "@/src/Actions/profileActions";
import { Textarea } from "@/src/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import { logOut, setAuth } from "@/src/state/authSlice";
import { useRouter } from "next/navigation";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const StudentProfile = () => {
  const { profile, user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncRegNum, setSyncRegNum] = useState("");
  const [studentId, setStudentId] = useState("");
  const [study_year, setStudyYear] = useState("1");
  const [program, setProgram] = useState("");
  const [studentBio, setStudentBio] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  // New ID Details
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [signature, setSignature] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [kinAddress, setKinAddress] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [phone, setPhone] = useState("");

  const [surname, setSurname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [othernames, setOthernames] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [contactAddress, setContactAddress] = useState("");

  const [updated, setUpdated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Institution Database Sync Handler
  const handleInstitutionSync = useCallback(async () => {
    if (!syncRegNum.trim()) {
      toast({
        title: "Registration Number Required",
        description: "Please enter your registration number to sync data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSyncing(true);
      toast({
        title: "Syncing",
        description: "Please be patient",
      });

      const res = await fetch("/api/profile/fetch-institution-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNumber: syncRegNum }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Failed to fetch details");
      }

      const data = await res.json();

      // SECURITY CHECK: Match the fetched name with the logged-in user's name
      if (data.fullName) {
        const fetchedFullName = data.fullName.toLowerCase();
        const userFullName = user?.fullName?.toLowerCase() || "";
        const fetchedWords = fetchedFullName.split(/\s+/);
        const userWords = userFullName.split(/\s+/);
        
        // Check if there is at least one overlapping word (longer than 2 chars)
        const hasMatch = fetchedWords.some((word: string) => word.length > 2 && userWords.includes(word));
        
        // Enforce account genuinity
        if (!hasMatch && userFullName) {
          setSyncRegNum(""); // Wipe input to force retry
          toast({
            title: "Security Validation Failed",
            description: "The name on this Registration Number does not match your registered account name. Please register with valid details.",
            variant: "destructive",
          });
          return; // Stop the sync process immediately
        }
        
        setFullName(data.fullName);
        setSurname(fetchedWords[0]?.toUpperCase() || "");
        setFirstname(fetchedWords[1]?.toUpperCase() || "");
        setOthernames(fetchedWords.slice(2).join(" ").toUpperCase());
      }

      // Apply extracted values to form if they exist
      if (data.regNumber) setStudentId(data.regNumber);
      if (data.faculty) setFaculty(data.faculty);
      if (data.department) {
        setDepartment(data.department);
        setProgram("B.Sc " + data.department);
      }
      if (data.gender) setSex(data.gender);
      if (data.dateOfBirth) setDob(data.dateOfBirth);
      if (data.stateOfOrigin) setStateOfOrigin(data.stateOfOrigin);
      if (data.nextOfKin) setNextOfKin(data.nextOfKin);
      if (data.nextOfKinGSM) setKinPhone(data.nextOfKinGSM);
      if (data.nextOfKinAddress) setKinAddress(data.nextOfKinAddress);
      if (data.phoneNumber) setPhone(data.phoneNumber);
      if (data.email && !email) setEmail(data.email);
      if (data.admissionYear) {
         const currentYear = new Date().getFullYear();
         // If admission is 2021, and current year is 2024 or 2025, they are in year 4 (assuming normal progression)
         let calculatedYear = (currentYear - data.admissionYear) || 1;
         if (calculatedYear > 4) calculatedYear = 4; // Max 400 level for CS
         setStudyYear(calculatedYear.toString());
      }

      toast({
        title: "Sync Successful",
        description: "Your details have been securely fetched from the central database.",
      });
      
      setCurrentStep(2); // Advance to Step 2

    } catch (err: unknown) {
      console.error("Institution Sync Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Could not fetch details. Please check your Registration Number.";
      toast({
        title: errorMessage === 'Not found please enter a valid registration number' ? undefined : "Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  }, [email, syncRegNum, toast, user?.fullName]);

  // Auto-sync when exactly 9 characters are entered
  useEffect(() => {
    if (syncRegNum.trim().length === 9 && !syncing && currentStep === 1) {
      handleInstitutionSync();
    }
  }, [syncRegNum, currentStep, syncing, handleInstitutionSync]);

  // Sync state if profile loads
  useEffect(() => {
    if (profile && profile.studentId) {
      setStudentId(profile.studentId || "");
      setStudyYear(profile.study_year?.toString() || "1");
      setProgram(profile.program || "");
      setStudentBio(profile.bio || "");
      setFullName(profile.full_name || "");
      if (profile.full_name) {
         const parts = profile.full_name.split(" ");
         setSurname(parts[0]?.toUpperCase() || "");
         setFirstname(parts[1]?.toUpperCase() || "");
         setOthernames(parts.slice(2).join(" ").toUpperCase());
      }
      setEmail(profile.email || "");
      setAvatar(profile.avatar || "");
      setSex(profile.sex || "");
      setDob(profile.dob || "");
      setStateOfOrigin(profile.stateOfOrigin || "");
      setSignature(profile.signature || "");
      setNextOfKin(profile.nextOfKin || "");
      setKinAddress(profile.kinAddress || "");
      setContactAddress(profile.kinAddress || ""); // Map to contact address for the UI
      setKinPhone(profile.kinPhone || "");
      setPhone(profile.phone || "");
      
      setCurrentStep(2); // Automatically show Step 2 if profile exists
    }
  }, [profile]);

  // Check if current ID has expired or is within 3 months of expiration (eligible for renewal)
  const isCardExpired = () => {
    if (!profile?.createdAt) return false;
    const baseDate = new Date(profile.createdAt);
    const expiryYear = baseDate.getFullYear() + 2;
    const expiryDate = new Date(expiryYear, 11, 31, 23, 59, 59);
    
    // We allow renewal starting 3 months before expiration (i.e. starting 1st October of the expiry year)
    const renewalEligibilityDate = new Date(expiryDate);
    renewalEligibilityDate.setMonth(renewalEligibilityDate.getMonth() - 3);
    
    return new Date() > renewalEligibilityDate;
  };

  const isProfileSaved = Boolean(profile?.studentId);
  const verificationStatus = profile?.verificationStatus || 'unapplied';
  const hasActiveOrPendingCard = verificationStatus === 'approved' || verificationStatus === 'pending';
  const isLocked = isProfileSaved && !isCardExpired();

  // Static fields are strictly document-extraction-only; manual typing is disabled at all times.
  // Once the profile is saved and not expired, they remain locked.
  const isStudentIdLocked = true; // Always read-only for manual input
  const isProgramLocked = true; // Always read-only for manual input
  const isFullNameLocked = true; // Always read-only for manual input
  const isSexLocked = true; // Always read-only for manual input
  const isStateOfOriginLocked = true; // Always read-only for manual input

  // Non-static verification/renewal fields are locked after save if not expired
  const isDobLocked = isLocked;
  const isAvatarLocked = isLocked;
  const isSignatureLocked = isLocked;

  const getExpiryDate = () => {
    const baseDate = profile?.createdAt ? new Date(profile.createdAt) : new Date();
    return `31st Dec ${baseDate.getFullYear() + 2}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setField: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({ title: "Error", description: "Image size should be less than 1MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setField(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = Boolean(
    studentId && program && sex && dob && stateOfOrigin && nextOfKin && kinPhone && contactAddress && phone && avatar
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSaving(true);
      const updatedProfile = await profileActions.updateProfile({
        user_id: user.id,
        studentId: studentId,
        study_year: parseInt(study_year),
        program: program,
        full_name: `${surname} ${firstname} ${othernames}`.trim() || user?.fullName || "",
        email: email || user?.email || "",
        bio: studentBio,
        avatar,
        sex,
        dob,
        stateOfOrigin,
        signature,
        nextOfKin,
        kinAddress: contactAddress,
        kinPhone,
        phone
      });
      dispatch(setAuth({ user, profile: updatedProfile, loading: false, token: localStorage.getItem("auth_token") }));
      setSaving(false);
      setUpdated(true);
      toast({ title: "Success", description: "Profile saved successfully!" });
    } catch (err: unknown) {
      setSaving(false);
      const errorMessage = err instanceof Error ? err.message : "Profile update failed";

      if (
        errorMessage.includes("Token expired") ||
        errorMessage.includes("Invalid token") ||
        errorMessage.includes("jwt expired") ||
        (err instanceof Error && err.name === "AuthError")
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        dispatch(logOut());
        router.push("/auth");
      }

      toast({ title: "Profile update error", description: errorMessage, variant: "destructive" });
      console.log(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout loading={loading} profile={profile} user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" />
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "S";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <div className="max-w-5xl mx-auto pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* Layout Grid */}
        <div className="grid gap-8 md:grid-cols-3 items-start">
          
          {/* Left Column: Student Card ID Preview Summary */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white border border-[#EAECF0]/80 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="flex flex-col items-center text-center">
                {/* Passport Photo Preview */}
                <div className="p-1 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#F59E0B] shadow-sm mb-4">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white select-none">
                    {avatar ? (
                      <img src={avatar} alt="Passport Photo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="bg-clip-text text-transparent bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-3xl font-extrabold font-sora">
                        {getInitials(full_name || user?.fullName)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 
                  className="text-lg font-bold text-[#111827] tracking-tight line-clamp-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {full_name || user?.fullName || "Student Name"}
                </h3>
                
                {/* Roll / Program */}
                <p className="text-[#6B7280] text-[13px] font-medium mt-0.5 line-clamp-1">
                  {program || "Program not set"}
                </p>

                {/* Verification Badge */}
                <div className="flex items-center gap-1.5 bg-[#E8F8F0] text-[#10B981] text-[10px] font-bold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ID Status: {studentId ? "Active" : "Pending"}</span>
                </div>
              </div>

              {/* Quick Details Divider */}
              <div className="border-t border-[#EAECF0]/60 my-5" />

              {/* Live Card Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[13.5px]">
                  <User className="w-[18px] h-[18px] text-[#9CA3AF] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Registration No</p>
                    <p className="text-[#374151] font-semibold truncate leading-none">{studentId || "Not assigned"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13.5px]">
                  <Calendar className="w-[18px] h-[18px] text-[#9CA3AF] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Sex / Date of Birth</p>
                    <p className="text-[#374151] font-semibold truncate leading-none">
                      {sex ? sex : "—"} / {dob ? new Date(dob).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13.5px]">
                  <MapPin className="w-[18px] h-[18px] text-[#9CA3AF] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">State of Origin</p>
                    <p className="text-[#374151] font-semibold truncate leading-none">{stateOfOrigin || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13.5px]">
                  <Mail className="w-[18px] h-[18px] text-[#9CA3AF] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Email Address</p>
                    <p className="text-[#374151] font-semibold truncate leading-none">{email || user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13.5px]">
                  <Award className="w-[18px] h-[18px] text-[#9CA3AF] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Card Expiry Date</p>
                    <p className="text-[#374151] font-semibold truncate leading-none">{getExpiryDate()}</p>
                  </div>
                </div>
              </div>

              {/* Signature Preview */}
              {signature && (
                <>
                  <div className="border-t border-[#EAECF0]/60 my-5" />
                  <div>
                    <p className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider mb-2">Holder's Signature</p>
                    <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-lg p-2 flex items-center justify-center h-14">
                      <img src={signature} alt="Signature" className="max-h-full object-contain" />
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-2">
            <Card className="bg-white border border-[#EAECF0]/80 rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
              
              {hasActiveOrPendingCard ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 h-full animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-2xl bg-[#0052FF]/5 flex items-center justify-center text-[#0052FF] shadow-sm mb-2">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#111827] font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Profile Locked
                  </h2>
                  <p className="text-[#6E7C87] text-[15px] leading-relaxed max-w-sm mx-auto">
                    You have an {verificationStatus === 'approved' ? 'active' : 'pending'} ID card application. Your profile details are locked and cannot be edited while your card is active.
                  </p>
                  <Link
                    href="/dashboard/id-card"
                    className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg px-8 py-3.5 shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all duration-200 w-full max-w-[280px]"
                  >
                    <span>View ID Card Status</span>
                  </Link>
                </div>
              ) : currentStep === 1 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-full max-w-[320px] relative">
                    <Input
                      placeholder="Registration Number"
                      value={syncRegNum}
                      onChange={(e) => setSyncRegNum(e.target.value.toUpperCase())}
                      disabled={syncing}
                      maxLength={9}
                      className="h-14 text-center text-xl tracking-[0.2em] font-bold border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] uppercase shadow-sm transition-all bg-[#F8FAFC] focus:bg-white"
                    />
                    {syncing && (
                      <div className="absolute right-4 top-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0052FF]" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                  
                  {/* ── Institution Sync Banner ── */}
                  {isLocked && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-emerald-950 font-sora mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                            ID Profile Verified & Active
                          </h4>
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            Your student identification details have been verified and are currently locked. If you need to make changes or correct errors, please request a change from the university administrator or wait for card renewal.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* ── Section 1: Photo & Signature Uploads ── */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Passport Photo */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest block" style={{ fontFamily: "'Sora', sans-serif" }}>1. Passport Photograph</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] flex items-center justify-center overflow-hidden flex-shrink-0">
                        {avatar ? (
                          <img src={avatar} alt="Passport preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-7 h-7 text-[#9CA3AF]" />
                        )}
                      </div>
                      
                      {!isAvatarLocked ? (
                        <div>
                          <Label htmlFor="passportUpload" className="flex items-center gap-2 border border-[#EAECF0] hover:bg-[#F8FAFC] rounded-lg px-4 h-10 text-sm font-medium text-[#374151] cursor-pointer shadow-sm transition-all">
                            <Upload className="w-4 h-4 text-[#9CA3AF]" />
                            <span>Upload Passport</span>
                          </Label>
                          <Input
                            id="passportUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setAvatar)}
                            className="hidden"
                          />
                          <p className="text-[10px] text-[#8E9CAE] mt-1">Square image, max 1MB</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#8E9CAE] font-medium bg-[#F3F4F6] px-3 py-1.5 rounded-lg border border-[#EAECF0]/80">
                          <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest block" style={{ fontFamily: "'Sora', sans-serif" }}>2. Holder's Signature</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-12 rounded-lg border border-[#EAECF0] bg-[#F8FAFC] flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                        {signature ? (
                          <img src={signature} alt="Signature preview" className="max-h-full object-contain" />
                        ) : (
                          <FileSignature className="w-6 h-6 text-[#9CA3AF]" />
                        )}
                      </div>
                      
                      {!isSignatureLocked ? (
                        <div>
                          <Label htmlFor="signatureUpload" className="flex items-center gap-2 border border-[#EAECF0] hover:bg-[#F8FAFC] rounded-lg px-4 h-10 text-sm font-medium text-[#374151] cursor-pointer shadow-sm transition-all">
                            <Upload className="w-4 h-4 text-[#9CA3AF]" />
                            <span>Upload Signature</span>
                          </Label>
                          <Input
                            id="signatureUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setSignature)}
                            className="hidden"
                          />
                          <p className="text-[10px] text-[#8E9CAE] mt-1">Horizontal image, max 1MB</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#8E9CAE] font-medium bg-[#F3F4F6] px-3 py-1.5 rounded-lg border border-[#EAECF0]/80">
                          <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Personal & Academic Settings (Redesigned Grid) ── */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest border-b border-[#EAECF0]/60 pb-2 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Profile Details</h4>
                  
                  {/* Row 1: Names */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Surname:</Label>
                      <Input value={surname} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Firstname:</Label>
                      <Input value={firstname} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Othernames:</Label>
                      <Input value={othernames} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                  </div>

                  {/* Row 2: Faculty / Department */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Faculty:</Label>
                      <Input value={faculty} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Department:</Label>
                      <Input value={department} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                  </div>

                  {/* Row 3: Programme */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#6B7280]">Programme:</Label>
                    <Input value={program} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                  </div>

                  {/* Dynamic Fields Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    
                    {/* State */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">State:</Label>
                      {Boolean(stateOfOrigin) && stateOfOrigin !== "Unknown" ? (
                        <Input 
                          value={stateOfOrigin} 
                          readOnly 
                          className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" 
                        />
                      ) : (
                        <Select value={stateOfOrigin === "Unknown" ? "" : stateOfOrigin} onValueChange={setStateOfOrigin}>
                          <SelectTrigger className="border-[#EAECF0] focus:ring-[#0052FF] bg-white">
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIAN_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Gender:</Label>
                      {Boolean(sex) && sex !== "Not Specified" && sex !== "M" && sex !== "F" && sex !== "" ? (
                        <Input 
                          value={sex} 
                          readOnly 
                          className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" 
                        />
                      ) : (
                        <Select value={sex === "Not Specified" ? "" : sex} onValueChange={setSex}>
                          <SelectTrigger className="border-[#EAECF0] focus:ring-[#0052FF] bg-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Email:</Label>
                      <Input value={email} readOnly className="bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" />
                    </div>

                    {/* GSM */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">GSM:</Label>
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="border-[#EAECF0] focus-visible:ring-[#0052FF] bg-white" 
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">DOB:</Label>
                      <Input 
                        type={dob ? "date" : "text"}
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        readOnly={dob !== ""}
                        placeholder={!dob ? "YYYY-MM-DD" : ""}
                        className={dob !== "" ? "bg-[#F3F4F6] border-none text-[#374151] font-medium focus-visible:ring-0 cursor-not-allowed" : "border-[#EAECF0] focus-visible:ring-[#0052FF] bg-white"} 
                      />
                    </div>

                    {/* Contact Address */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Contact Address:</Label>
                      <Input 
                        value={contactAddress} 
                        onChange={(e) => setContactAddress(e.target.value)} 
                        className="border-[#EAECF0] focus-visible:ring-[#0052FF] bg-white" 
                      />
                    </div>

                    {/* Next of Kin Name */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Next of Kin Name:</Label>
                      <Input 
                        value={nextOfKin} 
                        onChange={(e) => setNextOfKin(e.target.value)} 
                        className="border-[#EAECF0] focus-visible:ring-[#0052FF] bg-white" 
                      />
                    </div>

                    {/* Next of Kin GSM */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#6B7280]">Next of Kin GSM:</Label>
                      <Input 
                        value={kinPhone} 
                        onChange={(e) => setKinPhone(e.target.value)} 
                        className="border-[#EAECF0] focus-visible:ring-[#0052FF] bg-white" 
                      />
                    </div>

                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-[#EAECF0]/60 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saving || !isFormValid}
                    className="bg-[#0052FF] hover:bg-[#0040D0] text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-7 h-11 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{saving ? "Saving Details..." : (isFormValid ? "Save Profile Details" : "Fill all required fields")}</span>
                  </Button>
                </div>
              </form>
              )}
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
