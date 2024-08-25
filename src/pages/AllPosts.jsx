import React, { useEffect, useState } from "react";
import { PostCard } from "../components";
import { database } from "../services";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    database.getPosts().then((posts) => posts && setPosts(posts.documents));
  }, []);

  return (
    <div className="w-full py-8">
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div className="p-2 w-1/4" key={post.$id}>
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;
