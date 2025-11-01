import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role"); // get user role
  const token = localStorage.getItem("token"); // optional, check if logged in

  // If not logged in or not admin, redirect to home
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise render admin page
  return children;
};

export default AdminRoute;
