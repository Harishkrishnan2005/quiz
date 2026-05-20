import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { loginUser } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [navigate, user]);

  const onSubmit = (values) => dispatch(loginUser(values));

  return (
    <div className="mx-auto max-w-md panel p-8">
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to continue your assessments and analytics.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input className="field" placeholder="Email" {...register("email")} />
          <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <input className="field" type="password" placeholder="Password" {...register("password")} />
          <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
        </div>
        <button className="btn-primary w-full" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        No account yet? <Link className="font-semibold text-brand-700" to="/register">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
