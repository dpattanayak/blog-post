import React from "react";

function ProfilePic({ name = "Unknown Author", profilePic, date }) {
  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  const formatTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);

    if (isNaN(postDate.getTime())) {
      return "Invalid date";
    }

    const diffInMinutes = Math.floor((now - postDate) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <>
      <div
        className={`w-8 h-8 rounded-full ${
          profilePic && "border border-gray-400 dark:border-gray-600"
        } bg-cover bg-center flex items-center justify-center text-white font-bold`}
        style={{
          backgroundImage: profilePic ? `url(${profilePic})` : "none",
          backgroundColor: profilePic ? "transparent" : "gray",
        }}
      >
        {!profilePic && getInitials(name)}
      </div>
      {!date ? (
        <span className="ml-2">{name}</span>
      ) : (
        <div className="flex flex-col">
          <span className="font-bold text-base">{name}</span>
          <small className="text-gray-500 dark:text-gray-400">
            {formatTime(date)}
          </small>
        </div>
      )}
    </>
  );
}

export default ProfilePic;
