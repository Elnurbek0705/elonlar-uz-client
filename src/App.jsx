import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser, loginSuccess, logout } from "./redux/userSlice";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/user/Home";
import Elonlarim from "./pages/user/Elonlarim";
import Settings from "./pages/user/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import CardDetails from "./pages/user/CardDetails";
import Saved from "./pages/user/Saved";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo"));
    const token = stored?.token ?? localStorage.getItem("token");
    const hasUser = !!stored?.user;

    if (token && !hasUser) {
      dispatch(fetchCurrentUser(token)).then((res) => {
        if (res.meta?.requestStatus === "fulfilled") {
          dispatch(loginSuccess({ token, user: res.payload }));
        } else {
          // If unauthorized, clear stored auth
          if (res.payload?.unauthorized) {
            dispatch(logout());
          }
        }
      });
    } else if (token && hasUser) {
      // Ensure redux has normalized payload
      dispatch(loginSuccess(stored));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#16a34a",
            color: "#fff",
            fontWeight: 500,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cards/:id" element={<CardDetails />} />
          <Route
            path="elonlarim"
            element={
              <ProtectedRoute>
                <Elonlarim />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<div className="p-10 text-center text-lg">Sahifa topilmadi</div>}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
