import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Post from "../components/Post";
import { listPosts } from "../actions/postActions.js";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useParams } from "react-router-dom";
import Meta from "../components/Meta";
import Category from "../components/Category";

const HomeScreen = () => {
  const { keyword } = useParams();
  const { pageNumber } = useParams();
  const { selectedCategory } = useParams();

  const dispatch = useDispatch();

  const postList = useSelector((state) => state.postList);
  const { loading, error, posts, page, pages } = postList;

  useEffect(() => {
    dispatch(listPosts(keyword, pageNumber || 1, selectedCategory));
  }, [dispatch, keyword, pageNumber, selectedCategory]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <></>
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <Category />
      <br />
      <h1>Latest Posts</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {posts.map((post) => (
              <Col key={post._id} sm={12} md={6} lg={4} xl={3}>
                <Post post={post} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
            selectedCategory={selectedCategory ? selectedCategory : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
