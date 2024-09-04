import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Loading } from "../components";
import { database, storage } from "../services";
import { activeBGImage, removePost } from "../store/postSlice";

export default function Post() {
  const [post, setPost] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const postState = useSelector((state) => state.post.posts);
  const bgImage = useSelector((state) => state.post.bgImage);
  const activePost = postState.filter((post) => post.$id === slug)[0];
  const isAuthor = post && userData ? post.userid === userData.$id : false;

  useEffect(() => {
    if (slug && postState.length) {
      if (activePost?.$id !== bgImage?.$id)
        database.getPost(slug).then((post) => {
          if (post) {
            setPost(post);
            const bgImage = storage.getFilePreview(post.featuredImage);
            if (bgImage.href) {
              setBackgroundImage(bgImage.href);
              dispatch(
                activeBGImage({ $id: activePost.$id, href: bgImage.href })
              );
            }
          } else navigate("/");
        });
      else if (activePost) {
        if (!bgImage.href) {
          const bgImage = storage.getFilePreview(activePost.featuredImage);
          if (bgImage.href) {
            setBackgroundImage(bgImage.href);
            dispatch(
              activeBGImage({ $id: activePost.$id, href: bgImage.href })
            );
          }
        } else {
          setPost(activePost);
          setBackgroundImage(bgImage.href);
        }
      }
      setIsLoading(false);
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

  if (isLoading) return <Loading />;
  else
    return (
      post && (
        <Container className="w-3/4 m-auto">
          <div className="w-full mb-6">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {isAuthor && (
              <div className="absolute right-6 top-24">
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
          <div className="py-8 overflow-auto">
            {/* <div className="w-full flex justify-center mb-4 relative rounded-xl p-2">
            <img
              src={storage.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-xl"
            />
          </div> */}
            <div
              className="min-h-[500px] h-full rounded-md bg-cover bg-center border mb-8 bg-slate-400 border-[#f1f1f1] dark:border-[#2d2d2d]"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            <div className="browser-css">{parse(post.content)}</div>
          </div>
        </Container>
      )
    );
}
