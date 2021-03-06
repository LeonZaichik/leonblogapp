import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

// @desc       Fetch all posts
// @route      GET /api/posts
// @access     Public
const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const selectedCategory = req.query.selectedCategory
    ? {
        category: {
          $regex: req.query.selectedCategory,
          $options: "i",
        },
      }
    : {};

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const categories = await Post.distinct("category");
  const count = await Post.countDocuments({ ...selectedCategory, ...keyword });
  const posts = await Post.find({ ...selectedCategory, ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ posts, page, pages: Math.ceil(count / pageSize), categories });
});

// @desc       Get logged in user posts
// @route      GET /api/posts/myposts
// @access     Private
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user._id });
  res.json(posts);
});

// @desc       Get logged in user favorite posts
// @route      GET /api/posts/favoriteposts
// @access     Private
const getMyFavoritePosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const favoritePosts = await User.distinct("favoritePosts.favoritePost", {
    _id: user._id,
  });
  const posts = await Post.find({ _id: { $in: favoritePosts } });
  res.json(posts);
});

// @desc       Fetch single posts
// @route      GET /api/posts/:id
// @access     Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc       Create a post
// @route      POST /api/posts
// @access     Private
const createPost = asyncHandler(async (req, res) => {
  const { title, description, image, category } = req.body;
  const user = req.user._id;
  const name = req.user.name;

  const post = new Post({ title, description, image, category, user, name });
  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc       Update a post
// @route      PUT /api/posts/:id
// @access     Private
const updatePost = asyncHandler(async (req, res) => {
  const { title, description, category, image } = req.body;

  const post = await Post.findById(req.params.id);
  const user = req.user._id;

  if (post.user.toString() === user.toString()) {
    post.title = title;
    post.description = description;
    post.image = image;
    post.category = category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc       Delete a post
// @route      DELETE /api/posts/:id
// @access     Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    await post.remove();
    res.json({ message: "Post deleted" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc       Create new review
// @route      POST /api/posts/:id/reviews
// @access     Private
const createPostReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    const alreadyReviewed = post.comments.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    post.comments.push(review);

    post.numComments = post.comments.length;

    post.rating =
      post.comments.reduce((acc, item) => item.rating + acc, 0) /
      post.comments.length;

    await post.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc       Add post to favorite posts
// @route      POST /api/posts/:id/favorites
// @access     Private
const addFavoritePost = asyncHandler(async (req, res) => {
  const favoritePost = await Post.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (favoritePost) {
    let result = false;

    const alreadyFavorited = user.favoritePosts.find(
      (f) => f.favoritePost.toString() === req.params.id.toString()
    );

    if (alreadyFavorited) {
      res.status(400);
      throw new Error("Post already favorited");
    }

    const data = {
      favoritePost: req.params.id,
    };

    user.favoritePosts.push(data);

    await user.save().then((result = true));
    res
      .status(201)
      .json({ message: "Post added to favorites", favorited: result });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc       Remove post from favorite posts
// @route      DELETE /api/posts/:id/favorites
// @access     Private
const removeFavoritePost = asyncHandler(async (req, res) => {
  const favoritePost = req.params.id;
  const user = await User.findById(req.user._id);

  if (favoritePost) {
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $pull: { favoritePosts: { favoritePost: favoritePost } } }
    );
    res.json({ message: "Post removed from favorites" });
  } else {
    res.status(404);
    throw new Error("Favorite post not found");
  }
});

export {
  getPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  createPostReview,
  addFavoritePost,
  removeFavoritePost,
  getMyFavoritePosts,
};
