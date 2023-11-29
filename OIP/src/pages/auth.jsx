import { useState, useContext } from "react"
import { Form, Button, Container } from "react-bootstrap"
import { signIn, signUp } from "../api"
import { useNavigate } from "react-router-dom"
import { useUser } from "../lib/contexts"
import { useMutation } from "react-query"


export function Signin () {
	const navigate = useNavigate()
	const { setUser } = useUser()

	const [ state, setState ] = useState({
		email: "",
		password: ""
	})

	const handleOnClick = ({target}) => {
		setState({...state, [target.name]: target.value })
	}

	const mutation = useMutation({
    mutationFn: (state) => {
      return signIn(state)
    },
    onSuccess: (data) => {
    	setUser({
	    		data: data.user,
	    		isAuthenticated: true
    		}
    	)

    	navigate('/')
    }
  })

	const handleSubmit = () => {
		mutation.mutate(state)
	}

	return(
	<Container className="w-50 border py-4 px-4 mt-4 rounded">
		<Form>
			<h3 className="mb-4">Sign in</h3>
			{ Object.entries(state).map(([name, value]) => (
				<div key={name}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
	        <Form.Label>{name.replace("_", " ")}</Form.Label>
	        <Form.Control name={name} type={name.replace("_", " ")} placeholder={`Enter ${name.replace("_", " ")}`} value={value} onChange={ e => handleOnClick(e)} />
	      </Form.Group>
	      </div>
			))}

      <Button variant="primary" type="submit"  onClick={ e => {
      	e.preventDefault() 
      	handleSubmit()
      }}>
        Login
      </Button>
    </Form>
	</Container>
	)
}

export function Signup () {
	const navigate = useNavigate()
	const [ state, setState ] = useState({
		last_name: "",
		first_name: "",
		student_id: "",
		email: "",
		password1: "",
		password2: "",
	})

	const handleOnClick = ({target}) => {
		setState({...state, [target.name]: target.value })
	}

	const handleSubmit = () => {
		const user = signUp(state)

		if(user){

			navigate("/signIn")
		}else {
			console.log("failed to sign in")
		}
	}

	return(
	<Container className="w-50 border py-4 px-4 mt-4 rounded">
		<Form >
			<h3 className="mb-4">Sign up</h3>
			{ Object.entries(state).map(([name, value]) => (
				<div key={name}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
	        <Form.Label>{name.replace("_", " ")}</Form.Label>
	        <Form.Control name={name} type={name.includes('password') ? 'password' : name} 
	        	placeholder={`Enter ${name.replace("_", " ")}`} value={value} onChange={ e => {
		      	e.preventDefault() 
		      	handleOnClick(e)
		      }}/>
	      </Form.Group>
	      </div>
			))}

      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Create Account
      </Button>
    </Form>
	</Container>
	)
}