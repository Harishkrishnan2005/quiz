import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { categories } from "../constants/categories";
import { fetchDashboard } from "../features/user/userSlice";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const summaryMap = new Map((dashboard?.categorySummaries || []).map((item) => [item.category, item]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quiz Library"
        title="Choose your next assessment"
        description="Switch between aptitude and technical tracks. Each category launches a focused randomized quiz."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const summary = summaryMap.get(category);

          return (
            <article key={category} className="panel p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Category</p>
              <h2 className="mt-3 text-xl font-semibold">{category}</h2>
              {!summary ? (
                <>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Randomized questions, scoring, explanations, and retry support.</p>
                  <Link className="btn-primary mt-5 inline-flex" to={`/quiz/${encodeURIComponent(category)}`}>Start Quiz</Link>
                </>
              ) : (
                <>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Previous Result</p>
                  <div className="mt-4 grid gap-3 text-sm">
                    <p>Score: <strong>{summary.latestScore}/{summary.totalQuestions}</strong></p>
                    <p>Accuracy: <strong>{summary.accuracy}%</strong></p>
                    <p>Attempt Date: <strong>{new Date(summary.lastAttemptDate).toLocaleDateString()}</strong></p>
                    <p>Total Attempts: <strong>{summary.totalAttempts}</strong></p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link className="btn-secondary" to={`/results/${summary.attemptId}`}>View Result</Link>
                    <Link className="btn-primary" to={`/quiz/${encodeURIComponent(category)}?retake=true`}>Retake Quiz</Link>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
