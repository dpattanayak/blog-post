import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { toggleTheme } from "../../store/themeSlice";
import { DropDownMenu, Logo } from "../index";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const themeState = useSelector((state) => state.theme.selectedTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    dispatch(toggleTheme(!darkMode));
  };

  useEffect(() => {
    const HTML = document.querySelector("html").classList;
    HTML.remove("light", "dark");
    HTML.add(themeState || "light");
  }, [darkMode]);

  const navItems = [
    {
      name: "Get Started",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Home",
      slug: "/",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-bg-light dark:bg-bg-dark border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl sm:min-w-[365px]">
          <Link to="/" className="flex items-center py-2.5">
            <Logo width="20" height="20" />
            <span className="text-sm font-bold dark:text-text-dark">
              Blog Post
            </span>
          </Link>
          {/* Hamburger Button for Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-text-light dark:text-text-dark"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <div
            className={`flex items-center ${
              isMenuOpen ? "block" : "hidden"
            } lg:flex gap-2`}
          >
            {/* <button
              onClick={toggleDarkMode}
              className="flex w-full px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark items-center"
            >
              {darkMode ? (
                <FaMoon className="mr-2" onClick={toggleDarkMode} />
              ) : (
                <FaSun className="mr-2" onClick={toggleDarkMode} />
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
            </button> */}

            {!authStatus && (
              <button onClick={toggleDarkMode} className="h-10">
                {darkMode ? (
                  <FaMoon className="mr-2" />
                ) : (
                  <FaSun className="mr-2" />
                )}
              </button>
            )}

            {navItems.map(
              (item) =>
                item.active && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "text-orange-600 bg-secondary-light dark:bg-secondary-dark"
                          : "text-text-light dark:text-text-dark"
                      } ${
                        !authStatus &&
                        "bg-secondary-light dark:bg-secondary-dark"
                      } hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none`
                    }
                  >
                    {item.name}
                  </NavLink>
                )
            )}
            {authStatus && userData && <DropDownMenu />}
          </div>
        </div>
      </nav>
    </header>
  );
}
