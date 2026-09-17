import * as React from "react";
import { DashboardLayout } from "@/src/components/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import { toast } from "@/src/hooks/use-toast";
import {
  MessageSquare,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  User,
} from "lucide-react";

interface ComplaintItem {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  subject: string;
  category: string;
  text: string;
  status: "open" | "in_review" | "resolved";
  date: string;
}

const AdminComplaintsPage = () => {
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);

  const [complaints, setComplaints] = React.useState<ComplaintItem[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const fetchComplaints = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;

    try {
      setFetching(true);
      const res = await fetch("/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load admin complaints:", err);
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <div className="max-w-6xl mx-auto space-y-6 pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAECF0] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] flex items-center justify-center text-[#EA580C]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Student Complaints & Inquiries
              </h1>
            </div>
            <p className="text-sm text-[#64748B] mt-1.5 ml-12.5">
              Review and manage support requests submitted by students regarding ID cards, profile updates, and verification.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#EAECF0]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, email, or issue..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#334155] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints List / Table */}
        <div className="bg-white border border-[#EAECF0] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          {fetching ? (
            <div className="py-16 flex flex-col items-center justify-center text-[#94A3B8] gap-3">
              <div className="w-8 h-8 border-2 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
              <p className="text-sm">Loading complaints...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]/50 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#111827]">No Complaints Found</h3>
              <p className="text-xs text-[#64748B] mt-1">There are currently no complaints matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAECF0]">
              {filtered.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 hover:bg-[#F8FAFC] transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0052FF]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#111827]">{item.studentName}</span>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <a href={`mailto:${item.email}`} className="hover:text-[#0052FF] underline">
                            {item.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569]">
                        {item.category || "General"}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#EBF3FF] text-[#0052FF]">
                        {item.status || "open"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-xl p-3.5 text-xs text-[#334155] leading-relaxed">
                    <div className="font-semibold text-[#0F172A] mb-1">{item.subject}</div>
                    <p className="whitespace-pre-wrap">{item.text}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Submitted on {item.date ? new Date(item.date).toLocaleString() : "Recently"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminComplaintsPage;
