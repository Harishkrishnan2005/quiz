import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import { fetchAdminAnalytics } from "../features/admin/adminSlice";

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin Analytics" title="Platform metrics" description="A compact top-line view of adoption, content volume, and AI-assisted authoring activity." />
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Users" value={analytics?.users || 0} hint="All registered accounts" />
        <StatCard label="Questions" value={analytics?.questions || 0} hint="Questions in the bank" />
        <StatCard label="AI Sets" value={analytics?.generatedSets || 0} hint="Generated and stored batches" />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
