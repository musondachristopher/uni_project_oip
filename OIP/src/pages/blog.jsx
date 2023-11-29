import { useEffect, useState } from "react";
import { list, get, create, update } from "../api";
import { Stack, Button, Form, Container } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../lib/contexts";
import { courses } from "../courses.js"
import { UserIcon, ClockIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import { useQuery, useMutation } from "react-query";
import Select from "react-select"


export function BlogList() {
  const { data: blogs, isLoading, isError } = useQuery('blogs', () => list('blogs'));

  if(isLoading) return <div>Loading...</div>
  else if(isError) return <div>Error 500</div>

  return (  
    <Stack direction="vertical" gap="2" className="mt-4">
      {blogs.map((blog) => (
        <Link to={"/blogs/" + blog.id} key={blog.id} className="blog-link">
          <div>
          <div className="blog-title">{blog.title}</div>
          <div className="">{blog.course?.code } {blog.course?.name}</div>

          <div>{ Array(blog.rating).fill(null).map((star, index)=> <StarIcon key={index} className="icon-sm"/>) }</div>
          <Stack direction="horizontal" className="mt-2">
            <div className="blog-info ">
              <UserIcon className="icon-sm" />
              {blog.author.full_name}</div>
            <div className="blog-info mw-auto">
              <ClockIcon className="icon-sm" />
                {blog.created}</div>
          </Stack>
          </div>
        </Link>
      ))}
      <Link to="/blogs/create" className="create-blog-link">
        Create Blog
      </Link>
    </Stack>
  );
}

export function BlogDetails() {
  const params = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError } = useQuery(['blogs', params.id], ({ queryKey }) => get(queryKey[0] +'/', queryKey[1]));

  if(isLoading) return <>Loading...</>
  else if(isError) return <>Error</>

  return (
    <div className="blog-details">
      <h2>{blog.title}</h2>


      { user.data.id == blog.author.id && (

        !blog.approved && <div className="pending-approval">Pending Approval</div> 
      )}

      <div>{ blog.rating }</div>

      {user.data?.admin && (
        <Button onClick={handleApproval} className="approval-button">
          Approve
        </Button>
      )}

      <Stack direction="horizontal" className="blog-author-info">
        <h4>by {blog.author.full_name}</h4>
        <h4>{blog.created}</h4>
      </Stack>
      <div className="blog-body">{blog.body}</div>
    </div>
  );
}

export function BlogCreate() {
  const [blog, setBlog] = useState({
    title: "",
    created: new Date(),
    body: "",
    author: null,
    approved: false,
    rating: 0,
    course: null,
  });


  const mutation = useMutation({
    mutationFn: (data) => {
      create("blogs/", data )
    },
    onSuccess: (data) => {
      console.log(data)
      navigate("/blogs/" + data.id);
    }
  })  

  const navigate = useNavigate();
  const { user } = useUser();

  const handleRating = (v) => {
    setBlog(prev => {
      const value = prev.rating != v ? v : 0
      return { ...prev, rating: value }
    })    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.isAuthenticated) {
      mutation.mutate(blog)

    } else {
      alert("You aren't signed in");
    }
  };

  const handleChange = ({ target }) => {
    setBlog({ ...blog, [target.name]: target.value });
  };

  useEffect(() => {
    document.querySelectorAll(".rate").forEach((el, index )=> {

      if(index < blog.rating )
        el.classList.add("rate-active")
      else
        el.classList.remove("rate-active")
    })

  }, [blog.rating])
  return (
    <div className="create-blog">
      <Form className="blog-form">
        <Stack direction="vertical" gap="2">
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={blog.title}
            name="title"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Stack direction="horizontal" gap="4">
        <Form.Group>
          <Form.Label>Rate your expirience</Form.Label>
          <Stack direction="horizontal" gap={2}>
          { 
            Array(5).fill(null).map((_, index) => (
              <div 
                key={index} 
                className="rate"
                onClick={ () => handleRating(index + 1) }>
                { index + 1}
              </div>
            ))            
          }
          </Stack>
        </Form.Group>

        <Form.Group className="w-50 mw-auto me-0">
          <Form.Label>Course</Form.Label>
          <Select className="capitalize" isClearable={true} onChange={ selected => setBlog({ ...blog, course: selected.value }) }
            options={ courses.map(course => { 
            return { value: course, label: course.code.toUpperCase() + " " + course.name.split(" ").map(txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).join(" ") }} )} />
        </Form.Group>

        </Stack>
        <Form.Group>
          <Form.Label>Body</Form.Label>
          <Form.Control rows="10"
            as="textarea"
            value={blog.body}
            name="body"
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Button onClick={(e) => handleSubmit(e)} className="submit-button w-25" >
          Submit
        </Button>
        </Stack>
      </Form>
    </div>
  );
}
