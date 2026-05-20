import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="panel max-w-lg p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">404</p>
      <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">The route you asked for does not exist in this SkillForge workspace.</p>
      <Link className="btn-primary mt-6" to="/">Return home</Link>
    </div>
  </div>
);

export default NotFoundPage;
