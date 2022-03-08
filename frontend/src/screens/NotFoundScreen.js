import React from "react";
import { Link } from "react-router-dom";

const NotFoundScreen = () => {
  return (
    <>
      <h2>Sorry</h2>
      <p>That page cannot be found</p>
      <Link to="/">Back to the homepage</Link>
    </>
  );
};

export default NotFoundScreen;
