import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Loading, PostForm } from "../components";
import { database } from "../services";

function EditPost() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { slug } = useParams();
  const postState = useSelector((state) => state.post.posts);
  const activePost = postState.filter((post) => post.$id === slug)[0];

  const navigate = useNavigate();
  useEffect(() => {
    if (slug && !activePost) {
      setIsLoading(true);
      database.getPost(slug).then((post) => {
        if (post) setPost(post);
        setIsLoading(false);
      });
    } else {
      setPost(activePost);
    }
  }, [slug, navigate]);

  if (isLoading) return <Loading />;

  return (
    post && (
      <div className="p-10 min-h-[85vh] text-text-light dark:text-text-dark">
        <PostForm post={post} />
      </div>
    )
  );
}

export default EditPost;
