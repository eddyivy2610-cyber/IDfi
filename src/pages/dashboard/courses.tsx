import { DashboardLayout } from "@/src/pages/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import { EmptyState } from "@/src/components/EmptyState";

const EmptyPage = () => {
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <EmptyState />
    </DashboardLayout>
  );
};

export default EmptyPage;
