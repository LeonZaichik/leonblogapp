import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  listPostDetails,
  createPostReview,
} from "../actions/postActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { POST_CREATE_REVIEW_RESET } from "../constants/postConstans";
import Meta from "../components/Meta";

const PostScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const history = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDetails = useSelector((state) => state.postDetails);
  const { loading, error, post } = postDetails;

  const postReviewCreate = useSelector((state) => state.postReviewCreate);
  const { success: successPostReview, error: errorPostReview } =
    postReviewCreate;

  const postDelete = useSelector((state) => state.postDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = postDelete;

  const { id } = useParams();

  useEffect(() => {
    if (successPostReview) {
      alert("Review Submitted");
      setRating(0);
      setComment("");
      dispatch({ type: POST_CREATE_REVIEW_RESET });
    }
    dispatch(listPostDetails(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePost(id));
      history("/");
      window.location.reload();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createPostReview(id, { rating, comment }));
    window.location.reload();
    alert("Review Submitted");
  };

  const date = new Date(post.createdAt);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
        <Meta title={post.title} />
          <Row>
            <span className="fs-6">Author: {post.name}</span>
            <span className="fs-6">Published: {date.toDateString()}</span>
            <Col md={6}>
              <Image src={post.image} alt={post.title} fluid />
              <br />
              <br />

              {post.user === userInfo?._id && (
                <LinkContainer to={`/post/${post._id}/edit`}>
                  <Button className="btn btn-warning" type="button">
                    Edit
                  </Button>
                </LinkContainer>
              )}

              {post.user === userInfo?._id && (
                <Button
                  className="btn btn-danger ms-3 btn-sm"
                  type="button"
                  onClick={() => deleteHandler(post._id)}
                >
                  Delete
                </Button>
              )}
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{post.title}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={post.rating}
                    text={`${post.numComments} reviews`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>{post.description}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h4>Reviews</h4>
              {post.comments.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {post.comments.map((comments) => (
                  <ListGroup.Item key={comments._id}>
                    <strong>{comments.name}</strong>
                    <Rating value={comments.rating} />
                    <p>{comments.createdAt.substring(0, 10)}</p>
                    <p>{comments.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h4>Write a Review</h4>
                  {errorPostReview && (
                    <Message variant="danger">{errorPostReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Exellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default PostScreen;
