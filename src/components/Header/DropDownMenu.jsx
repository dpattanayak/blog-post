import React, { useEffect, useRef, useState } from "react";
import { FaMoon, FaSignOutAlt, FaSun, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../services";
import { logout } from "../../store/authSlice";
import { resetState } from "../../store/postSlice";
import { toggleTheme } from "../../store/themeSlice";
import { ProfilePic } from "../index";

function DropDownMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const profileState = useSelector((state) => state.auth.profile);
  const themeState = useSelector((state) => state.theme.selectedTheme);

  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
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
  }, [navigate]);

  useEffect(() => setIsOpen(false), [location, darkMode]);

  useEffect(() => {
    const HTML = document.querySelector("html").classList;
    HTML.remove("light", "dark");
    HTML.add(themeState || "light");
  }, [themeState, darkMode]);

  const handleLogout = () => {
    auth.logout().then(() => {
      navigate("/");
      dispatch(logout());
      dispatch(resetState());
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-text-light dark:text-text-dark font-semibold py-2 px-4 rounded inline-flex items-center"
      >
        <div className="flex items-center">
          <ProfilePic name={userData.name} profilePic={profileState?.href} />
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
        <div className="absolute right-0 mt-2 w-48 bg-bg-light dark:bg-bg-dark rounded-sm shadow-lg">
          <ul className="text-text-light dark:text-text-dark">
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="flex w-full px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark items-center"
              >
                <FaUser className="mr-2" />
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={toggleDarkMode}
                className="flex w-full px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark items-center"
              >
                {darkMode ? (
                  <FaMoon className="mr-2" />
                ) : (
                  <FaSun className="mr-2" />
                )}

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
                className="flex w-full px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark items-center"
              >
                <FaSignOutAlt className="mr-2" />
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
