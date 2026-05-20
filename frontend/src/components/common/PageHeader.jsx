const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
    {action}
  </div>
);

export default PageHeader;
