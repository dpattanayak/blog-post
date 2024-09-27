import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components";
import { auth } from "../services";
import { logout } from "../store/authSlice";
import { resetState } from "../store/postSlice";

function AuthGuard({ children, authentication = true }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      auth.logout().then(() => {
        navigate("/login");
        dispatch(logout());
        dispatch(resetState());
      });
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setIsLoading(false);
  }, [authStatus, navigate, authentication]);

  return isLoading ? <Loading /> : <>{children}</>;
}

export default AuthGuard;
