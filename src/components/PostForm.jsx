import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container, Error, Input, RTE, Select } from "../components";
import { database, storage } from "../services";
import { addPost, updatePost } from "../store/postSlice";

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
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const submit = async (data) => {
    setIsLoading(true);
    const file = data.image[0] && (await storage.uploadFile(data.image[0]));
    if (post) {
      if (file && post?.featuredImage) {
        storage.deleteFile(post.featuredImage);
      }
      const updatedPost = await database.updatePost(post.$id, {
        ...data,
        userid: userData.$id,
        featuredImage: file ? file.$id : post.featuredImage,
      });
      if (updatedPost) {
        dispatch(updatePost({ $id: updatedPost.$id, body: updatedPost }));
        navigate(`/post/${updatedPost.$id}`);
      } else setIsLoading(false);
    } else {
      if (file) data.featuredImage = file.$id;
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
  };

  const getButtonText = () => {
    let text = post ? "Update" : "Submit";
    if (isLoading && text == "Update") return "Updating ...";
    else if (isLoading && text == "Submit") return "Submitting ...";
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <Container>
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2">
          <Input
            label="Title :"
            placeholder="Title"
            disabled={!!post}
            className={`${!!post ? "cursor-not-allowed bg-gray-300" : ""} mb-4`}
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
            className={`${!!post ? "cursor-not-allowed bg-gray-300" : ""} mb-4`}
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          <RTE
            label="Content :"
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
        <div className="w-1/3 px-2">
          <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
          />
          {post && (
            <div className="w-full mb-4">
              <img
                src={storage.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-lg"
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
            disabled={isLoading}
            bgColor={post ? "bg-green-600" : "bg-blue-600"}
            className={`${isLoading && "bg-opacity-60"} w-full`}
          >
            {getButtonText()}
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default PostForm;
