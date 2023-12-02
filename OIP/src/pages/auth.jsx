import { useState } from "react";
import { Button, TextInput, Label } from "flowbite-react"; 
import { signIn, signUp } from "../api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../lib/contexts";
import { useMutation } from "react-query";

export function Signin() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: () => signIn(state),
    onSuccess: (data) => {
      setUser({
        data: data.user,
        isAuthenticated: true,
      });
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto border p-4 rounded-lg mt-10 bg-white"
    >
      <h3 className="mb-4">Sign in</h3>
      <div className="mb-3">
        <Label for="email">Email</Label>
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={state.email}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3">
        <Label for="password">Password</Label>
        <TextInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={state.password}
          onChange={handleOnChange}
        />
      </div>
      <p
        onClick={() => navigate("/signup")}
        className="text-xs text-center mb-2 col-span-2"
      >
        Dont have an account?Sign up <b className="text-blue-500">here</b>
      </p>

      <Button color="primary" type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}


export function Signup() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    last_name: "",
    first_name: "",
    student_id: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleOnChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: () => signUp(state),
    onSuccess: () => {
      navigate("/signin");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto border p-4 rounded-lg grid grid-cols-2 gap-2 mt-10 bg-white"
    >
      <h3 className="mb-4 col-span-2">Sign up</h3>
      <div className="mb-3">
        <Label htmlFor="first_name">First Name</Label>
        <TextInput
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Enter first name"
          value={state.first_name}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="last_name">Last Name</Label>
        <TextInput
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Enter last name"
          value={state.last_name}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="student_id">Student ID</Label>
        <TextInput
          id="student_id"
          name="student_id"
          type="text"
          placeholder="Enter student ID"
          value={state.student_id}
          onChange={handleOnChange}
          className="col-span-2"
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="email">Email</Label>
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={state.email}
          onChange={handleOnChange}
          className="col-span-2"
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="password1">Password</Label>
        <TextInput
          id="password1"
          name="password1"
          type="password"
          placeholder="Enter password"
          value={state.password1}
          onChange={handleOnChange}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="password2">Confirm Password</Label>
        <TextInput
          id="password2"
          name="password2"
          type="password"
          placeholder="Confirm password"
          value={state.password2}
          onChange={handleOnChange}
        />
      </div>
      <p
        onClick={() => navigate("/signin")}
        className="text-xs text-center mb-2 col-span-2"
      >
        Already have an account?Sign in <b className="text-blue-500">here</b>
      </p>

      <Button className="col-span-2 w-full" color="primary" type="submit">Create Account</Button>
    </form>
  );
}