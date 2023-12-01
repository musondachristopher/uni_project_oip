import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/index";
import { Blogs, MyBlogs } from "./pages/blog";
import { BlogCreate, BlogEdit } from "./pages/blogCreate";
import { BlogPage } from "./pages/blogPage";
import { Signin, Signup } from "./pages/auth";
import { userContext } from "./lib/contexts";
import { useState, useEffect } from "react";

import { getMe } from "./api";
import { AuthRoutes, ErrorPage } from "./misc";

function App() {
  const [user, setUser] = useState({
    data: {},
    isAuthenticated: false,
    access: "",
  });

  useEffect(() => {
    try {
      getMe().then((data) => {
        setUser((prevUser) => ({
          ...prevUser,
          data: { ...data },
          isAuthenticated: true,
        }));
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route Component={Layout} path="/">
          <Route Component={Home} path="/" />
          <Route Component={MyBlogs} path="/me/blogs" />
          <Route Component={Blogs} path="/blogs" />
          <Route Component={BlogCreate} path="/blogs/create" />
          <Route Component={BlogPage} path="/blogs/:id" />
          <Route Component={BlogEdit} path="/blogs/:id/edit" />
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
