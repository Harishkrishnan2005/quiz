import { LayoutDashboard, Trophy, Bookmark, BrainCircuit, UserCircle2, Shield } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import Logo from "../components/common/Logo";
import { signOut } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/categories", label: "Quiz Categories", icon: BrainCircuit },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/profile", label: "Profile", icon: UserCircle2 }
  ];

  if (user?.role === "admin") {
    links.push({ to: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="panel h-fit p-5">
          <Logo />
          <div className="mt-8 space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-ink p-5 text-white">
            <p className="text-sm text-white/70">Signed in as</p>
            <h3 className="mt-1 text-lg font-semibold">{user?.fullName}</h3>
            <p className="text-sm text-white/70">{user?.email}</p>
            <div className="mt-4 flex gap-3">
              <Link className="btn-secondary bg-white/10 text-white hover:bg-white/20" to="/">
                Home
              </Link>
              <button className="btn-primary bg-white text-ink hover:bg-slate-100" onClick={() => dispatch(signOut())}>
                Logout
              </button>
            </div>
          </div>
        </aside>
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
