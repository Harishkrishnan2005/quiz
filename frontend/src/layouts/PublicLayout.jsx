import { Link, Outlet } from "react-router-dom";

import Logo from "../components/common/Logo";

const PublicLayout = () => (
  <div className="min-h-screen px-4 py-6 md:px-8">
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
      <Logo />
      <nav className="flex items-center gap-3">
        <Link className="btn-secondary" to="/login">
          Login
        </Link>
        <Link className="btn-primary" to="/register">
          Start practicing
        </Link>
      </nav>
    </header>
    <main className="mx-auto mt-10 w-full max-w-7xl">
      <Outlet />
    </main>
  </div>
);

export default PublicLayout;
