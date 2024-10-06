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
import { allPosts } from "../store/postSlice";

function Home() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);
  const postState = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();

  const fetchDocuments = async () => {
    if (postState?.length) {
      const lastDoc = postState[postState.length - 1];
      setCursor(lastDoc.$id);
    }

    setIsLoading(true);

    try {
      const response = await database.getPosts({
        limit: 25,
        cursorAfter: cursor,
      });

      const { documents } = response;

      if (documents?.length) {
        setPosts((prevPosts) => {
          const newPosts = documents.filter(
            (doc) => !prevPosts.some((post) => post.$id === doc.$id)
          );
          return [...prevPosts, ...newPosts];
        });

        const lastDoc = documents[documents.length - 1];
        setCursor(lastDoc.$id);
        setAuthorInfo(documents);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authStatus && !postState.length) {
      fetchDocuments();
    } else {
      if (!postState?.length) fetchDocuments();
      else setPosts(postState);
    }
  }, [authStatus]);

  useEffect(() => {
    if (!authStatus) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (!isLoading && hasMore) {
          fetchDocuments();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [authStatus, isLoading, hasMore]);

  const setAuthorInfo = async (posts) => {
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (!post?.author) {
          const data = await database.getProfile(post.userid);
          const file = storage.getFilePreview(data.profilePic);
          const authorData = {
            name: data.name,
            profilePic: file.href,
          };
          return { ...post, author: authorData };
        }
        return post;
      })
    );

    dispatch(allPosts(updatedPosts));
  };

  if (isLoading && !postState.length) return <Loading />;

  return (
    <Container className="md:mx-auto max-w-screen-xl">
      <div className="w-full">
        {!authStatus && <Hero />}
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
