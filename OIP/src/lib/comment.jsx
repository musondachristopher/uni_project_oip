import { Button, Label, TextInput, Textarea } from "flowbite-react"
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
import { create, list } from "../api";
import { useUser } from "./contexts";
import moment from "moment";
import { Loading } from "./loading"


export function Comments({ blog_id }) {
  const { user } = useUser()
  const [msg, setMsg] = useState({
    full_name: user.data.full_name || "",
    email: user.data.email || "",
    comment: "",
  });

  const queryClient = useQueryClient()

  const handleChange = ({target}) => {
    setMsg({...msg, [target.name]: target.value })
  }
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', blog_id ], 
    queryFn: () => list(`blogs/${blog_id}/comments/` ),
    enabled: !!blog_id,
    retry: 1,
    retryDelay: 5000
  })

  const mutation = useMutation({
    mutationFn: (msg) => create(`blogs/${blog_id}/comments/`, msg),
    onSuccess: data => {
      queryClient.setQueryData(['comments', blog_id], (oldComments) => {
        return [ data, ...oldComments ];
      } );

      setMsg({
        full_name: user.data.full_name || "",
        email: user.data.full_name || "",
        comment: "",
      })
    }
  })

  return (
    <div>
      <div className="font-semibold">Comments</div>

      <CommentList
        isLoading={isLoading}
        comments={comments}
        isError={isError}
      />
      <form className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-8">
        <div>
          <Label>Full name</Label>
          <TextInput
            onChange={(e) => handleChange(e)}
            type="text"
            name="full_name"
            value={msg.full_name}
          />
        </div>
        <div>
          <Label>Email</Label>
          <TextInput
            onChange={(e) => handleChange(e)}
            type="email"
            name="email"
            value={msg.email}
          />
        </div>
        <div className="col-span-2">
          <Label>Message</Label>
          <Textarea
            maxLength={500}
            rows="10"
            type="text"
            value={msg.comment}
            onChange={(e) => handleChange(e)} 
            name="comment"
          />
        </div>
        <Button className="w-full col-span-2" color="primary" onClick={ () => mutation.mutate(msg) }>Comment</Button>
      </form>
    </div>
  );
}

function CommentList({ comments , isLoading, isError }) {
  if(isLoading) return (
    <Loading />
  )

  else if(isError)
    return <div>Failed to load comments</div>

  return (
    <div className="flex flex-col gap-1 mt-1">
      {comments.map(comment => (
        <div className="p-2 flex text-sm gap-1 items-start" key={comment.id}>
          <ChatBubbleBottomCenterTextIcon className="w-4 text-primary-500 mt-1" />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-normal">{comment.full_name}</span>
              <span className="">{comment.email}</span>
            </div>
            <div className="mb-2">{ moment(comment.created).format("Do MMMM YYYY")}</div>
            <div className="col-span-2 ">
              <div>{comment.comment}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
