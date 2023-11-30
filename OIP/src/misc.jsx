import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "./lib/contexts";
import {Button } from "flowbite-react"


export function AuthRoutes() {
  const { user } = useUser();
  const navigate = useNavigate();
  if (user.isAuthenticated) navigate(-1);

  return (
    <div className="">
      <div className="text-3xl text-center font-medium mt-4"
        onClick={() => navigate("/")}
      >Toggy</div>
      <Outlet />
    </div>
  );
}


export function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full items-center justify-center flex-col mx-center gap-2">
      <div className="text-5xl font-medium">Oops!</div>
      <div>Couldn't find page</div>

      <Button onClick={() => navigate("/")}>go to home page</Button>
    </div>
  );
}