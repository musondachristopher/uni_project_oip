import { useUser } from "../lib/contexts"
import { useNavigate, Outlet } from "react-router-dom"
import { useEffect } from "react"


export default function Admin(){
	const { user } = useUser()
	const navigate = useNavigate()

	if(!user.isAuthenticated){
		navigate(-1)
	}

	return(

	<div>
		<Outlet />
	</div>
	)
}