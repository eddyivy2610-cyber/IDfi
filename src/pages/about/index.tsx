import { EmptyState } from "@/src/components/EmptyState";

const EmptyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <EmptyState backHref="/" backText="Return Home" showBack />
    </div>
  );
};

export default EmptyPage;
