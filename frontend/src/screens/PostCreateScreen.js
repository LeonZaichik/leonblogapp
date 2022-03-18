import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Figure } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message.js";
import FormContainer from "../components/FormContainer.js";
import Loader from "../components/Loader.js";
import { createPost } from "../actions/postActions";
import { POST_CREATE_RESET } from "../constants/postConstans";

const PostCreateScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);

  const dispatch = useDispatch();

  const postCreate = useSelector((state) => state.postCreate);
  const { loading, error, success, createdPost } = postCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const history = useNavigate();

  useEffect(() => {
    dispatch({ type: POST_CREATE_RESET });

    if (!userInfo) {
      history("/login");
    }

    if (success) {
      history(`/post/${createdPost._id}`);
    }
  }, [dispatch, history, userInfo, success, createdPost]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    if (file) {
      setImagePreview(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageData(reader.result);
      });
      reader.readAsDataURL(file);
    }

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
    dispatch(createPost(title, description, image, category));
  };

  return (
    <FormContainer>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <h1>Create Post</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>

          <Form.Control
            label="Choose File"
            type="file"
            onChange={uploadFileHandler}
          ></Form.Control>
          <br />
          <Figure.Image width={400} src={imageData} alt="" />

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
          Create
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PostCreateScreen;
