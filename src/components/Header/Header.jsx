import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { DropDownMenu, Logo } from "../index";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
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
          <Link to="/" className="flex items-center">
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
            } lg:flex`}
          >
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
                      } hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none`
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
