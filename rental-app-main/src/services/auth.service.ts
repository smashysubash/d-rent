import axios from "axios";
import { isExpired, decodeToken } from "react-jwt";
import toast from "react-hot-toast";

export const authService = {
  logout: async () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const isMyTokenExpired = isExpired(jwt);
      return !isMyTokenExpired;
    } else {
      return false;
    }
  },
};