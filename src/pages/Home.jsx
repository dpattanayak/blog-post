import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  FallBackPage,
  Hero,
  Loading,
  PostCard,
} from "../components";
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
    return <Hero />;
  } else if (isLoading) {
    return <Loading />;
  }

  return (
    <Container className="mx-auto max-w-screen-xl">
      <div className="w-full">
        {posts && posts.length > 0 ? (
          <div className="flex flex-wrap justify-center sm:justify-start m-4">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <FallBackPage
            title="Posts not found"
            subtitle="Please create some posts to list here .."
            redirect="add-post"
          />
        )}
      </div>
    </Container>
  );
}

export default Home;
