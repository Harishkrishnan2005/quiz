import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import PageHeader from "../components/common/PageHeader";
import { categories } from "../constants/categories";
import { deleteQuestion, fetchAdminQuestions, importQuestions } from "../features/admin/adminSlice";

const ManageQuestionsPage = () => {
  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.admin);
  const [file, setFile] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [category, setCategory] = useState("JavaScript");
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

  const handleImport = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("topicTitle", topicTitle);
    formData.append("category", category);
    formData.append("difficulty", difficulty);
    dispatch(importQuestions(formData));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Question bank"
        description="Search, edit, prune, or import MCQ-rich PDF documents directly into your tenant question bank."
        action={<Link className="btn-primary" to="/admin/questions/new">Add question</Link>}
      />
      <section className="panel grid gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">Import MCQs from PDF</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            If your PDF already contains MCQs, upload it here, choose a title and category, and SkillForge will import all detected questions under that category.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Title or topic" value={topicTitle} onChange={(event) => setTopicTitle(event.target.value)} />
          <input className="field" type="file" accept=".pdf,.txt" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="field" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expected layout: numbered questions, `A-D` options, and an `Answer:` line for each question.
          </p>
          <button className="btn-primary" onClick={handleImport}>Import PDF MCQs</button>
        </div>
      </section>
      <div className="space-y-4">
        {questions.map((question) => (
          <article key={question._id} className="panel p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{question.category} · {question.difficulty}</p>
                {question.topicTitle ? <p className="mt-2 text-sm text-slate-500">Title: {question.topicTitle}</p> : null}
                <h2 className="mt-2 text-lg font-semibold">{question.questionText}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Correct answer: {question.correctAnswer}</p>
              </div>
              <div className="flex gap-3">
                <Link className="btn-secondary" to={`/admin/questions/${question._id}/edit`}>Edit</Link>
                <button className="btn-secondary" onClick={() => dispatch(deleteQuestion(question._id))}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ManageQuestionsPage;
