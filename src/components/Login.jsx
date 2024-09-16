import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth, database, storage } from "../services";
import { profile, login as storeLogin } from "../store/authSlice";
import { Button, Error, Input, Logo } from "./index";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // handling form submit through login() bcz handleSubmit is resorved by useForm()
  const login = async (data) => {
    setIsLoading(true);
    const session = await auth.login(data);
    if (session || session?.type == "user_session_already_exists") {
      const userData = await auth.getCurrentUser();
      if (userData) {
        database.getProfile(userData.$id).then((data) => {
          if (data?.profilePic) {
            const file = storage.getFilePreview(data.profilePic);
            dispatch(profile({ ...data, href: file.href }));
          }
        });
        dispatch(storeLogin(userData));
      }
      navigate("/");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[85vh]">
      <div
        className={`mx-auto w-full max-w-lg bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60 dark:text-white/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be a valid address",
                },
              })}
            />
            {errors.email && <Error {...errors.email} />}

            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^.{8,256}$/,
                  message: "Password must be between 8 and 256 characters long",
                },
              })}
            />
            {errors.password && <Error {...errors.password} />}

            <Button
              type="submit"
              className={`w-full ${isLoading && "bg-blue-800"}`}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
