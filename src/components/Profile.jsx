import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, FileUploader, Input } from "../components";
import { database, storage } from "../services";
import { profile } from "../store/authSlice";

function Profile({ profileData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const profileState = useSelector((state) => state.auth.profile);

  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => profileData && reset(profileData), [profileData, reset]);

  useEffect(() => {
    if (!profileState && profileData.$id) {
      database.getProfile(profileData.$id).then((data) => {
        data?.profilePic && getProfilePic(data);
        dispatch(profile({ ...data, href: currentImage }));
      });
    } else if (profileState?.href !== currentImage) {
      setCurrentImage(profileState.href);
    }
  }, [profileData.$id]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "profilePic") {
        setIsFileChanged(true);
        getProfilePic(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getProfilePic = ({ profilePic }) => {
    const file = storage.getFilePreview(profilePic);
    setCurrentImage(file.href);
  };

  const submit = async (data) => {
    if (!data.profilePic) return;

    setIsLoading(true);
    let response = await database.upsertProfile(data);
    if (response) {
      profileState && storage.deleteFile(profileState?.profilePic);
      dispatch(profile({ ...response, href: currentImage }));
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <section className="flex items-center justify-center py-8">
      <div
        className={`m-4 w-full max-w-lg bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark rounded-xl p-6 md:p-10 border border-black/10 transition duration-200 z-10`}
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
                readOnly
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

              {!currentImage && (
                <FileUploader
                  label="Profile Picture :"
                  name="profilePic"
                  control={control}
                  aspect={1}
                  circularCrop={true}
                />
              )}

              {currentImage && (
                <div className="flex gap-8 justify-between items-center">
                  <div className="w-4/5 transition duration-300">
                    <FileUploader
                      label="Profile Picture :"
                      name="profilePic"
                      control={control}
                      aspect={1}
                      circularCrop={true}
                    />
                  </div>
                  <div className="w-1/5 p-2 transition duration-300">
                    <img
                      src={`${currentImage}`}
                      alt="Profile Picture"
                      className="rounded-full"
                      onError={(e) => {
                        e.target.src = "/broken.webp";
                        e.target.alt = "Profile Picture Broken";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-center items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
                <Button
                  type="button"
                  bgColor="gray"
                  disabled={isLoading}
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  bgColor="blue"
                  disabled={!isFileChanged || isLoading}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;
