import { useState, useEffect } from "react";
import { TextInput, Button, Label, Textarea } from "flowbite-react";
import { create, update, get } from "../api.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../lib/contexts.js";
import { courses } from "../courses.js";
import { useMutation, useQuery } from "react-query";
import { StarIcon } from "@heroicons/react/24/solid";
import Select from "react-select";
import { MainLayout } from "../lib/mainLayout.jsx";


export function BlogEdit() {
  const params = useParams();
  const { data, isLoading, isError } = useQuery(["blogs", params.id], () =>
    get("users/me/blogs/", params.id)
  );

  if (isLoading) return <div></div>;
  else if (isError) return <div></div>;

  return <BlogEditor initial={data} edit={true} />;
}

export function BlogCreate() {
  return <BlogEditor />;
}

function BlogEditor({ initial = null, edit = false }) {
  const [blog, setBlog] = useState(
    edit
      ? initial
      : {
          title: "",
          created: new Date(),
          body: "",
          author: null,
          approved: false,
          rating: 0,
          course: null,
        }
  );

  const mutation = useMutation({
    mutationFn: (data) => {
      return edit
        ? update("users/me/blogs/", data.id + "/", data)
        : create("users/me/blogs/", data);
    },
    onSuccess: (data) => {
      navigate(`/me/blogs/${data.id}`);
    },
  });

  const navigate = useNavigate();
  const { user } = useUser();

  const handleRating = (v) => {
    setBlog((prev) => {
      const value = prev.rating !== v ? v : 0;
      return { ...prev, rating: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.isAuthenticated) {
      mutation.mutate(blog);
    } else {
      alert("You aren't signed in");
    }
  };

  const handleChange = ({ target }) => {
    setBlog({ ...blog, [target.name]: target.value });
  };

  const handleMouseOver = (val) => {
    document
      .querySelectorAll(".rate")
      .forEach((el, index) => paintStars(el, index, val));
  };

  const paintStars = (el, index, rate) => {
    if (index < rate) el.classList.add("rate-active");
    else el.classList.remove("rate-active");
  };


  const courseToRepr = (course) => {

    return  course.code.toUpperCase() + " " +
      course.name
        .split(" ")
        .map(
          (txt) =>
            txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase()
        )
        .join(" ")
  }

  useEffect(() => {
    document
      .querySelectorAll(".rate")
      .forEach((el, index) => paintStars(el, index, blog.rating));
  }, [blog.rating]);

  return (
    <MainLayout>
    <div className="card md:w-3/4 p-4">
      <div className="text-2xl font-bold">{ edit ? "Edit" : "Add" } Article</div>
      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              type="text"
              id="title"
              value={blog.title}
              name="title"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex gap-4">
            <div>
              <Label>Rate your experience</Label>
              <div
                className="flex items-center rates cursor-pointer"
                onMouseLeave={() => handleMouseOver(blog.rating)}
              >
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="p-1"
                    onClick={() => handleRating(index + 1)}
                    onMouseOver={() => handleMouseOver(index + 1)}
                  >
                    <StarIcon className="w-5 rate" />
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-sm mr-0 ml-auto">
              <Label>Course</Label>
              <Select
                className="capitalize text-black" // Replace this with appropriate Select component or library
                isClearable={true}
                onChange={(selected) => {
                  console.log(blog)
                  setBlog(prev => {
                    const temp =  selected ? { ...selected.value} : null
                    return { ...prev, course: temp }
                  });
                }}
                value={blog.course && {
                  value: blog.course,
                  label: courseToRepr(blog.course)
                }}
                options={courses.map((course) => {
                  return {
                    value: course,
                    label: courseToRepr(course)
                  };
                })}
              />
            </div>
          </div>
          <div>
            <Label>Body</Label>
            <Textarea
              rows="10"
              value={blog.body}
              name="body"
              onChange={(e) => handleChange(e)}
            ></Textarea>
          </div>
          <Button onClick={handleSubmit} className="submit-button w-25" color="primary">
            {edit ? "Save changes" : "Submit blog"}
          </Button>
        </div>
      </form>
    </div>
    </MainLayout>
  );
}
