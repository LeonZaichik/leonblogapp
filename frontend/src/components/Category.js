import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

const Category = () => {
  const postList = useSelector((state) => state.postList);
  const { categories } = postList;

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Browse by Category
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <LinkContainer to={`/`}>
          <Dropdown.Item>Show All</Dropdown.Item>
        </LinkContainer>
        <Dropdown.Divider />
        {categories.map((c) => (
          <LinkContainer key={c} to={`/category/${c}`}>
            <Dropdown.Item>{c}</Dropdown.Item>
          </LinkContainer>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Category;
