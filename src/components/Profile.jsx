import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FileUploader, Input } from "../components";

function Profile({ profileData }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => profileData && reset(profileData), [profileData, reset]);

  const submit = async (data) => {};

  return (
    <div className="flex items-center justify-center py-8 h-[85vh]">
      <div
        className={`mx-auto w-full max-w-screen-sm bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark rounded-xl p-10 border border-black/10 transition duration-200`}
      >
        <h2 className="text-center text-2xl font-bold leading-tight">
          Profile Settings
        </h2>
        <form className="mt-8" onSubmit={handleSubmit(submit)}>
          <div className="w-full px-2">
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
                readOnly
                {...register("email")}
              />
              {errors.email && <Error {...errors.email} />}

              <FileUploader
                label="Profile Picture :"
                name="profilePic"
                control={control}
              />

              <Button
                type="submit"
                className={`w-full ${isLoading && "bg-blue-800"}`}
                disabled={isLoading}
              >
                Update
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
