import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { useCourses } from "./contexts"


const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
export function CourseSidebar (){
	const [ active, setActive ] = useState("")
	const [ selected, setSelected ] = useState([])
	const { courses } = useCourses()

	const handleSelect = (char) => {
		setActive(prev => prev !== char ? char: "")
		setSelected([ ...courses.filter(i => char.toLowerCase() == i.name.charAt(0))])
	}

	return(
		<div className="card">
			<div className="font-medium text-xl p-2 pt-3">Courses</div>
				{ active === "" && 
					<div className="grid grid-cols-5 place-items-center pb-2">
						{ alphabet.map(char => (
							<button className="hover:bg-primary-500 rounded-full p-1 hover:text-white font-bold
								w-6 h-6 text-sm gap-2
							" key={char} 
								onClick={() => handleSelect(char) }> { char } </button>)) }
					</div>
				}

				{ active !== "" && 
					<div className="p-2 text-xs">
						<div className="flex gap-1 flex-col">
							{ selected.map(course => <Link className="text-underline hover:text-primary-500" to={"blogs/courses/" + course.code }>
								<div className="capitalize">{ course.name } (<span className="font-semibold">{course.code.toUpperCase()}</span>)</div>
							</Link>)}
						</div>
						<div className="flex gap-2 items-center mt-3">
							<div className="mr-0 ml-auto font-semibold">{ selected.length } course{selected.length != 1 && "s"}</div>
							<button className="text-white bg-primary-500 py-0.5 px-2 rounded-full" onClick={() => setActive("")}>
								Back
							</button>
						</div>
					</div>
				}
		</div>
	)
}