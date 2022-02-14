import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Post = ({ post }) => {
  const date = new Date(post.createdAt);

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/post/${post._id}`}>
        <Card.Img src={post.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/post/${post._id}`} className="text-decoration-none">
          <Card.Title as="div">
            <strong>{post.title}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating value={post.rating} text={`${post.numComments} reviews`} />
          <span className="fs-6">Author: {post.name}</span><br/>
          <span className="fs-6">Published: {date.toDateString()}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Post;
