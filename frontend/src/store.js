import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  postDetailsReducer,
  postListReducer,
  postCreateReducer,
  postUpdateReducer,
  postDeleteReducer,
  postReviewCreateReducer,
  postMyListReducer,
  addToFavoritePostsReducer,
  removeFromFavoritePostsReducer,
  postMyFavoritesReducer,
} from "./reducers/postReducers.js";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from "./reducers/userReducers.js";

const reducer = combineReducers({
  postList: postListReducer,
  postMyList: postMyListReducer,
  postMyFavorites: postMyFavoritesReducer,
  postDetails: postDetailsReducer,
  postCreate: postCreateReducer,
  postUpdate: postUpdateReducer,
  postDelete: postDeleteReducer,
  postReviewCreate: postReviewCreateReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  addToFavorite: addToFavoritePostsReducer,
  removeFromFavorite: removeFromFavoritePostsReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
