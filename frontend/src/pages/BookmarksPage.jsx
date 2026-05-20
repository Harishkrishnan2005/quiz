import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { fetchBookmarks, removeBookmark } from "../features/quiz/quizSlice";

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const { bookmarks } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Bookmarks" title="Saved questions" description="Keep tricky prompts close and revisit them when you want a focused revision round." />
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{bookmark.questionId?.category}</p>
                <h3 className="mt-2 text-lg font-semibold">{bookmark.questionId?.questionText}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{bookmark.questionId?.explanation}</p>
              </div>
              <button className="btn-secondary" onClick={() => dispatch(removeBookmark(bookmark.questionId?._id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage;
