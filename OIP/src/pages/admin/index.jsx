import { Outlet, Link } from "react-router-dom"
import { Container, Col, Row} from "react-bootstrap"

export default function Dashbord(){
	return(

	<Container>
		<Row>
			<Col className="bg-primary" xs>
				<div>Blogs</div>
				<div>Programs</div>
			</Col>

			<Col>
				<Outlet />
			</Col>
		</Row>
	</Container>
	)	
}