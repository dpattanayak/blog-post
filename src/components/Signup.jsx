import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services";
import { login } from "../store/authSlice";
import { Button, Error, Input, Logo } from "./index";

function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createAccount = async (data) => {
    setIsLoading(true);
    const session = await auth.createAccount(data);
    if (session) {
      const userData = await auth.getCurrentUser();
      if (userData) dispatch(login(userData));
      navigate("/");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>

        <form onSubmit={handleSubmit(createAccount)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && <Error {...errors.name} />}

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
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
