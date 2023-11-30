import { useEffect } from "react";
import { get, remove, update } from "../api.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../lib/contexts.js";
import {
  UserIcon,
  ClockIcon,
  TrashIcon,
  XCircleIcon,
  PencilSquareIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRef } from "react";
import { Comments } from "../lib/comment.jsx";
import { Button, Dropdown } from "flowbite-react";
import moment from "moment";
import { MainLayout } from "../lib/mainLayout.jsx";

export function BlogPage() {
  const params = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs", params.id],
    queryFn: ({ queryKey }) => get(queryKey[0] + "/", queryKey[1]),
  });

  let bodyRef = useRef(null);
  const renderHTML = (data) => {
    if (bodyRef) {
      bodyRef.current.innerHTML = data;
    }
  };

  const mutation = useMutation({
    mutationFn: (action) => {
      switch (action) {
        case "approval":
          return get("blogs/", params.id + "/approval");
        case "remove":
          return remove("blogs/", params.id);
      }
    },

    onSuccess: (data, variables) => {
      console.log(variables);
      if (variables == "approval") {
        queryClient.setQueryData(["blogs", params.id], data);
      }else if(variables == "remove") {
        navigate(-1)
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
      <div className="flex gap-4 md:flex-row flex-col">
        <div className="blog-details bg-white p-4 shadow md:w-3/4">
          <h2 className="text-5xl text-center mb-4 font-semibold">
            {blog.title}
          </h2>

          <div className="flex gap-4 my-3 text-sm">
            {user.data.id == blog.author.id && !blog.approved && (
              <div className="rounded-full bg-red-500 text-sm p-1 mt-1">
                Pending Approval
              </div>
            )}

            <div className="ml-auto mr-0"></div>
            {user.data?.id == blog.author?.id && (
              <Dropdown
                inline
                label={
                  <div className="bg-yellow-300 p-1 px-2 rounded">
                    Author Actions
                  </div>
                }
                arrowIcon={false}
              >
                <Dropdown.Item
                  icon={PencilSquareIcon}
                  onClick={() => navigate(`/blogs/${params.id}/edit`)}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  icon={TrashIcon}
                  onClick={() => mutation.mutate("remove")}
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
                  <div className="bg-rose-300 p-1 px-2 rounded">
                    Admin Actions
                  </div>
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

          <div ref={bodyRef} className="blog-body"></div>

          <div className="mt-8">
            <div className="font-medium">Comments</div>

            <Comments blog_id={blog.id} />
          </div>
        </div>
        <div className="md:w-1/4 shadow p-4 bg-white flex-grow-0">r</div>
      </div>
    </MainLayout>
  );
}
