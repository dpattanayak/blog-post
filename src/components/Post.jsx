import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import { database, storage } from "../services";
import { removePost } from "../store/postSlice";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const postState = useSelector((state) => state.post.posts);
  const activePost = postState.filter((post) => post.$id === slug)[0];
  const isAuthor = post && userData ? post.userid === userData.$id : false;

  useEffect(() => {
    if (slug) {
      if (!activePost)
        database.getPost(slug).then((post) => {
          if (post) setPost(post);
          else navigate("/");
        });
      else setPost(activePost);
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    database.deletePost(post.$id).then((status) => {
      if (status) {
        dispatch(removePost(post.$id));
        storage.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return (
    post && (
      <Container>
        <div className="py-8 overflow-auto">
          <div className="w-full flex justify-center mb-4 relative rounded-xl p-2">
            <img
              src={storage.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-xl"
            />

            {isAuthor && (
              <div className="absolute right-6 top-6">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500" className="mr-3">
                    Edit
                  </Button>
                </Link>
                <Button bgColor="bg-red-500" onClick={deletePost}>
                  Delete
                </Button>
              </div>
            )}
          </div>
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>
          <div className="browser-css">{parse(post.content)}</div>
        </div>
      </Container>
    )
  );
}
