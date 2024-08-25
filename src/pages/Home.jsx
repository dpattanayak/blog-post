import React, { useEffect, useState } from "react";
import { FallBackPage, PostCard } from "../components";
import { database } from "../services";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    database.getPosts().then((posts) => posts && setPosts(posts.documents));
  }, []);

  return posts && posts.length ? (
    <div className="w-full py-8">
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="w-full py-8">
      <FallBackPage
        title="Posts not found"
        subtitle="Please create some posts to list here .."
        redirect="add-post"
      />
    </div>
  );
}

export default Home;
