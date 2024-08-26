import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components";
import { storage } from "../services";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Container>
      <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4">
          <div className="w-full justify-center mb-4">
            <img
              src={storage.getFilePreview(featuredImage)}
              alt={title}
              className="rounded-xl"
            />
            <h2 className="text-xl font-bold mt-2">{title}</h2>
          </div>
        </div>
      </Link>
    </Container>
  );
}

export default PostCard;
