import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { DropDownMenu, Logo } from "../index";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
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
      name: "All Posts",
      slug: "/all-posts",
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
      <nav className="bg-white dark:bg-[#252525] border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <Logo width="20" height="20" />
            <span className="text-sm font-bold dark:text-[#E8E6E3]">
              Blog Post
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <NavLink
                    key={item.name}
                    to={item.slug}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "text-orange-600 bg-gray-100 dark:bg-gray-800"
                          : "text-gray-800 dark:text-[#E8E6E3]"
                      } hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none`
                    }
                  >
                    {item.name}
                  </NavLink>
                )
            )}
            {authStatus && <DropDownMenu />}
          </div>
        </div>
      </nav>
    </header>
  );
}
