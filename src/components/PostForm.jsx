import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Error,
  FileUploader,
  Input,
  RTE,
  Select,
} from "../components";
import { database, storage } from "../services";
import { activeBGImage, addPost, updatePost } from "../store/postSlice";

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
      featuredImage: post?.featuredImage || "",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const bgImage = useSelector((state) => state.post.bgImage);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(post && bgImage?.href);
  const dispatch = useDispatch();

  const submit = async (data) => {
    try {
      setIsLoading(true);
      if (post) {
        const updatedPost = await database.updatePost(post.$id, {
          ...data,
          userid: userData.$id,
        });
        if (updatedPost) {
          dispatch(updatePost({ $id: updatedPost.$id, body: updatedPost }));
          navigate(`/post/${updatedPost.$id}`);
        } else setIsLoading(false);
      } else {
        const createdPost = await database.createPost({
          ...data,
          userid: userData.$id,
        });
        if (createdPost) {
          dispatch(addPost(createdPost));
          navigate(`/post/${createdPost.$id}`);
        } else if (file) {
          storage.deleteFile(file.$id);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    let text = post ? "Update" : "Submit";
    if (isLoading && text == "Update") return "Updating ...";
    else if (isLoading && text == "Submit") return "Submiting ...";
    else return text;
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim() // Remove leading and trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-zA-Z\d\s]+/g, "-") // Replace non-alphanumeric characters (except spaces) with hyphens
        .replace(/\s+/g, "-") // Replace multiple spaces with a single hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
    }

    return "";
  }, []);

  useEffect(() => {
    if (post && post.$id) setValue("slug", post.$id);

    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      } else if (name === "featuredImage") {
        if (value.featuredImage !== post?.featuredImage) {
          post && storage.deleteFile(post?.featuredImage);
          const bgImage = storage.getFilePreview(value.featuredImage);
          setCurrentImage(bgImage.href);
          if (post && bgImage.href) {
            dispatch(activeBGImage({ $id: post.$id, href: bgImage.href }));
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue, currentImage, storage]);

  return (
    <Container className="mx-auto max-w-screen-xl">
      <div
        className={`bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark rounded-xl p-10 border border-black/10 transition duration-200`}
      >
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-4 md:flex-row md:gap-6"
        >
          <div className="flex-1 px-2">
            <Input
              label="Title :"
              placeholder="Title"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 36,
                  message: "Title must be at most 36 characters long",
                },
                pattern: {
                  value: /^[a-zA-Z0-9][a-zA-Z0-9._-\s]*$/,
                  message:
                    "Title can only contain alphanumeric characters, periods, hyphens, and underscores, and cannot start with a special character.",
                },
              })}
            />
            {errors.title && <Error {...errors.title} />}

            <Input
              label="Slug :"
              placeholder="Slug"
              disabled={!!post}
              className={`${
                !!post ? "cursor-not-allowed bg-gray-300" : ""
              } mb-4`}
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />
            {errors.slug && <Error {...errors.slug} />}

            <RTE
              label="Content :"
              name="content"
              control={control}
              defaultValue={getValues("content")}
              rules={{ required: "Content is required" }}
            />
            {errors.content && <Error {...errors.content} />}
          </div>
          <div className="flex-1 px-2">
            <FileUploader
              label="Featured Image :"
              name="featuredImage"
              control={control}
              rules={{ required: !post && "Featured Image is required" }}
            />
            {errors.featuredImage && <Error {...errors.featuredImage} />}

            {currentImage && (
              <div className="w-full mb-4">
                <img
                  src={`${currentImage}`}
                  alt="Featured Image"
                  className="rounded-lg w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/broken.webp";
                    e.target.alt = "Featured Image Broken";
                  }}
                />
              </div>
            )}
            <Select
              options={["active", "inactive"]}
              label="Status :"
              className="mb-4"
              {...register("status", { required: true })}
            />
            <Button
              type="submit"
              bgColor="blue"
              disabled={isLoading}
              className="w-full"
            >
              {getButtonText()}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default PostForm;
