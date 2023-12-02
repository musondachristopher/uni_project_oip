import { useEffect } from "react";
import { get, remove } from "../api.jsx";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../lib/contexts.js";
import {
  UserIcon,
  ClockIcon,
  TrashIcon,
  XCircleIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRef } from "react";
import { Comments } from "../lib/comment.jsx";
import { Dropdown, Badge } from "flowbite-react";
import moment from "moment";
import { MainLayout } from "../lib/mainLayout.jsx";
import { stripHtml } from "string-strip-html";
import { SimilarBlogs } from "./blog.jsx";


export function BlogPage() {
  const params = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs", params.id],
    queryFn: ({ queryKey }) => get(
      (location.pathname.includes('me') ? "users/me/": "") + queryKey[0] + "/", queryKey[1]),
  });

  let bodyRef = useRef(null);

  const renderHTML = (data) => {
    if (bodyRef) {
      bodyRef.current.innerHTML = stripHtml(data, {
        stripTogetherWithTheirContents: [
          "script", // default
          "style", // default
          "xml", // default
          "pre", 
          "textarea",
          "head",
          "link",
          "meta",
          "input",
          "button",
          "select",
          "iframe",
          "frameset"
        ],
      }).result ;
    }
  };

  const mutation = useMutation({
    mutationFn: (action) => {
      switch (action) {
        case "approval":
          return get("blogs/", params.id + "/approval");
        case "remove":
          return remove("blogs/", params.id);
        case "author_remove":
          return remove("users/me/blogs/", params.id);
      }
    },

    onSuccess: (data, variables) => {
      console.log(variables);
      if (variables == "approval") {
        queryClient.setQueryData(["blogs", params.id], data);
      } else if (variables == "remove") {
        navigate(-1);
      }
    },
  });

  useEffect(() => {
    if (blog) renderHTML(blog.body);
  }, [blog]);

  if (isLoading) return <>Loading...</>;
  else if (isError) return <>Error</>;

  return (
    <MainLayout>
      <div className="card md:w-3/4 p-4">
        <h2 className="text-5xl text-center mb-4 font-semibold capitalize">
          {blog.title}
        </h2>

        <div className="flex gap-4 my-3 text-sm">
          {user.data?.id == blog.author?.id && !blog.approved && (
            <Badge color="red" icon={ClockIcon}>
              Pending Approval
            </Badge>
          )}

          <div className="ml-auto mr-0"></div>
          {user.data?.id == blog.author?.id && (
            <Dropdown
              inline
              label={
                <Badge color="green" icon={UserCircleIcon}>
                  Author Actions
                </Badge>
              }
              arrowIcon={false}
            >
              <Dropdown.Item
                icon={PencilSquareIcon}
                onClick={() => navigate(`/me/blogs/${params.id}/edit`)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                icon={TrashIcon}
                onClick={() => mutation.mutate("author_remove")}
              >
                Remove
              </Dropdown.Item>
            </Dropdown>
          )}

          {/* Admin Panel */}
          {user.data?.is_staff && (
            <Dropdown
              inline
              label={
                <Badge color="gray" icon={CheckBadgeIcon}>
                  Admin Actions
                </Badge>
              }
              arrowIcon={false}
            >
              {blog.approved ? (
                <Dropdown.Item
                  icon={XCircleIcon}
                  onClick={() => mutation.mutate("approval")}
                >
                  Unapprove
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  icon={CheckCircleIcon}
                  onClick={() => mutation.mutate("approval")}
                >
                  Approve
                </Dropdown.Item>
              )}
              <Dropdown.Item
                icon={TrashIcon}
                onClick={() => mutation.mutate("remove")}
              >
                Remove
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <div className="flex">
            {Array(blog.rating)
              .fill(null)
              .map((star, index) => (
                <StarIcon key={index} className="w-4 text-yellow-300" />
              ))}
          </div>
          <div className="blog-info flex gap-2">
            <UserIcon className="icon-sm icon" />
            {blog.author.full_name}
          </div>
          <div className="blog-info flex gap-2">
            <ClockIcon className="icon-sm icon" />
            {moment(blog.created).format("dddd Do MMMM, YYYY ")}
          </div>
        </div>

        <article>
          <div ref={bodyRef} className="blog-body w-full"></div>
        </article>

        <div className="mt-8">
          <div className="font-medium">Comments</div>

          <Comments blog_id={blog.id} />
        </div>
      </div>
      <div className="md:w-1/4">
        { !isLoading && !isError && (
          <SimilarBlogs blog={blog} />
        )}
      </div>
    </MainLayout>
  );
}
