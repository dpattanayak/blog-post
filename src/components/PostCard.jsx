import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../services";

function PostCard({ $id, title, featuredImage, className }) {
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
    <Link to={`/post/${$id}`}>
      <section
        className={`w-full rounded-lg overflow-auto shadow-lg min-w-[200px] ${className}`}
      >
        <div className="w-full justify-center mb-4">
          <div
            className="h-[180px] sm:h-[130px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage}), url('/broken.webp')`,
            }}
          ></div>
          <p className="font-medium text-sm px-2 mt-4 text-text-light dark:text-text-dark">
            {truncateString(title)}
          </p>
        </div>
      </section>
    </Link>
  );
}

export default PostCard;
