import Link from "next/link";
import SearchBox from "@/components/search-box.jsx";

async function searchThings(query) {
	const res = await fetch(`http://localhost:3000/api/things/search/${encodeURIComponent(query)}`);
	if (!res.ok) {
		throw new Error("Failed to search things");
	}
	return res.json();
}

export default async function ThingSearch({params}) {
	const {query} = await params;
	const parsedQuery = decodeURIComponent(query);
	const things = await searchThings(parsedQuery);

	return (
		<>
			<h1>Search: {parsedQuery}</h1>
			<SearchBox query={parsedQuery} />

			<ul>
				{things.map(thing => (
					<li key={thing._id}>
						<Link href={`/thing/${thing._id}`}>{thing.name}</Link>
					</li>
				))}
			</ul>
		</>
	);
}
