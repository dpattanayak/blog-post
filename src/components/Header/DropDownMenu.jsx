import {
  faMoon,
  faSignOutAlt,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services";
import { logout } from "../../store/authSlice";
import { resetState } from "../../store/postSlice";
import { toggleTheme } from "../../store/themeSlice";

function DropDownMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const themeState = useSelector((state) => state.theme.selectedTheme);

  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    dispatch(toggleTheme(!darkMode));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const HTML = document.querySelector("html").classList;
    HTML.remove("light", "dark");
    HTML.add(themeState || "light");
  }, [themeState, darkMode]);

  const handleLogout = () => {
    auth.logout().then(() => {
      dispatch(logout());
      dispatch(resetState());
      navigate("/");
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-white dark:bg-[#252525] text-gray-800 dark:text-[#E8E6E3] font-semibold py-2 px-4 rounded inline-flex items-center"
      >
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full ${
              userData.profilePic &&
              "border border-gray-400 dark:border-gray-600"
            } bg-cover bg-center flex items-center justify-center text-white font-bold`}
            style={{
              backgroundImage: userData.profilePic
                ? `url(${userData.profilePic})`
                : "none",
              backgroundColor: userData.profilePic ? "transparent" : "gray",
            }}
          >
            {!userData.profilePic &&
              userData.name
                .split(" ")
                .map((word) => word[0])
                .join("")}
          </div>
          <span className="ml-2">{userData.name}</span>
          <svg
            className="fill-current h-4 w-4 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L10 11.5858L13.2929 8.29289C13.6834 7.90237 14.3166 7.90237 14.7071 8.29289C15.0976 8.68342 15.0976 9.31658 14.7071 9.70711L10.7071 13.7071C10.3166 14.0976 9.68342 14.0976 9.29289 13.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#252525] rounded-sm shadow-lg">
          <ul className="text-gray-700 dark:text-[#E8E6E3]">
            <li>
              <button className="flex w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-950 items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={toggleDarkMode}
                className="flex w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-950 items-center"
              >
                <FontAwesomeIcon
                  icon={darkMode ? faMoon : faSun}
                  className="mr-2"
                />
                <span className="duration-200 ease-in">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <div
                  className={`relative inline-block w-8 h-4 ml-2 align-middle select-none transition duration-200 ease-in rounded-full ${
                    darkMode ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute block w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform transition-transform duration-200 ease-in ${
                      darkMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></span>
                </div>
              </button>
            </li>

            <li className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-slate-950 items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
