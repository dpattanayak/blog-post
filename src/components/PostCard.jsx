import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { storage } from "../services";

function PostCard({ $id, title, featuredImage }) {
  const [backgroundImage, setBackgroundImage] = useState("");

  const truncateString = (str, maxLength = 27, suffix = "...") => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  };

  useEffect(() => {
    const bgImage = storage.getFilePreview(featuredImage);
    bgImage && setBackgroundImage(bgImage.href);
  }, []);

  return (
    <Container>
      <Link to={`/post/${$id}`}>
        <div className="w-full bg-primary-light/20 dark:bg-primary-dark/20 rounded-xl p-4 shadow-lg min-w-[200px]">
          <div className="w-full justify-center mb-4">
            <div
              className="h-[130px] bg-cover bg-center border border-[#f1f1f1] dark:border-[#2d2d2d]"
              style={{
                backgroundImage: `url(${backgroundImage}), url('/broken.webp')`,
              }}
            ></div>
            <h2 className="font-bold mt-4 text-text-light dark:text-text-dark">
              {truncateString(title)}
            </h2>
          </div>
        </div>
      </Link>
    </Container>
  );
}

export default PostCard;
