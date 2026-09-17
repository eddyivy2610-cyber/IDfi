import * as React from "react";
import { DashboardLayout } from "@/src/components/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import { toast } from "@/src/hooks/use-toast";
import {
  HelpCircle,
  Mail,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  FileText,
} from "lucide-react";

interface ComplaintItem {
  id: string;
  email: string;
  subject: string;
  category: string;
  text: string;
  status: "open" | "in_review" | "resolved";
  date: string;
}

const StudentComplaintsPage = () => {
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState("ID Card Issue");
  const [subject, setSubject] = React.useState("");
  const [complaintText, setComplaintText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const [myComplaints, setMyComplaints] = React.useState<ComplaintItem[]>([]);
  const [fetchingList, setFetchingList] = React.useState(false);

  // Prepopulate email once user or profile is loaded
  React.useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    } else if (profile?.email && !email) {
      setEmail(profile.email);
    }
  }, [user, profile]);

  // Fetch student's existing complaints
  const fetchComplaints = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;

    try {
      setFetchingList(true);
      const res = await fetch("/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMyComplaints(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setFetchingList(false);
    }
  };

  React.useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      return toast({
        title: "Missing Information",
        description: "Please enter the details of your complaint or inquiry.",
        variant: "destructive",
      });
    }

    if (!email.trim()) {
      return toast({
        title: "Email Required",
        description: "Please enter an email address so we can contact you.",
        variant: "destructive",
      });
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      return toast({
        title: "Authentication Error",
        description: "Please log in to submit a complaint.",
        variant: "destructive",
      });
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          category,
          subject: subject.trim() || `${category} - Inquiry`,
          text: complaintText.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log complaint");
      }

      toast({
        title: "Complaint Logged Successfully",
        description: "Your inquiry has been submitted. The admin team will review it shortly.",
        variant: "default",
      });

      // Clear input details
      setComplaintText("");
      setSubject("");
      // Refresh complaints list
      fetchComplaints();
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "An error occurred while logging your complaint.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <div className="max-w-5xl mx-auto space-y-8 pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAECF0] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0052FF]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Help & Student Support
              </h1>
            </div>
            <p className="text-sm text-[#64748B] mt-1.5 ml-12.5">
              Have an issue with your ID card, photo placement, profile details, or approval? Submit your inquiry below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Complaint Submission Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#EAECF0] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-[#0052FF]" />
              <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Log a Complaint / Inquiry
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact Email */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                  />
                </div>
                <p className="text-[12px] text-[#94A3B8] mt-1.5">
                  Updates and resolutions will be referenced with this email address.
                </p>
              </div>

              {/* Issue Category */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Issue Category
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all cursor-pointer"
                  >
                    <option value="ID Card Issue">ID Card Application / Generation Issue</option>
                    <option value="Passport Photo">Passport Photo / Image Placement</option>
                    <option value="Profile Correction">Profile & Academic Data Correction</option>
                    <option value="Verification Delay">Verification / Approval Status Delay</option>
                    <option value="Printing Problem">Printing & Download Problem</option>
                    <option value="Other">Other / General Support</option>
                  </select>
                </div>
              </div>

              {/* Optional Subject Line */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Subject / Summary <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Passport photograph crop appears distorted"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all"
                  />
                </div>
              </div>

              {/* Complaint Detail */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Complaint Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Please provide details about what happened, error messages seen, or what needs to be updated..."
                  className="w-full p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all resize-y min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-5 bg-[#0052FF] hover:bg-[#0045D8] text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.25)] flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Submitted Complaints & Quick Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Recent Submissions */}
            <div className="bg-white border border-[#EAECF0] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Your Submitted Inquiries
                </h3>
                <span className="text-xs bg-[#F1F5F9] text-[#475569] font-medium px-2 py-0.5 rounded-full">
                  {myComplaints.length}
                </span>
              </div>

              {fetchingList ? (
                <div className="py-8 flex flex-col items-center justify-center text-[#94A3B8] gap-2">
                  <div className="w-6 h-6 border-2 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
                  <p className="text-xs">Loading previous inquiries...</p>
                </div>
              ) : myComplaints.length === 0 ? (
                <div className="py-8 text-center bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-xl p-4">
                  <Clock className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                  <p className="text-xs font-medium text-[#64748B]">No inquiries logged yet.</p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    When you submit a support ticket, its review status will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {myComplaints.map((item) => {
                    const isResolved = item.status === "resolved";
                    const isInReview = item.status === "in_review";

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-[#EAECF0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] transition-all space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-[#0F172A] truncate">
                            {item.subject || item.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                              isResolved
                                ? "bg-[#E8F8F0] text-[#10B981]"
                                : isInReview
                                ? "bg-[#FFF4ED] text-[#EA580C]"
                                : "bg-[#EBF3FF] text-[#0052FF]"
                            }`}
                          >
                            {item.status || "open"}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-2">
                          {item.text}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]/60 text-[11px] text-[#94A3B8]">
                          <span>{item.category}</span>
                          <span>{item.date ? new Date(item.date).toLocaleDateString() : "Recently"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Support Information Card */}
            <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-2xl p-5 text-sm space-y-2.5">
              <div className="flex items-center gap-2 text-[#0052FF] font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Support Response Window</span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                ID card verification reviews and profile change requests are processed by the institution administration within <strong>24–48 working hours</strong>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentComplaintsPage;
