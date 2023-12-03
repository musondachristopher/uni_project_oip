import Layout from "./layout";
import { Routes, Route } from "react-router-dom";
import { Blogs, MyBlogs, Search, PopularFull, CourseBlogs } from "./pages/blog";
import { BlogCreate, BlogEdit } from "./pages/blogCreate";
import { BlogPage } from "./pages/blogPage";
import { Signin, Signup } from "./pages/auth";
import { userContext, Courses } from "./lib/contexts";
import { useState, useEffect } from "react";
import { getMe, refresh, list } from "./api";
import { AuthRoutes, ErrorPage } from "./misc";
import { Flowbite } from 'flowbite-react';
import { useQuery } from 'react-query'


const customTheme = {
  button: {
    color: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white font-semibold focus:ring-primary-300',
    },
  },
};

function App() {
  const [user, setUser] = useState({
    data: {},
    isAuthenticated: false,
    access: "",
  });

  const [ courses, setCourses ] = useState([])

  useEffect(() => {
    list('/courses').then(data => setCourses(data))
  }, [])

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
    <Flowbite theme={{ theme: customTheme }} >
    <userContext.Provider value={{ user, setUser }}>
    <Courses.Provider value={{ courses, setCourses }} >
      <Routes>
        <Route Component={Layout} path="/">
          <Route Component={Search} path="/search" />
          <Route Component={Blogs} path="/" />
          <Route Component={PopularFull} path="/blogs/popular" />
          <Route Component={CourseBlogs} path="/blogs/courses/:course_code" />
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
    </Courses.Provider>
    </userContext.Provider>
    </Flowbite>
  );
}

export default App;
