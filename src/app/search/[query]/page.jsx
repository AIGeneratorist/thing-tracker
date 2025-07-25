import Link from "next/link";
import Paginator from "@/components/paginator.jsx";
import SearchBox from "@/components/search-box.jsx";
import ViewOptions from "@/components/view-options.jsx";

async function searchThings(query, {sort = "_idDesc", limit = 25}) {
	const res = await fetch(`http://localhost:3000/api/things/search/${encodeURIComponent(query)}` +
		`?sort=${sort}&limit=${limit}`);
	if (!res.ok) {
		throw new Error("Failed to search things");
	}
	return res.json();
}

export default async function ThingSearch({params, searchParams}) {
	const {query} = await params;
	const {sort, limit} = await searchParams;

	const parsedLimit = limit && parseInt(limit);
	const parsedQuery = decodeURIComponent(query);
	const prefix = `/search/${query}`;

	const res = await searchThings(parsedQuery, {sort, limit: parsedLimit});
	const things = res.results;
	const count = res.count;

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
			<Paginator count={count} limit={parsedLimit} prefix={prefix} />

			<h2>View Options</h2>
			<ViewOptions sort={sort} limit={parsedLimit} prefix={prefix} />
		</>
	);
}
