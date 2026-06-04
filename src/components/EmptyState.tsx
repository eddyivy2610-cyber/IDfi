import React from "react";
import { Hammer } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showBack?: boolean;
  backHref?: string;
  backText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Under Construction",
  description = "This page is currently being developed. Please check back later.",
  showBack = false,
  backHref = "/dashboard",
  backText = "Back to Dashboard",
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#0052FF]/5 flex items-center justify-center text-[#0052FF] shadow-sm mb-6">
        <Hammer className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-[#111827] font-sora mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
        {title}
      </h2>
      <p className="text-[#6E7C87] text-[15px] leading-relaxed max-w-md mx-auto mb-8">
        {description}
      </p>
      
      {showBack && (
        <Link
          href={backHref}
          className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg px-8 py-3.5 shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all duration-200"
        >
          <span>{backText}</span>
        </Link>
      )}
    </div>
  );
};
