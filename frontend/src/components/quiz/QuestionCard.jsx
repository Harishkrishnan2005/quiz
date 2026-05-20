import { BookmarkPlus } from "lucide-react";

import { cn } from "../../utils/classNames";

const QuestionCard = ({ question, selectedAnswer, onSelect, onBookmark }) => (
  <article className="panel p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          {question.category} · {question.difficulty}
        </p>
        <h3 className="mt-3 text-lg font-semibold">{question.questionText}</h3>
      </div>
      <button type="button" className="btn-secondary px-3 py-2" onClick={() => onBookmark(question._id)}>
        <BookmarkPlus size={16} />
      </button>
    </div>

    <div className="mt-6 grid gap-3">
      {question.options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(question._id, option)}
          className={cn(
            "rounded-2xl border px-4 py-3 text-left text-sm transition",
            selectedAnswer === option
              ? "border-brand-500 bg-brand-50 text-brand-900"
              : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  </article>
);

export default QuestionCard;
