import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import LoadingCard from "../components/common/LoadingCard";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import { fetchDashboard } from "../features/user/userSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const stats = dashboard
    ? [
        ["Quizzes Attempted", dashboard.totalQuizzesAttempted, "Keep practicing to build consistency"],
        ["Average Score", dashboard.averageScore, "Based on active category results"],
        ["Best Score", dashboard.bestScore, "Your strongest active category performance"],
        ["Bookmarks", dashboard.bookmarkCount, "Questions saved for later review"]
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Your preparation cockpit"
        description="Track momentum, revisit weak topics, and jump straight into the next skill-building quiz."
        action={<Link className="btn-primary" to="/categories">Start a quiz</Link>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <LoadingCard key={index} />) : stats.map(([label, value, hint]) => <StatCard key={label} label={label} value={value} hint={hint} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Recent attempts</h2>
          <div className="mt-4 space-y-4">
            {dashboard?.recentAttempts?.length ? dashboard.recentAttempts.map((attempt) => (
              <div key={attempt._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{attempt.category}</h3>
                    <p className="text-sm text-slate-500">{new Date(attempt.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{attempt.score}</p>
                    <p className="text-sm text-slate-500">{attempt.accuracy}% accuracy</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No quiz attempts yet.</p>}
          </div>
        </section>
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Weak topics</h2>
          <div className="mt-4 space-y-4">
            {dashboard?.weakTopics?.length ? dashboard.weakTopics.map((item) => (
              <div key={item.topic}>
                <div className="flex items-center justify-between text-sm">
                  <span>{item.topic}</span>
                  <span>{item.accuracy}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${Math.max(item.accuracy, 5)}%` }} />
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">Weak topics will appear once you submit quizzes.</p>}
          </div>
        </section>
      </div>
      <section className="panel p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Category results</h2>
          <Link className="btn-secondary" to="/categories">Open library</Link>
        </div>
        <div className="mt-4 space-y-4">
          {dashboard?.categorySummaries?.length ? dashboard.categorySummaries.map((item) => (
            <div key={item.category} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{item.category}</h3>
                  <p className="text-sm text-slate-500">
                    Latest Score: {item.latestScore}/{item.totalQuestions} · Accuracy: {item.accuracy}%
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Attempts: {item.totalAttempts} · Last attempt: {new Date(item.lastAttemptDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link className="btn-secondary" to={`/results/${item.attemptId}`}>View Result</Link>
                  <Link className="btn-primary" to={`/quiz/${encodeURIComponent(item.category)}?retake=true`}>Retake</Link>
                </div>
              </div>
            </div>
          )) : <p className="text-sm text-slate-500">Your per-category results will appear here after you submit quizzes.</p>}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
