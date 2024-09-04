import React from "react";
import { Post as PostComponent } from "../components";

function Post() {
  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-[#E8E6E3] p-10 min-h-[85vh]">
      <PostComponent />
    </div>
  );
}

export default Post;
