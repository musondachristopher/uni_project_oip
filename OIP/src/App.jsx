import { Routes, Route } from "react-router-dom"
import Layout from "./layout"
import Home from "./pages/index"
import { BlogList, BlogDetails, BlogCreate } from "./pages/blog"
import Admin from "./pages/admin"
import Dashboard from "./pages/admin/index"
import { Signin, Signup } from "./pages/auth"
import { userContext } from "./lib/contexts"
import { useState, useEffect } from "react"
import { useMutation } from "react-query"
import Cookie from "js-cookie"
import { refresh, getMe } from './api'

function App() {
  const [user, setUser] = useState({
    data: {},
    isAuthenticated: false, 
    access: ""
  })

  useEffect(() => {
    getMe().then(data => {
      setUser(prevUser => ({
        ...prevUser,
        data: { ...data },
        isAuthenticated: true, // Assuming successful authentication
        // Add logic here to set the access value based on received data
      }));
    });
  }, []);


  return (
    <userContext.Provider value={{ user, setUser }}>
    <Routes>
      <Route Component={ Layout } path="/">
        <Route Component={ Home } path="/" />
        <Route Component={ BlogList } path="/blogs" />
        <Route Component={ BlogCreate } path="/blogs/create" />
        <Route Component={ BlogDetails } path="/blogs/:id" />
        <Route Component={ Signin } path="/signin" />
        <Route Component={ Signup } path="/signup" />
      </Route>
    </Routes>
    </userContext.Provider>
  )
}

export default App
