import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import PageHeader from "../components/common/PageHeader";
import { saveProfile } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";

const schema = yup.object({
  fullName: yup.string().required(),
  profileImage: yup.string().url("Enter a valid URL").nullable().transform((value) => value || "")
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      profileImage: user?.profileImage || ""
    });
  }, [reset, user]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Profile" title="Account settings" description="Keep your identity and avatar current for leaderboards and admin activity." />
      <div className="panel max-w-2xl p-6">
        <form className="grid gap-4" onSubmit={handleSubmit((values) => dispatch(saveProfile(values)))}>
          <div>
            <label className="mb-2 block text-sm font-medium">Full name</label>
            <input className="field" {...register("fullName")} />
            <p className="mt-1 text-xs text-red-500">{errors.fullName?.message}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Profile image URL</label>
            <input className="field" {...register("profileImage")} />
            <p className="mt-1 text-xs text-red-500">{errors.profileImage?.message}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <button className="btn-primary w-fit" type="submit">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
