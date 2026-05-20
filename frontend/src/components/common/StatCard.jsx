const StatCard = ({ label, value, hint }) => (
  <article className="panel p-5">
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <h3 className="mt-3 text-3xl font-bold">{value}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
  </article>
);

export default StatCard;
