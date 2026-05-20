import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import { fetchAdminAnalytics } from "../features/admin/adminSlice";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { analytics } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const cards = analytics
    ? [
        ["Users", analytics.users, "Registered learners in the system"],
        ["Questions", analytics.questions, "Current question bank volume"],
        ["Generated Sets", analytics.generatedSets, "AI creation batches saved by admins"]
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Operations dashboard"
        description="Manage your assessment inventory, user access, and AI-generated content from one secure control room."
        action={<Link className="btn-primary" to="/admin/ai-generator">Open AI generator</Link>}
      />
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(([label, value, hint]) => <StatCard key={label} label={label} value={value} hint={hint} />)}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Link className="panel p-5 hover:-translate-y-1 transition" to="/admin/users">Manage users</Link>
        <Link className="panel p-5 hover:-translate-y-1 transition" to="/admin/questions">Question bank</Link>
        <Link className="panel p-5 hover:-translate-y-1 transition" to="/admin/questions/new">Add question</Link>
        <Link className="panel p-5 hover:-translate-y-1 transition" to="/admin/analytics">Analytics detail</Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
