import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { Container, Loading, ProfilePic } from "../components";
import { database, storage } from "../services";
import { activeBGImage, removePost, updatePost } from "../store/postSlice";

export default function Post() {
  const ref = useRef(null);
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
          setAuthorInfo(activePost);
          setBGImage(activePost);
        } else {
          setAuthorInfo(activePost);
          setIsLoading(false);
          setBackgroundImage(bgImage.href);
        }
      }
    } else {
      database.getPost(slug).then((post) => {
        if (post) {
          setAuthorInfo(post);
          setBGImage(post);
        } else navigate("/");
      });
    }
  }, [slug, navigate]);

  useEffect(() => {
    highlightCodeBlocks();
    if (ref.current) {
      ref.current
        .querySelectorAll('pre[class*="language-"], code[class*="language-"]')
        .forEach((pre) => {
          if (pre.localName == "pre") pre.className = "codeBlock";
          else pre.className = "";
        });
    }
  }, [post]);

  const setAuthorInfo = (post) => {
    if (!post?.author) {
      database.getProfile(post.userid).then((data) => {
        const file = storage.getFilePreview(data.profilePic);
        const authorData = {
          name: data.name,
          profilePic: file.href,
        };
        setPost({ ...post, author: authorData });
        dispatch(
          updatePost({ $id: post.$id, body: { ...post, author: authorData } })
        );
      });
    } else setPost(post);
  };

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

  const highlightCodeBlocks = () => {
    Prism.highlightAll();
    document.querySelectorAll("pre").forEach((block) => {
      if (!block.querySelector(".copy-btn")) {
        const codeBlock = block.querySelector("code");
        const language = codeBlock.className.match(/language-([a-z]+)/i);
        if (language?.length) {
          const languageLabel =
            language[1].charAt(0).toUpperCase() + language[1].slice(1);
          const codeContent = codeBlock.innerText;

          // Create the outer wrapper div
          const wrapperDiv = document.createElement("div");
          wrapperDiv.className = "bg-bg-dark rounded-md";

          // Create the header div
          const headerDiv = document.createElement("div");
          headerDiv.className = "flex justify-between p-2";

          // Create the language label
          const languageSpan = document.createElement("span");
          languageSpan.className = "text-gray-500";
          languageSpan.textContent = languageLabel;

          // Create the copy button
          const copyButton = document.createElement("button");
          copyButton.textContent = "Copy";
          copyButton.className = "bg-gray-800 px-3 rounded-md";
          copyButton.onclick = () => {
            navigator.clipboard.writeText(codeContent).then(() => {
              copyButton.innerText = "Copied!";
              setTimeout(() => (copyButton.innerText = "Copy"), 2000);
            });
          };

          // Assemble the header
          headerDiv.appendChild(languageSpan);
          headerDiv.appendChild(copyButton);
          wrapperDiv.appendChild(headerDiv);

          // Create pre and new code elements
          const preElement = document.createElement("pre");
          const newCodeElement = document.createElement("code");
          newCodeElement.className = codeBlock.className; // Use the original class
          newCodeElement.textContent = codeContent;

          preElement.appendChild(newCodeElement);
          wrapperDiv.appendChild(preElement);

          // Insert the new structure into the DOM
          block.parentNode.insertBefore(wrapperDiv, block);
          block.remove();
        }
      }
    });

    // Re-initialize syntax highlighting
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  };

  if (isLoading) return <Loading />;
  else
    return (
      post && (
        <Container className="mx-auto max-w-screen-xl prose dark:prose-invert">
          <section className="overflow-auto">
            <div
              className="min-h-[200px] sm:min-h-[400px] h-full bg-cover bg-center border mb-8 bg-slate-400 border-[#f1f1f161] dark:border-[#2d2d2d88]"
              style={{
                backgroundImage: `url(${backgroundImage}), url('/broken.webp')`,
              }}
            ></div>
            <div className="flex items-center justify-between w-full px-[20px]">
              <div className="flex items-center space-x-2">
                <ProfilePic
                  name={post.author?.name}
                  profilePic={post?.author?.profilePic}
                  date={post?.$updatedAt}
                />
              </div>

              {isAuthor && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/edit-post/${post.$id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={25} />
                  </button>
                  <button
                    onClick={deletePost}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={25} />
                  </button>
                </div>
              )}
            </div>

            <div className="mx-4 my-8 dark:text-text-dark/60 text-text-light/60">
              <h1 className="font-light">{post.title}</h1>
            </div>

            <div
              ref={ref}
              className="p-6 dark:bg-bg-dark/60 bg-bg-light/60 rounded-md m-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </section>
        </Container>
      )
    );
}
