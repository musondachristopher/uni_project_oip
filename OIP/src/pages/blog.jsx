import { list } from "../api";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { UserIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  StarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import moment from "moment";
import { MainLayout } from "../lib/mainLayout";
import { useUser } from "../lib/contexts";
import { useEffect, useState } from "react";

export function MyBlogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myblogs", page],
    queryFn: () => list("users/me/blogs" + "?" + constructUrl().toString()),
    staleTime: 3600 * 3,
  });

  const constructUrl = () => {
    searchParams.delete("page");
    searchParams.append("page", page);
    setSearchParams(searchParams);

    return searchParams;
  };

  useEffect(() => {
    constructUrl();
  }, [page]);

  return (
    <BlogList
      data={data}
      isLoading={isLoading}
      isError={isError}
      page={page}
      setPage={setPage}
    />
  );
}

export function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs", Object.fromEntries([...searchParams]), page],
    queryFn: () => list("blogs" + "?" + constructUrl().toString()),
    staleTime: 3600 * 3,
  });

  const constructUrl = () => {
    searchParams.delete("page");
    searchParams.append("page", page);
    setSearchParams(searchParams);

    return searchParams;
  };

  useEffect(() => {
    constructUrl();
  }, [page]);

  return (
    <BlogList
      data={data}
      isLoading={isLoading}
      isError={isError}
      page={page}
      setPage={setPage}
    >
      <PopularBlogs />
    </BlogList>
  );
}

export function BlogList({
  data,
  isLoading,
  isError,
  page,
  children = null,
  setPage = () => {},
}) {
  const { user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error 500</div>;

  return (
    <MainLayout>
      <div className="card p-4 md:w-3/4 ">
        <div>
          {data.results.map((blog) => (
            <Link
              to={
                (blog.author.id == user.data?.id ? "/me" : "") +
                "/blogs/" +
                blog.id
              }
              key={blog.id}
              className="border-b last:border-b-0"
            >
              <div className="py-4">
                <div className="capitalize font-bold text-2xl text-black">
                  {blog.title}
                </div>
                <div className="flex gap-2 capitalize text-sm">
                  <div>
                    <span>{blog.course?.code.toUpperCase()}</span>
                    <span className="">{blog.course?.name}</span>
                  </div>
                  <div className="flex">
                    {Array(blog.rating)
                      .fill(null)
                      .map((star, index) => (
                        <StarIcon key={index} className="w-4 text-yellow-300" />
                      ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2 text-sm">
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

        {(data.previous || data.next) && (
          <div className="text-sm font-medium flex gap-1 items-center mt-8">
            <button
              disabled={!data.previous}
              className="bg-primary-400 disabled:bg-gray-200 text-white rounded-full p-0.5"
              onClick={() => setPage(data.previous)}
            >
              <ChevronLeftIcon className="text-white w-4" stroke="3" />
            </button>

            <div className="mx-4">{page}</div>

            <button
              disabled={!data.next}
              className="bg-primary-400 disabled:bg-gray-200 text-white rounded-full p-0.5"
              onClick={() => setPage(data.next)}
            >
              <ChevronRightIcon className="text-white w-4" stroke="2" />
            </button>
          </div>
        )}
      </div>
      <div className="md:w-1/4">{children}</div>
    </MainLayout>
  );
}

function PopularBlogs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["popularblogs-sidebar", { size: 5 }],
    queryFn: () => list("blogs/popular?size=5"),
    staleTime: 3600,
  });

  return (
    <SideBarBlogs
      title="Popular"
      data={data}
      isLoading={isLoading}
      isError={isError}
      link={"blogs/popular"}
    />
  );
}

export function SimilarBlogs({ blog }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["similarblogs", { id: blog.id, size: 5 }],
    queryFn: () => list(`blogs/${blog.id}/similar?size=5`),
    staleTime: 3600,
  });

  return (
    <SideBarBlogs
      title="Similar"
      data={data}
      isLoading={isLoading}
      isError={isError}
      link={"blogs/course/" + blog.course.code}
    />
  );
}

function SideBarBlogs({ title, data, isLoading, isError, link }) {
  return (
    <div className="card">
      <div className="font-medium text-xl px-2 pt-3">{title}</div>
      <div className="min-h-[96px]">
        {isLoading ? (
          <div> Loading </div>
        ) : isError ? (
          <div> Error </div>
        ) : data.length == 0 ? (
          <div> No {title} blogs </div>
        ) : (
          <div className="">
            <div className="p-2">
              {data.results.map((blog) => (
                <Link
                  key={blog.id}
                  to={"/blogs/" + blog.id}
                  className="border-b-2 last:border-b-0"
                >
                  <div className="text-sm py-2">
                    <div className="capitalize font-bold">{blog.title}</div>
                    <div className="capitalize truncate mt-1">
                      {blog.course.name}
                    </div>
                    <div className="capitalize text-xs">
                      {moment(blog.created).format("Do MMMM YYYY")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to={"/" + link}>
              <div
                className="font-bold mt-2 text-primary-500 text-center
               p-2 w-full text-sm"
              >
                SEE MORE{" "}
              </div>
            </Link>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
