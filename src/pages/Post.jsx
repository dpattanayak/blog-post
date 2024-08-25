import React from "react";
import { Post as PostComponent } from "../components";

function Post() {
  return (
    <div className="w-full bg-neutral-900 rounded-xl text-white p-10">
      <PostComponent />
    </div>
  );
}

export default Post;
