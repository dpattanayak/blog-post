import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  FallBackPage,
  Hero,
  Loading,
  PostCard,
} from "../components";
import { database, storage } from "../services";
import { allPosts, updatePost } from "../store/postSlice";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const postState = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!postState.length) {
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

  useEffect(() => {
    if (posts?.length && !authStatus) {
      posts.map((post) => setAuthorInfo(post));
    }
  }, [posts]);

  const setAuthorInfo = (post) => {
    if (!post?.author) {
      database.getProfile(post.userid).then((data) => {
        const file = storage.getFilePreview(data.profilePic);
        const authorData = {
          name: data.name,
          profilePic: file.href,
        };
        setPosts({ ...post, author: authorData });
        dispatch(
          updatePost({ $id: post.$id, body: { ...post, author: authorData } })
        );
      });
    } else setPosts(post);
  };

  if (isLoading) return <Loading />;

  return (
    <Container className="m-4 md:m-0 md:mx-auto max-w-screen-xl">
      <div className="w-full">
        {!authStatus && postState.length && <Hero />}
        {authStatus && postState.length ? (
          <div className="flex flex-wrap justify-center sm:justify-start m-4">
            {posts?.length &&
              posts.map((post) => (
                <div
                  key={post.$id}
                  className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <PostCard
                    {...post}
                    className={"bg-primary-light/20 dark:bg-primary-dark/20"}
                  />
                </div>
              ))}
          </div>
        ) : (
          authStatus &&
          !postState.length && (
            <FallBackPage
              title="Posts not found"
              subtitle="Please create some posts to list here .."
              redirect="add-post"
            />
          )
        )}
      </div>
    </Container>
  );
}

export default Home;
