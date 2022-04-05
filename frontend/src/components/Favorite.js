import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  addToFavoritePosts,
  removeFromFavoritePosts,
} from "../actions/postActions";
import { getUserDetails } from "../actions/userActions";

const Favorite = ({ id, dispatch }) => {
  const [addToFavoriteBtn, setAddToFavoriteBtn] = useState("Add to favorites");
  const [addFontAwesome, setAddFontAwesome] = useState("fa-solid fa-plus");
  const [removeFromFavoriteBtn, setRemoveFromFavoriteBtn] = useState(
    "Remove from favorites"
  );
  const [removeFontAwesome, setRemoveFontAwesome] =
    useState("fa-solid fa-minus");

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    if (!user || !user.name) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, user, id]);

  const userFavoritePosts = user?.favoritePosts;
  const favoritedPost = userFavoritePosts?.find((f) => f.favoritePost === id);

  const favoriteAddClickHandler = (e) => {
    e.preventDefault();
    dispatch(addToFavoritePosts(id));
    setAddToFavoriteBtn("Remove from favorites");
    setAddFontAwesome("fa-solid fa-minus");
    window.location.reload();
  };

  const favoriteRemoveClickHandler = (e) => {
    e.preventDefault();
    dispatch(removeFromFavoritePosts(id));
    setRemoveFromFavoriteBtn("Add to favorites");
    setRemoveFontAwesome("fa-solid fa-plus");
    window.location.reload();
  };

  return (
    <>
      {favoritedPost ? (
        <Button
          variant="outline-info"
          size="sm"
          type="button"
          className="ms-3"
          onClick={favoriteRemoveClickHandler}
        >
          <i className={removeFontAwesome}> {removeFromFavoriteBtn}</i>
        </Button>
      ) : (
        <Button
          variant="outline-info"
          size="sm"
          type="button"
          className="ms-3"
          onClick={favoriteAddClickHandler}
        >
          <i className={addFontAwesome}> {addToFavoriteBtn}</i>
        </Button>
      )}
    </>
  );
};

export default Favorite;
