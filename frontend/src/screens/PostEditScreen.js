import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.js";
import FormContainer from "../components/FormContainer.js";
import Loader from "../components/Loader.js";
import { updatePost, listPostDetails } from "../actions/postActions";
import { POST_UPDATE_RESET } from "../constants/postConstans";

const PostEditScreen = () => {
  const { id } = useParams();
  const postId = id;

  const postDetails = useSelector((state) => state.postDetails);
  const { post } = postDetails;

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [image, setImage] = useState(post.image);
  const [category, setCategory] = useState(post.category);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  //   const userLogin = useSelector((state) => state.userLogin);
  //   const { userInfo } = userLogin;

  const history = useNavigate();

  const postUpdate = useSelector((state) => state.postUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = postUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: POST_UPDATE_RESET });
      history(`/post/${post._id}`);
    } else {
      if (!postId.title || post._id !== postId) {
        dispatch(listPostDetails(postId));
      } else {
        setTitle(post.title);
        setDescription(post.description);
        setImage(post.image);
        setCategory(post.category);
      }
    }
  }, [dispatch, history, postId, post, successUpdate]);
  //     dispatch({ type: POST_CREATE_RESET });

  //     if (!userInfo) {
  //       history("/login");
  //     }

  //     if (success) {
  //       history(`/post/${createdPost._id}`);
  //     }
  //   }, [dispatch, history, userInfo, success, createdPost]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      const correctData = data.replace(/\\/g, "/");

      setImage(correctData);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updatePost({
        _id: postId,
        title,
        description,
        image,
        category,
      })
    );
  };

  return (
    <>
      <Link to={`/post/${post._id}`} className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        <h1>Edit Post</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>

            {/* <Form.Label>Image</Form.Label> */}
            <Form.Control
              // id="image-file"
              label="Choose File"
              type="file"
              // custom="true"
              onChange={uploadFileHandler}
            ></Form.Control>

            {uploading && <Loader />}
          </Form.Group>

          <Form.Group controlId="title">
            <Form.Label className="my-3">Title</Form.Label>
            <Form.Control
              type="title"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label className="my-3">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              type="description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label className="my-3">Category</Form.Label>
            <Form.Control
              type="category"
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PostEditScreen;
