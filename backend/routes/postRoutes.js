import express from "express";
const router = express.Router();
import {
  getPosts,
  getPostById,
  updatePost,
  createPost,
  deletePost,
  createPostReview,
  getMyPosts,
  addFavoritePost,
  removeFavoritePost,
  getMyFavoritePosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(getPosts).post(protect, createPost);
router.route("/myposts").get(protect, getMyPosts);
router.route("/favoriteposts").get(protect, getMyFavoritePosts);
router.route("/:id/reviews").post(protect, createPostReview);
router
  .route("/:id/favorites")
  .post(protect, addFavoritePost)
  .delete(protect, removeFavoritePost);
router
  .route("/:id")
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
