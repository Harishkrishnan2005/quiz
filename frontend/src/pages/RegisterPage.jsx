import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";

const schema = yup.object({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must include letters and numbers")
    .required(),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required()
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [navigate, user]);

  return (
    <div className="mx-auto max-w-lg panel p-8">
      <h1 className="text-3xl font-bold">Create your SkillForge account</h1>
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit((values) => dispatch(registerUser(values)))}>
        <div>
          <input className="field" placeholder="Full name" {...register("fullName")} />
          <p className="mt-1 text-xs text-red-500">{errors.fullName?.message}</p>
        </div>
        <div>
          <input className="field" placeholder="Email" {...register("email")} />
          <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <input className="field" type="password" placeholder="Password" {...register("password")} />
          <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
        </div>
        <div>
          <input className="field" type="password" placeholder="Confirm password" {...register("confirmPassword")} />
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword?.message}</p>
        </div>
        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        Already registered? <Link className="font-semibold text-brand-700" to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
