import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
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
      if (activePost) {
        if (activePost?.$id !== bgImage?.$id) {
          setPost(activePost);
          setBGImage(activePost);
        } else {
          setPost(activePost);
          setIsLoading(false);
          setBackgroundImage(bgImage.href);
        }
      }
    } else {
      database.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          setBGImage(post);
        } else navigate("/");
      });
    }
  }, [slug, navigate]);

  const setBGImage = ({ $id, featuredImage }) => {
    const bgImage = storage.getFilePreview(featuredImage);
    if (bgImage.href) {
      setIsLoading(false);
      setBackgroundImage(bgImage.href);
      dispatch(activeBGImage({ $id, href: bgImage.href }));
    }
  };

  const deletePost = () => {
    database.deletePost(post.$id).then((status) => {
      if (status) {
        dispatch(removePost(post.$id));
        storage.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  const getAuthorName = (author) => {
    return author
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  if (isLoading) return <Loading />;
  else
    return (
      post && (
        <Container className="mx-auto max-w-screen-xl prose dark:prose-invert">
          <div className="w-full mb-6">
            <h1 className="font-bold">{post.title}</h1>
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
            <div
              className="min-h-[130px] sm:min-h-[200px] md:min-h-[500px] h-full rounded-md bg-cover bg-center border mb-8 bg-slate-400 border-[#f1f1f1] dark:border-[#2d2d2d]"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            <div className="browser-css">{parse(post.content)}</div>

            <div className="flex justify-between items-center border-t border-t-gray-500 dark:border-t-gray-50 pt-4 mt-4 text-text-light/60 dark:text-text-dark/60">
              {/* Author Info */}
              <div className="flex items-center space-x-2">
                {post?.profilePic ? (
                  <img
                    src={post.profilePic}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                    <span className="font-bold">
                      {getAuthorName(post?.author || "Unknown Author")}
                    </span>
                  </div>
                )}
                <span>{post?.author || "Unknown Author"}</span>
              </div>

              {/* Post Updated Info */}
              <div className="flex items-center space-x-2">
                <FaClock />
                <span>{new Date(post.$updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Container>
      )
    );
}
