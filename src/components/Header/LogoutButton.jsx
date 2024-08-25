import React from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../services";
import { logout } from "../../store/authSlice";

function LogoutButton() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    auth.logout().then(() => dispatch(logout()));
  };

  return (
    <button
      onClick={() => logoutHandler()}
      className="inline-block text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
