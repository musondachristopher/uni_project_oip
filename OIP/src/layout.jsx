import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "./lib/contexts";
import { signOut } from "./api";
import { useMutation } from "react-query";
import { Navbar, Dropdown, Button, Avatar} from "flowbite-react";
import { PencilIcon, SquaresPlusIcon, ArrowLeftOnRectangleIcon, BookOpenIcon } from "@heroicons/react/24/solid"
import { SearchBar } from "./lib/search"

export default function Layout() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => setUser({ data: {}, isAuthenticated: false }),
  });

  return (
    <div className="bg-gray-50/80 min-h-screen">
      <Navbar fluid className="shadow py-4">
        <Navbar.Brand className="mr-8 font-bold text-2xl my-auto">
          <Link to="/" className="text-lg text-primary-500">
            OIPcourses
          </Link>
        </Navbar.Brand>

        <SearchBar />
        <div className="flex md:order-2">
          {!user.isAuthenticated ? (
            <Button size="sm" color="primary" onClick={() => navigate("/signin")}>
              Sign in
            </Button>
          ) : (
            <Dropdown
              inline
              label={
                <>
                <Avatar className="md:mr-2" rounded size="sm" 
                  placeholderInitials={
                    user.data.full_name.split(" ").reduce((a,b) => a += b.charAt(0), "")
                  } />
                <div className="md:block hidden">{`Hi ${user.data?.full_name}`}</div>
                </>
              }
              id="basic-nav-dropdown"
              className="justify-content-end"
            >
              <Dropdown.Header>
                <div className="md:hidden">{user.data.full_name}</div>
                <div>{user.data.student_id}</div>
                <div className="font-medium">{user.data.email}</div>
              </Dropdown.Header>
              <Dropdown.Item
                icon={PencilIcon}
                onClick={() => navigate("me/blogs/create")}
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
                  <a href={import.meta.env.VITE_ADMIN_SITE} className="dropdown-item">
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
      </Navbar>
      <div className="max-w-6xl p-2 w mx-auto">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
