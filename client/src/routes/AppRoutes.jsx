import { Routes, Route } from "react-router-dom";

import ProtectedRoutes from "./ProtectedRoutes";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Search from "../pages/Search";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import EditProfile from "../pages/EditProfile";
import Me from "../pages/Me";
import SavedPosts from "../pages/SavedPosts";
import PostDetails from "../pages/PostDetails";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoutes>
            <MainLayout />
          </ProtectedRoutes>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/me" element={<Me />} />
        <Route path="/saved" element={<SavedPosts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
