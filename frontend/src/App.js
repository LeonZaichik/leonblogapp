import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import PostScreen from "./screens/PostScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostCreateScreen from "./screens/PostCreateScreen";
import PostEditScreen from "./screens/PostEditScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/page/:pageNumber" element={<HomeScreen />} exact />
            <Route
              path="/search/:keyword/page/:pageNumber/"
              element={<HomeScreen />}
              exact
            />
            <Route
              path="/category/:selectedCategory/page/:pageNumber/"
              element={<HomeScreen />}
              exact
            />
            <Route path="/search/:keyword" element={<HomeScreen />} exact />
            <Route
              path="/category/:selectedCategory"
              element={<HomeScreen />}
              exact
            />
            <Route path="/post/:id" element={<PostScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/create" element={<PostCreateScreen />} />
            <Route path="/post/:id/edit" element={<PostEditScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
