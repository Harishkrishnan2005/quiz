import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import { fetchAttempt } from "../features/quiz/quizSlice";

const ResultsPage = () => {
  const dispatch = useDispatch();
  const { attemptId } = useParams();
  const { currentAttempt } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchAttempt(attemptId));
  }, [attemptId, dispatch]);

  if (currentAttempt && currentAttempt._id !== attemptId) {
    return <div className="panel p-6">Loading result...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Results" title="Quiz complete" description="Review your score, accuracy, and revisit every explanation for deeper retention." />
      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel p-6"><p className="text-sm text-slate-500">Category</p><h2 className="mt-3 text-2xl font-bold">{currentAttempt?.category}</h2></div>
        <div className="panel p-6"><p className="text-sm text-slate-500">Score</p><h2 className="mt-3 text-2xl font-bold">{currentAttempt?.score}/{currentAttempt?.questions?.length || 0}</h2></div>
        <div className="panel p-6"><p className="text-sm text-slate-500">Accuracy</p><h2 className="mt-3 text-2xl font-bold">{currentAttempt?.accuracy}%</h2></div>
      </div>
      <div className="flex gap-4">
        <Link className="btn-secondary" to={`/quiz/${encodeURIComponent(currentAttempt?.category || "")}?retake=true`}>Retake</Link>
        <Link className="btn-primary" to={`/review/${attemptId}`}>Review answers</Link>
        <Link className="btn-secondary" to="/categories">Back to categories</Link>
      </div>
    </div>
  );
};

export default ResultsPage;
