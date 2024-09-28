import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { storage } from "../services";

function PostCard({ $id, title, featuredImage }) {
  const [backgroundImage, setBackgroundImage] = useState("");

  const truncateString = (str, maxLength = 25, suffix = "...") => {
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
        <div className="w-full bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg overflow-auto shadow-lg min-w-[200px]">
          <div className="w-full justify-center mb-4">
            <div
              className="h-[180px] sm:h-[130px] bg-cover bg-center border border-[#f1f1f1] dark:border-[#2d2d2d]"
              style={{
                backgroundImage: `url(${backgroundImage}), url('/broken.webp')`,
              }}
            ></div>
            <p className="font-medium text-sm px-2 mt-4 text-text-light dark:text-text-dark">
              {truncateString(title)}
            </p>
          </div>
        </div>
      </Link>
    </Container>
  );
}

export default PostCard;
