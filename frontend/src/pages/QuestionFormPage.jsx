import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import PageHeader from "../components/common/PageHeader";
import { categories } from "../constants/categories";
import { fetchAdminQuestions, saveQuestion } from "../features/admin/adminSlice";

const schema = yup.object({
  questionText: yup.string().required(),
  topicTitle: yup.string(),
  optionA: yup.string().required(),
  optionB: yup.string().required(),
  optionC: yup.string().required(),
  optionD: yup.string().required(),
  correctAnswer: yup.string().required(),
  explanation: yup.string().required(),
  category: yup.string().required(),
  difficulty: yup.string().required()
});

const QuestionFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { questions } = useSelector((state) => state.admin);
  const selectedQuestion = useMemo(() => questions.find((question) => question._id === questionId), [questionId, questions]);

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      difficulty: "medium",
      category: "JavaScript"
    }
  });

  useEffect(() => {
    if (!questions.length) dispatch(fetchAdminQuestions());
  }, [dispatch, questions.length]);

  useEffect(() => {
    if (selectedQuestion) {
      reset({
        questionText: selectedQuestion.questionText,
        topicTitle: selectedQuestion.topicTitle || "",
        optionA: selectedQuestion.options[0],
        optionB: selectedQuestion.options[1],
        optionC: selectedQuestion.options[2],
        optionD: selectedQuestion.options[3],
        correctAnswer: selectedQuestion.correctAnswer,
        explanation: selectedQuestion.explanation,
        category: selectedQuestion.category,
        difficulty: selectedQuestion.difficulty
      });
    }
  }, [reset, selectedQuestion]);

  const onSubmit = async (values) => {
    await dispatch(
      saveQuestion({
        _id: questionId,
        questionText: values.questionText,
        topicTitle: values.topicTitle,
        options: [values.optionA, values.optionB, values.optionC, values.optionD],
        correctAnswer: values.correctAnswer,
        explanation: values.explanation,
        category: values.category,
        difficulty: values.difficulty
      })
    ).unwrap();
    navigate("/admin/questions");
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title={questionId ? "Edit question" : "Add question"} description="Build reusable, well-explained MCQs that fit your category structure and difficulty ladder." />
      <form className="panel grid gap-4 p-6" onSubmit={handleSubmit(onSubmit)}>
        <input className="field" placeholder="Title or topic (optional)" {...register("topicTitle")} />
        <input className="field" placeholder="Question text" {...register("questionText")} />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Option A" {...register("optionA")} />
          <input className="field" placeholder="Option B" {...register("optionB")} />
          <input className="field" placeholder="Option C" {...register("optionC")} />
          <input className="field" placeholder="Option D" {...register("optionD")} />
        </div>
        <input className="field" placeholder="Correct answer" {...register("correctAnswer")} />
        <textarea className="field min-h-32" placeholder="Explanation" {...register("explanation")} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="field" {...register("category")}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select className="field" {...register("difficulty")}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button className="btn-primary w-fit" type="submit">Save question</button>
      </form>
    </div>
  );
};

export default QuestionFormPage;
