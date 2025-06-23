import Link from "next/link";
import Paginator from "@/components/paginator.jsx";
import SearchBox from "@/components/search-box.jsx";
import ThingAddForm from "../../thing-add-form.jsx";

async function getThings(page) {
	const res = await fetch(`http://localhost:3000/api/things?page=${page}`);
	if (!res.ok) {
		throw new Error("Failed to fetch things");
	}
	return res.json();
}

export default async function ThingPageView({params}) {
	const {page} = await params;
	const parsedPage = parseInt(page);

	const res = await getThings(parsedPage);
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
			<Paginator page={parsedPage} count={count} prefix="/" />

			<h2>Add New Thing</h2>
			<ThingAddForm />
		</>
	);
}
