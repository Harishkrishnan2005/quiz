import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import PerformanceChart from "../components/charts/PerformanceChart";
import WeakTopicsChart from "../components/charts/WeakTopicsChart";
import PageHeader from "../components/common/PageHeader";
import { fetchPerformance } from "../features/user/userSlice";

const PerformancePage = () => {
  const dispatch = useDispatch();
  const { performance } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPerformance());
  }, [dispatch]);

  const trendData = useMemo(
    () =>
      (performance?.recentAttempts || []).map((attempt, index) => ({
        label: `Attempt ${index + 1}`,
        score: attempt.score
      })),
    [performance]
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analytics" title="Performance insights" description="Understand your trend line, uncover weak areas, and decide what to practice next." />
      <div className="grid gap-6 xl:grid-cols-2">
        <PerformanceChart data={trendData} />
        <WeakTopicsChart data={performance?.weakTopics || []} />
      </div>
    </div>
  );
};

export default PerformancePage;
