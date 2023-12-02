import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/index";
import { Blogs, MyBlogs } from "./pages/blog";
import { BlogCreate, BlogEdit } from "./pages/blogCreate";
import { BlogPage } from "./pages/blogPage";
import { Signin, Signup } from "./pages/auth";
import { userContext } from "./lib/contexts";
import { useState, useEffect } from "react";

import { getMe, refresh } from "./api";
import { AuthRoutes, ErrorPage } from "./misc";

function App() {
  const [user, setUser] = useState({
    data: {},
    isAuthenticated: false,
    access: "",
  });

  useEffect(() => {
    refresh()
      .then(() => getMe())
      .then((data) => {
        setUser((prevUser) => ({
          ...prevUser,
          data: { ...data },
          isAuthenticated: true,
        }));
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route Component={Layout} path="/">
          <Route Component={Blogs} path="/" />
          <Route Component={Blogs} path="/blogs" />
          <Route Component={MyBlogs} path="/me/blogs" />
          <Route Component={BlogCreate} path="me/blogs/create" />
          <Route Component={BlogEdit} path="me/blogs/:id/edit" />
          <Route Component={BlogPage} path="/blogs/:id" />
          <Route Component={BlogPage} path="me/blogs/:id" />

          <Route Component={ErrorPage} path="*" />
        </Route>

        <Route Component={AuthRoutes} path="/">
          <Route Component={Signin} path="/signin" />
          <Route Component={Signup} path="/signup" />
        </Route>
      </Routes>
    </userContext.Provider>
  );
}

export default App;
