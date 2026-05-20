import { ArrowRight, BrainCircuit, ChartColumnBig, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Purpose-built quiz practice",
    description: "Train on technical and aptitude categories with scoring, attempt history, explanations, and retake-aware progress tracking.",
    icon: BrainCircuit
  },
  {
    title: "Actionable performance view",
    description: "See your category accuracy, recent results, weak areas, and leaderboard standing without losing clarity.",
    icon: ChartColumnBig
  },
  {
    title: "Admin-ready content workflow",
    description: "Manage users, seed tough MCQs, and convert study material into question banks through the admin experience.",
    icon: ShieldCheck
  }
];

const proofPoints = [
  {
    label: "Practice Tracks",
    value: "19",
    note: "Aptitude, core CS, and frontend/backend categories",
    icon: Target
  },
  {
    label: "What SkillForge Does",
    value: "Measure",
    note: "Turns quiz attempts into score, accuracy, and category-level progress",
    icon: Sparkles
  },
  {
    label: "Why It Exists",
    value: "Improve",
    note: "Helps learners prepare for interviews with focused repetition and visible growth",
    icon: Trophy
  }
];

const HomePage = () => (
  <div className="space-y-8 lg:space-y-10">
    <section className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
      <div className="panel relative overflow-hidden p-8 md:p-12">
        <div className="absolute -right-16 top-6 h-40 w-40 rounded-full bg-brand-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-28 w-44 rounded-full bg-slate-200/70 blur-3xl" />
        <div className="relative">
          <p className="font-accent text-xs font-semibold uppercase text-brand-700">Assessment Intelligence Platform</p>
          <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[1.02] text-ink md:text-6xl">
            Learn where you stand,
            <span className="block text-brand-700">then practice with purpose.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            SkillForge is a quiz application for interview preparation and structured skill growth. We create category-based
            assessments, score every attempt, surface weak areas, track progress over time, and help admins build serious MCQ
            banks for learners.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="btn-primary" to="/register">
              Start your preparation <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link className="btn-secondary" to="/login">
              Login to continue
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {proofPoints.map(({ label, value, note, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-brand-700">
                  <Icon size={18} />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
                </div>
                <p className="font-display mt-3 text-2xl font-semibold text-ink">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="panel p-8">
          <p className="font-accent text-xs font-semibold uppercase text-brand-700">What We Do</p>
          <h2 className="font-display mt-4 text-3xl leading-tight text-ink">A sharper loop for practice, review, and improvement.</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            <p>We deliver quizzes by category, store every attempt, calculate score and accuracy, and give learners a cleaner way to understand progress instead of guessing.</p>
            <p>We also support leaderboard visibility, result history, bookmarks, retakes, and admin-managed question workflows so the platform works for both learners and teams.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[2rem] bg-brand-700 p-7 text-white shadow-panel">
            <p className="font-accent text-xs uppercase text-white/75">Practice Design</p>
            <h3 className="font-display mt-3 text-3xl">Technical depth with aptitude discipline.</h3>
            <p className="mt-4 text-sm leading-6 text-white/80">From HTML, CSS, JavaScript, React, and Node.js to aptitude, DBMS, OS, and networks, the app is designed to support serious preparation.</p>
          </div>
          <div className="rounded-[2rem] border border-brand-200 bg-white/75 p-7 shadow-sm">
            <p className="font-accent text-xs uppercase text-brand-700">Outcome</p>
            <h3 className="font-display mt-3 text-3xl text-ink">Practice becomes measurable.</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">Instead of random question solving, SkillForge turns preparation into a repeatable workflow with progress signals that are easy to act on.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="grid gap-5 md:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <article key={title} className="panel p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <Icon size={22} />
          </div>
          <h3 className="font-display mt-5 text-2xl text-ink">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
        </article>
      ))}
    </section>
  </div>
);

export default HomePage;
