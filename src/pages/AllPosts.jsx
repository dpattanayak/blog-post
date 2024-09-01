import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, PostCard } from "../components";
import { database } from "../services";
import { allPosts } from "../store/postSlice";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const postState = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!postState.length)
      database.getPosts().then((posts) => {
        if (posts) {
          dispatch(allPosts(posts.documents));
          setPosts(posts.documents);
        }
      });
    else setPosts(postState);
  }, []);

  return (
    <Container>
      <div className="w-full py-8">
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default AllPosts;
