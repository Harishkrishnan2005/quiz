import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import QuestionCard from "../components/quiz/QuestionCard";
import {
  addBookmark,
  clearQuizSession,
  fetchAttemptStatus,
  fetchQuestions,
  retakeQuiz,
  submitQuiz
} from "../features/quiz/quizSlice";
import { notifyError } from "../utils/toast";

const QuizPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const isRetakeMode = searchParams.get("retake") === "true";
  const { questions, loading, currentAttempt, attemptStatus, retakeMeta } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const loadPage = async () => {
      dispatch(clearQuizSession());
      setAnswers({});
      setTimeLeft(600);

      if (isRetakeMode) {
        await dispatch(retakeQuiz(decodedCategory));
        return;
      }

      try {
        const status = await dispatch(fetchAttemptStatus(decodedCategory)).unwrap();
        if (!status.attempted) {
          dispatch(fetchQuestions(decodedCategory));
        }
      } catch {
        // Error toast is handled in the thunk.
      }
    };

    loadPage();
  }, [decodedCategory, dispatch, isRetakeMode]);

  useEffect(() => {
    if (!questions.length) {
      return undefined;
    }

    if (!timeLeft) {
      const payload = {
        category: decodedCategory,
        answers: questions.map((question) => ({ questionId: question._id, answer: answers[question._id] || "" }))
      };
      dispatch(submitQuiz(payload));
      return undefined;
    }

    const timer = setTimeout(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [answers, decodedCategory, dispatch, questions, timeLeft]);

  useEffect(() => {
    if (currentAttempt?._id && currentAttempt.category === decodedCategory) {
      navigate(`/results/${currentAttempt._id}`);
    }
  }, [currentAttempt, decodedCategory, navigate]);

  const formattedTime = useMemo(() => `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`, [timeLeft]);

  const handleSelect = (questionId, answer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!questions.length) {
      notifyError("No questions are available for this category");
      return;
    }

    dispatch(
      submitQuiz({
        category: decodedCategory,
        answers: questions.map((question) => ({ questionId: question._id, answer: answers[question._id] || "" }))
      })
    );
  };

  if (!loading && attemptStatus?.attempted && !isRetakeMode && !questions.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Quiz Library"
          title={decodedCategory}
          description="You already have an active result for this category. View it again or start a retake to replace its leaderboard impact."
        />
        <section className="panel max-w-2xl p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Previous Attempt Found</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500">Score</p>
              <p className="mt-2 text-2xl font-bold">
                {attemptStatus.latestResult.score}/{attemptStatus.latestResult.totalQuestions}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500">Accuracy</p>
              <p className="mt-2 text-2xl font-bold">{attemptStatus.latestResult.accuracy}%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500">Attempt Date</p>
              <p className="mt-2 font-semibold">{new Date(attemptStatus.latestResult.attemptDate).toLocaleDateString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500">Attempt Number</p>
              <p className="mt-2 font-semibold">#{attemptStatus.latestResult.attemptNumber}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-secondary" to={`/results/${attemptStatus.latestResult.attemptId}`}>View Result</Link>
            <Link className="btn-primary" to={`/quiz/${encodeURIComponent(decodedCategory)}?retake=true`}>Retake Quiz</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assessment Mode"
        title={decodedCategory}
        description={isRetakeMode ? "This retake will replace your active score for this category on the leaderboard after submission." : "Pick the best answer for each question. Your score and explanations will be available immediately after submission."}
        action={<div className="rounded-2xl bg-ink px-5 py-3 text-white">Time left: {formattedTime}</div>}
      />
      {retakeMeta?.attemptNumber ? (
        <div className="panel p-4 text-sm text-slate-600 dark:text-slate-300">
          Retake attempt #{retakeMeta.attemptNumber}. Previous active score: {retakeMeta.previousResult?.score}/{retakeMeta.previousResult?.totalQuestions} ({retakeMeta.previousResult?.accuracy}%).
        </div>
      ) : null}
      {loading ? <div className="panel p-6">Loading questions...</div> : (
        <div className="space-y-5">
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              selectedAnswer={answers[question._id]}
              onSelect={handleSelect}
              onBookmark={(questionId) => dispatch(addBookmark(questionId))}
            />
          ))}
          <button className="btn-primary" onClick={handleSubmit}>Submit quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
