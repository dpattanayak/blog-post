import React from "react";
import { Post as PostComponent } from "../components";

function Post() {
  return (
    <div className="w-full bg-secondary-light dark:bg-secondary-dark text-text-light dark:text-text-dark p-10 min-h-[85vh]">
      <PostComponent />
    </div>
  );
}

export default Post;
