import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { CheckCircle, XCircle, Loader2, ShieldCheck, Search, Fingerprint, ArrowLeft } from "lucide-react";
import universityLogo from "../../public/images/universityLogo.png";

export default function VerifyCardPage() {
  const router = useRouter();
  const { token, id } = router.query;

  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [student, setStudent] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [manualQuery, setManualQuery] = useState("");

  const executeVerification = async (param: { token?: string; studentId?: string }) => {
    try {
      setStatus('loading');
      setErrorMsg("");

      const queryUrl = param.token
        ? `/api/verify?token=${encodeURIComponent(param.token)}`
        : `/api/verify?studentId=${encodeURIComponent(param.studentId || '')}`;

      const response = await fetch(queryUrl);
      const data = await response.json();

      if (data.valid) {
        setStudent(data.student);
        setStatus('valid');
      } else {
        setErrorMsg(data.error || "Verification failed");
        setStatus('invalid');
      }
    } catch (err) {
      setErrorMsg("Network error occurred during verification.");
      setStatus('invalid');
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    if (token && typeof token === "string") {
      executeVerification({ token });
    } else if (id && typeof id === "string") {
      executeVerification({ studentId: id });
    } else {
      setStatus('idle');
    }
  }, [router.isReady, token, id]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    executeVerification({ studentId: manualQuery.trim() });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Top Header */}
      <div className="mb-8 flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#EAECF0] mb-3 flex items-center justify-center">
          <Image src={universityLogo} alt="University Crest" width={56} height={56} className="object-contain" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
          Electronic ID Card Verification
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Official Identity & Credential Validation Portal
        </p>
      </div>

      {/* Main Verification Card */}
      <Card className="w-full max-w-md shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden border border-[#EAECF0] bg-white">
        
        {/* Loading State */}
        {status === 'loading' && (
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0052FF]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-[#0F172A]">Verifying Cryptographic Credential...</p>
            <p className="text-xs text-[#64748B]">Querying authoritative institutional records</p>
          </CardContent>
        )}

        {/* Invalid / Forged / Error State */}
        {status === 'invalid' && (
          <div>
            <div className="bg-[#FEF2F2] border-b border-[#FEE2E2] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] mb-3">
                <XCircle className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-[#991B1B] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Unverified Credential
              </h2>
              <p className="text-sm text-[#B91C1C] font-medium mt-1">{errorMsg}</p>
            </div>
            
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-xs text-[#64748B] leading-relaxed">
                This credential could not be verified against official university database records or has an invalid signature.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-2.5 px-4 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Try Another Search
              </button>
            </CardContent>
          </div>
        )}

        {/* Valid State */}
        {status === 'valid' && student && (
          <div>
            <div className="bg-[#E8F8F0] border-b border-[#D1FAE5] p-5 flex items-center justify-center gap-2.5 text-[#047857]">
              <CheckCircle className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>
                Valid Student Credential
              </h2>
            </div>
            
            <CardContent className="p-6 sm:p-7 space-y-6">
              <div className="flex flex-col items-center text-center">
                
                {/* Live Database Photo */}
                <div className="w-32 h-36 rounded-xl overflow-hidden border-2 border-[#10B981] shadow-md mb-3 bg-[#F1F5F9] relative">
                  {student.avatar ? (
                    <img src={student.avatar} alt="Live Student Photo" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] p-2 text-xs">
                      <Fingerprint className="w-8 h-8 mb-1 opacity-50" />
                      <span>No Photo on File</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#0F172A] mb-0.5" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {student.full_name}
                </h3>
                <span className="text-sm font-semibold text-[#0052FF] bg-[#EBF3FF] px-3 py-0.5 rounded-full mb-4">
                  {student.studentId}
                </span>

                {/* Information Grid */}
                <div className="w-full space-y-2.5 bg-[#F8FAFC] border border-[#EAECF0] p-4 rounded-xl text-left text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#EAECF0]">
                    <span className="text-[#64748B] font-medium">Program / Major</span>
                    <span className="text-[#0F172A] font-semibold">{student.program}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#EAECF0]">
                    <span className="text-[#64748B] font-medium">Academic Level</span>
                    <span className="text-[#0F172A] font-semibold">{student.level || "400 Level"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] font-medium">Verification Status</span>
                    <span className="font-bold text-[#10B981] uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Active & Approved</span>
                    </span>
                  </div>
                </div>

              </div>

              <button
                onClick={() => setStatus('idle')}
                className="w-full py-2.5 px-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#EAECF0] text-[#475569] rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Scan / Check Another ID
              </button>
            </CardContent>
          </div>
        )}

        {/* Idle State: Manual Lookup / Scanner Prompt */}
        {status === 'idle' && (
          <CardContent className="p-6 sm:p-7 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0052FF] mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0F172A]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Verify Student Credential
              </h2>
              <p className="text-xs text-[#64748B]">
                Scan the QR code on a student ID card or enter their Matriculation Number below.
              </p>
            </div>

            <form onSubmit={handleManualSearch} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Matriculation / Student ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    placeholder="e.g. U21CS1118"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0052FF] hover:bg-[#0045D8] text-white text-xs font-semibold rounded-xl shadow-[0_4px_12px_rgba(0,82,255,0.2)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credential</span>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-[#EAECF0]">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0052FF]">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>
            </div>
          </CardContent>
        )}

      </Card>
      
      {/* Bottom Security Footer */}
      <p className="mt-8 text-[11px] text-[#94A3B8] text-center max-w-sm leading-relaxed">
        Protected by Real-Time Cryptographic Verification.<br/>
        Any visual discrepancy between the on-screen photo and physical holder indicates a counterfeit.
      </p>

    </div>
  );
}
