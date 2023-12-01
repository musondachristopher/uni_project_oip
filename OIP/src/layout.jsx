import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "./lib/contexts";
import { signOut } from "./api";
import { useMutation } from "react-query";
import { Navbar, Dropdown, Button } from "flowbite-react";
import { PencilIcon, SquaresPlusIcon, ArrowLeftOnRectangleIcon, BookOpenIcon } from "@heroicons/react/24/solid"

export default function Layout() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => setUser({ data: {}, isAuthenticated: false }),
  });

  return (
    <div className="bg-gray-50/40 min-h-screen">
      <Navbar fluid className="border-b">
        <Navbar.Brand className="mr-8 font-bold text-2xl my-auto">
          <Link to="/" className="text-lg">
            Toggy
          </Link>
        </Navbar.Brand>

        <div className="flex md:order-2">
          {!user.isAuthenticated ? (
            <Button size="sm" onClick={() => navigate("/signin")}>
              Sign in
            </Button>
          ) : (
            <Dropdown
              inline
              label={<div>{`Hi ${user.data?.full_name}`}</div>}
              id="basic-nav-dropdown"
              className="justify-content-end"
            >
              <Dropdown.Header>
                <div>{user.data.full_name}</div>
                <div>{user.data.student_id}</div>
                <div className="font-medium">{user.data.email}</div>
              </Dropdown.Header>
              <Dropdown.Item
                icon={PencilIcon}
                onClick={() => navigate("blogs/create")}
              >
                Create blog
              </Dropdown.Item>
              <Dropdown.Item
                icon={BookOpenIcon}
                onClick={() => navigate("me/blogs")}
              >
                My blogs
              </Dropdown.Item>
              {user.data.is_staff && (
                <Dropdown.Item icon={SquaresPlusIcon}>
                  <a href="http://localhost:8000/admin" className="dropdown-item">
                    Dashboard
                  </a>
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={mutation.mutate}
                icon={ArrowLeftOnRectangleIcon}
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>

        <Navbar.Toggle />
        <Navbar.Collapse className="mr-auto ml-0">
          <Link to="/blogs" className="">
            <Navbar.Link>Blogs</Navbar.Link>
          </Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="max-w-6xl p-2 w mx-auto">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
