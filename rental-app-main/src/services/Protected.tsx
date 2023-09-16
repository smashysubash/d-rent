import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "./auth.service";
const Protected = ({ children }: { children: JSX.Element }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default Protected;