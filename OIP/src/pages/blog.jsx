import { list } from "../api";
import { Link } from "react-router-dom";
import { UserIcon, ClockIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import moment from "moment";
import { MainLayout } from "../lib/mainLayout";



export function MyBlogs() {
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery("myblogs", () => list("users/me/blogs"));

  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error 500</div>;

  return <BlogList blogs={blogs} isLoading={isLoading} isError={isError} />
}

export function Blogs() {
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery("blogs", () => list("blogs"));

  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error 500</div>;
  return <BlogList blogs={blogs} isLoading={isLoading} isError={isError} />
}

export function BlogList({ blogs, isLoading, isError }) {
  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error 500</div>;

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6 shadow p-4 bg-white w-3/4">
        {blogs.map((blog) => (
          <Link to={"/blogs/" + blog.id} key={blog.id} className=" rounded-lg">
            <div>
              <div className="blog-title">{blog.title}</div>
              <div className="">
                {blog.course?.code} {blog.course?.name}
              </div>

              <div className="flex">
                {Array(blog.rating)
                  .fill(null)
                  .map((star, index) => (
                    <StarIcon key={index} className="w-4 text-yellow-300" />
                  ))}
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <div className="blog-info flex gap-2">
                  <UserIcon className="icon-sm icon" />
                  {blog.author.full_name}
                </div>
                <div className="blog-info flex gap-2">
                  <ClockIcon className="icon-sm icon" />
                  {moment(blog.created).format("Do MMMM, YYYY")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white w-1/4">f</div>
    </MainLayout>
  );
}
