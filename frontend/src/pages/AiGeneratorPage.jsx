import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../components/common/PageHeader";
import { fetchGeneratedSets, generateMcq, saveGeneratedSet } from "../features/admin/adminSlice";

const AiGeneratorPage = () => {
  const dispatch = useDispatch();
  const { generatedQuestions } = useSelector((state) => state.admin);
  const [sourceText, setSourceText] = useState("");
  const [category, setCategory] = useState("Technical");
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchGeneratedSets());
  }, [dispatch]);

  const handleGenerate = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      dispatch(generateMcq({ payload: formData, isFile: true }));
      return;
    }

    dispatch(generateMcq({ payload: { sourceText, category }, isFile: false }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Generator"
        title="Create MCQs from content"
        description="Upload source material or paste text, let the backend parse it, then review and save the generated questions."
      />
      <div className="panel grid gap-4 p-6">
        <textarea
          className="field min-h-40"
          placeholder="Paste up to 1000 words here"
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto]">
          <input className="field" type="file" accept=".txt,.pdf,.docx" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <input className="field" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
          <button className="btn-primary" onClick={handleGenerate}>Generate</button>
        </div>
      </div>
      <div className="space-y-4">
        {generatedQuestions.map((set) => (
          <article key={set._id} className="panel p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Generated set</h2>
                <p className="mt-2 text-sm text-slate-500">{new Date(set.createdAt).toLocaleString()}</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{set.sourceText.slice(0, 200)}...</p>
                <div className="mt-4 space-y-3">
                  {set.generatedQuestions.map((question, index) => (
                    <div key={`${set._id}-${index}`} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="font-medium">{question.questionText}</p>
                      <p className="mt-2 text-sm text-slate-500">Answer: {question.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-primary" onClick={() => dispatch(saveGeneratedSet(set._id))}>Save to bank</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AiGeneratorPage;
