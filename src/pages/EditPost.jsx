import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "../components";
import { database } from "../services";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (slug) {
      database.getPost(slug).then((post) => {
        if (post) setPost(post);
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  return (
    post && (
      <div className="p-10 min-h-[85vh] text-text-light dark:text-text-dark">
        <PostForm post={post} />
      </div>
    )
  );
}

export default EditPost;
