import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import { fetchAttempt } from "../features/quiz/quizSlice";

const ReviewPage = () => {
  const dispatch = useDispatch();
  const { attemptId } = useParams();
  const { currentAttempt } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchAttempt(attemptId));
  }, [attemptId, dispatch]);

  if (currentAttempt && currentAttempt._id !== attemptId) {
    return <div className="panel p-6">Loading review...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Review" title="Answer breakdown" description="Use this review mode to understand why each answer was correct and reinforce learning." />
      <div className="space-y-4">
        {currentAttempt?.questions?.map((question) => {
          const selected = currentAttempt.selectedAnswers?.find((item) => item.questionId === question._id || item.questionId?._id === question._id);
          const isCorrect = selected?.answer === question.correctAnswer;
          return (
            <article key={question._id} className="panel p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{question.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{question.questionText}</h3>
              <p className="mt-4 text-sm"><span className="font-semibold">Your answer:</span> {selected?.answer || "Not answered"}</p>
              <p className={`mt-2 text-sm font-semibold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>Correct answer: {question.correctAnswer}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{question.explanation}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewPage;
