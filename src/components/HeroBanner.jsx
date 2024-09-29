import React from "react";
import { useNavigate } from "react-router-dom";
import { PostCard, ProfilePic } from "../components";
import { storage } from "../services";

function HeroBanner({ type, className = "", posts }) {
  const top_picks = posts?.slice(posts.length - 5, posts.length) || [];
  const trending = posts?.slice(0, 3) || [];

  const navigate = useNavigate();
  const bannerType = {
    TOP_PICKS: "Top Picks",
    TRENDING: "Trending",
  };

  const truncateString = (str, maxLength = 50, suffix = "...") => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  };

  return (
    <div
      className={`mb-4 p-4 rounded-md shadow-lg bg-bg-light/60 dark:bg-bg-dark/60 ${className}`}
    >
      <h1 className="text-2xl m-2 md:mx-0 md:my-4">{type}</h1>
      <hr className="border-gray-500 my-4 border-t-1" />
      {type == bannerType.TOP_PICKS && (
        <>
          {top_picks.map((post) => (
            <div
              className="flex justify-between mb-4 gap-8 rounded-md bg-secondary-light dark:bg-secondary-dark p-2 shadow-md hover:shadow-lg hover:cursor-pointer relative"
              key={post.$id}
              onClick={() => navigate(`/post/${post.$id}`)}
            >
              <p className="text-lg font-light hover:underline hover:cursor-pointer">
                {truncateString(post.title)}
              </p>

              <ProfilePic
                name={post.author?.name}
                profilePic={post?.author?.profilePic}
                date={post?.$updatedAt}
                isBanner={true}
              />

              <img
                src={storage.getFilePreview(post.featuredImage)}
                alt={post.$id}
                className="w-32 rounded-md"
                onError={(e) => {
                  e.target.src = "/broken.webp";
                  e.target.alt = "Featured Image Broken";
                }}
              />
            </div>
          ))}
        </>
      )}

      {type == bannerType.TRENDING && (
        <div className="rounded-md overflow-auto">
          {trending.map((post) => (
            <div key={post.$id} className="p-2 w-full">
              <PostCard
                {...post}
                className={"bg-secondary-light dark:bg-secondary-dark"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroBanner;
