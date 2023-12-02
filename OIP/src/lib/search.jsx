import { useState } from "react"
import { TextInput } from "flowbite-react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom"


export function SearchBar() {
	const [ search, setSearch ] = useState("")
	const navigate = useNavigate()
	let [searchParams, setSearchParams] = useSearchParams();	

	const handleSubmit = (e) => {
		e.preventDefault()
	  navigate({
	  	pathname: `/search`,
	  	search: createSearchParams({ q: search }).toString()
	  });
  }

	return (
		<form onSubmit={handleSubmit} className="bg-gray-50 rounded-full text-gray-500 flex items-center gap-1 px-2 md:w-1/3 w-3/5">
			<input 
				className="bg-transparent p-1.5 focus:outline-none flex-1 placeholder:text-sm" 
				placeholder="search articles, course codes and names"
				value={search} onChange={ e => setSearch(e.target.value)} />
			<button>
				<MagnifyingGlassIcon className="w-6 p-0.5 rounded-full bg-primary-400 hover:bg-primary-500 text-white"/>
			</button>
		</form>
	)
}	