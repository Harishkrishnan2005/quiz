import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { fetchLeaderboard } from "../features/quiz/quizSlice";

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { leaderboard } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Leaderboard" title="Top performers" description="See who is building the strongest consistency across score, attempt volume, and accuracy." />
      <div className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Average Accuracy</th>
              <th className="px-5 py-4">Categories</th>
              <th className="px-5 py-4">Total Attempts</th>
              <th className="px-5 py-4">Best Category</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={`${entry.username}-${entry.rank}`} className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-5 py-4">{entry.rank}</td>
                <td className="px-5 py-4 font-medium">{entry.username}</td>
                <td className="px-5 py-4">{entry.averageAccuracy}%</td>
                <td className="px-5 py-4">{entry.totalCategoriesAttempted}</td>
                <td className="px-5 py-4">{entry.totalAttempts}</td>
                <td className="px-5 py-4">{entry.bestCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
