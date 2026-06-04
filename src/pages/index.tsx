import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Fingerprint, CreditCard, ShieldCheck, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navigation */}
      <nav className="border-b border-[#EAECF0] bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0052FF] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(0,82,255,0.2)]">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111827] tracking-tight font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>IDfi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-semibold text-[#6E7C87] hover:text-[#111827] transition-colors">
              Login
            </Link>
            <Link 
              href="/auth" 
              className="bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0052FF]/5 border border-[#0052FF]/10 text-[#0052FF] text-sm font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0052FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0052FF]"></span>
          </span>
          Digital Identity Management
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-[#111827] font-sora mb-6 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
          Smart, Secure<br className="hidden md:block" /> <span className="text-[#0052FF]">Simple</span>
        </h1>
        
        <p className="text-lg text-[#6E7C87] max-w-2xl mx-auto mb-10 leading-relaxed">
          Access your official digital student identification card instantly. Secure, scannable, and always available on your mobile device.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth" 
            className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-base font-semibold rounded-xl px-8 py-4 shadow-[0_6px_20px_rgba(0,82,255,0.2)] transition-all hover:-translate-y-0.5"
          >
            Create Your ID Card
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white border-t border-[#EAECF0] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] font-sora mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Everything you need</h2>
            <p className="text-[#6E7C87]">A complete system for modern university identification.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-2xl p-8 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1">
              <div className="w-14 h-14 bg-white border border-[#EAECF0] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <CreditCard className="w-7 h-7 text-[#0052FF]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] font-sora mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>Digital ID Cards</h3>
              <p className="text-[#6E7C87] leading-relaxed">
                Generate official, scannable student ID cards that update automatically and live directly on your dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-2xl p-8 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1">
              <div className="w-14 h-14 bg-white border border-[#EAECF0] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] font-sora mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>Secure Verification</h3>
              <p className="text-[#6E7C87] leading-relaxed">
                Cryptographically signed barcodes ensure that every digital card is authentic and impossible to forge.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] border border-[#EAECF0] rounded-2xl p-8 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1">
              <div className="w-14 h-14 bg-white border border-[#EAECF0] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Zap className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] font-sora mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>Instant Access</h3>
              <p className="text-[#6E7C87] leading-relaxed">
                No more waiting in lines for physical card printing. Get verified and access your campus identity instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
