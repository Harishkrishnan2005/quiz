import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { loadProfile } from "./features/auth/authSlice";
import { useAuth } from "./hooks/useAuth";
import { router } from "./routes/router";

const App = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    if (token) dispatch(loadProfile());
  }, [dispatch, token]);

  return <RouterProvider router={router} />;
};

export default App;
