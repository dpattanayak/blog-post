import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FallBackPage, Loading, PostCard } from "../components";
import { database } from "../services";
import { allPosts } from "../store/postSlice";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const postState = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authStatus && !postState.length) {
      setIsLoading(true);
      database
        .getPosts()
        .then(({ documents }) => {
          if (documents) {
            dispatch(allPosts(documents));
            setPosts(documents);
            setIsLoading(false);
          }
        })
        .finally(setIsLoading(false));
    } else setPosts(postState);
  }, [dispatch, postState]);

  if (!authStatus) {
    return <FallBackPage />;
  } else if (isLoading) {
    return <Loading />;
  }

  return posts && posts.length ? (
    <div className="w-full py-8">
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div key={post.$id} className="p-2">
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
