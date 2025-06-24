import Link from "next/link";
import Paginator from "@/components/paginator.jsx";
import SearchBox from "@/components/search-box.jsx";
import ViewOptions from "@/components/view-options.jsx";
import ThingAddForm from "./thing-add-form.jsx";

async function getThings({sort = "_idDesc", limit = 25}) {
	const res = await fetch(`http://localhost:3000/api/things?sort=${sort}&limit=${limit}`);
	if (!res.ok) {
		throw new Error("Failed to fetch things");
	}
	return res.json();
}

export default async function Home({searchParams}) {
	const {sort, limit} = await searchParams;

	const parsedLimit = limit && parseInt(limit);

	const res = await getThings({sort, limit: parsedLimit});
	const things = res.results;
	const count = res.count;

	return (
		<>
			<h1>Thing Tracker</h1>
			<SearchBox />

			<ul>
				{things.map(thing => (
					<li key={thing._id}>
						<Link href={`/thing/${thing._id}`}>{thing.name}</Link>
					</li>
				))}
			</ul>
			<Paginator count={count} limit={parsedLimit} prefix="/" />

			<h2>View Options</h2>
			<ViewOptions sort={sort} limit={parsedLimit} prefix="/" />

			<h2>Add New Thing</h2>
			<ThingAddForm />
		</>
	);
}
