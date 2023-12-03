import { list } from "../api";
import { Link, useLocation, useSearchParams, useParams } from "react-router-dom";
import { UserIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  StarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import moment from "moment";
import { MainLayout } from "../lib/mainLayout";
import { useUser, useCourses } from "../lib/contexts";
import { useEffect, useState } from "react";
import { CourseSidebar} from "../lib/course"
import { Loading } from "../lib/loading"


export function MyBlogs() {
  return(
    <Blogs url={"users/me/blogs"} title="My Blogs"/>
  )
}

export function Search(){
  const [searchParams, setSearchParams] = useSearchParams();

  return(
    <Blogs keys={["search", "blogs"]} title={`Search results for "${searchParams.get('q')}" `}/>
  )
}

export function CourseBlogs(){
  const { course_code } = useParams()
  const { courses } = useCourses()
  return(
    <Blogs url={"blogs/courses/" + course_code} keys={["blogs", "courses", course_code ]} 
      title={`Blogs about ${courses.find(i => i.code == course_code)?.code.toUpperCase()}`}
    />
  )
}

export function PopularFull(){
  return(
    <Blogs url={"blogs/popular"} title={"Popular Blogs"} keys={["blogs", "popular"]}/>
  )
}

export function Blogs({ url="blogs", title="", keys=["blogs"] }){
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...keys, Object.fromEntries([...searchParams]), page],
    queryFn: () => list(url + "?" + constructUrl().toString()),
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
      title={title}
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
  title = "",
  children = null,
  setPage = () => {},
}) {
  const { user } = useUser();

  return (
    <MainLayout>
      <div className="card p-4 md:w-3/4 ">
        { title && <div className="font-semibold text-xl">{title}</div> }
        <div>
          { isLoading ? <Loading/> :  
            isError ? <div>Error 500</div> :
            data.results.map((blog) => (
            <Link
              to={
                (blog.author.id == user.data?.id ? "/me" : "") +
                "/blogs/" +
                blog.id
              }
              key={blog.id}
              className="border-b last:border-b-0 group"
            >
              <div className="py-4">
                <div className="capitalize font-bold text-2xl text-gray-600 group-hover:text-primary-500">
                  {blog.title}
                </div>
                <div className="flex gap-2 text-sm">
                  <div>
                    <span className="mr-1">{
                      blog.course.code.toUpperCase()
                    }</span>
                    <span className="capitalize">{blog.course.name}</span>
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

        {data && (data.previous || data.next) && (
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
      <div className="md:w-1/4 flex flex-col gap-4">
        {children}
        <CourseSidebar />
      </div>
    </MainLayout>
  );
}

function PopularBlogs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["popularblogs-sidebar", { size: 4 }],
    queryFn: () => list("blogs/popular?size=4"),
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
    queryKey: ["similarblogs", { id: blog.id, size: 4 }],
    queryFn: () => list(`blogs/${blog.id}/similar?size=4`),
    staleTime: 3600,
  });

  return (
    <SideBarBlogs
      title="Similar"
      data={data}
      isLoading={isLoading}
      isError={isError}
      link={"blogs/courses/" + blog.course.code}
    />
  );
}

function SideBarBlogs({ title, data, isLoading, isError, link }) {
  return (
    <div className="card">
      <div className="font-medium text-xl px-2 pt-3">{title}</div>
      <div className="min-h-[96px]">
        {isLoading ? (
          < Loading />
        ) : isError ? (
          <div> Error </div>
        ) : data.results.length == 0 ? (
          <div className="p-2 grid-cols-1 grid-rows-1 text-sm text-gray-500 grid place-items-center h-full"> 
            <span>No {title} blogs found</span> 
          </div>
        ) : (
          <div className="h-full">
            <div className="p-2">
              {data.results.map((blog) => (
                <Link
                  key={blog.id}
                  to={"/blogs/" + blog.id}
                  className="border-b-2 last:border-b-0 group"
                >
                  <div className="text-sm py-2">
                    <div className="capitalize font-bold group-hover:text-primary-500">{blog.title}</div>
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
            <Link to={"/" + link} className="mb-0 mt-auto">
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
    </div>
  );
}
