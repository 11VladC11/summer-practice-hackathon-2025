import React from "react";
import Container from "@mui/material/Container";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import TagPage from "./pages/tagPage";
import { fetchAuthMe } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuth = useSelector((state) => Boolean(state.auth.data));
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  // Redirect unauthenticated users away from all pages except login/register
  if (!isAuth && !isAuthPage) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-profile" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tags/:tagName" element={<TagPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
