import Stack from "react-bootstrap/Stack"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Container from "react-bootstrap/Container"

import { Link, Outlet, useLocation } from "react-router-dom"
import { useUser } from "./lib/contexts"
import { signOut } from './api'
import { useMutation } from 'react-query'


export default function Layout(){

	const { user, setUser } = useUser()
	const location = useLocation()

  const mutatation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () =>
      setUser({data: {}, isAuthenticated: false })

  })

  return (
    <Stack direction="vertical">
      <Navbar expand="lg" className="bg-body-tertiary">
      	<Container>
        <Navbar.Brand>
          <Link to="/">
            <div>ToggyUniversity</div>
          </Link>
        </Navbar.Brand>
        <div className="me-auto"/>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav className="">
          	<Nav.Item className="">
            <Link to="/" className="nav-link">
              Home
            </Link>
            </Nav.Item>

            <Nav.Item>
            <Link to="/blogs" className="nav-link">
              Blogs
            </Link>
            </Nav.Item>

            {!user.isAuthenticated ? (
              <>
              	<Nav.Item>
                <Link to="/signup" className="nav-link">
                  Sign up
                </Link>
                </Nav.Item>
                <Nav.Item>
                <Link to="/signin" className="nav-link">
                  Sign in
                </Link>
                </Nav.Item>
              </>
            ) : (
              <NavDropdown title={`Welcome ${user.data?.full_name}`} id="basic-nav-dropdown" className="justify-content-end">

                {
                	user.data.admin && 
	                	<NavDropdown.Item>
	                    <Link to="/admin" className="dropdown-item">
	                      Dashboard
	                    </Link>
	                  </NavDropdown.Item>
                	
                }

                <NavDropdown.Item>
                  <Nav.Item className="dropdown-item" onClick={ mutatation.mutate }>
                    Sign out
                  </Nav.Item>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container as="main" sm className="bg-tertiary">

        <Outlet />
      </Container >
    </Stack>
  );
}