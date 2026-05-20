import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { fetchHistory } from "../features/user/userSlice";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="History" title="Quiz timeline" description="Every attempt is stored here so you can compare categories, scores, and consistency over time." />
      <div className="space-y-4">
        {history.map((attempt) => (
          <article key={attempt._id} className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{attempt.category}</h2>
                <p className="text-sm text-slate-500">{new Date(attempt.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-6 text-sm">
                <span>Attempt: <strong>#{attempt.attemptNumber || 1}</strong></span>
                <span>Score: <strong>{attempt.score}</strong></span>
                <span>Accuracy: <strong>{attempt.accuracy}%</strong></span>
                <span>Questions: <strong>{attempt.questions?.length || 0}</strong></span>
                <span>Status: <strong>{attempt.isActive ? "Active" : "Inactive"}</strong></span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
