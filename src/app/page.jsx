import Link from "next/link";
import SearchBox from "@/components/search-box.jsx";
import ThingAddForm from "./thing-add-form.jsx";

async function getThings() {
	const res = await fetch("http://localhost:3000/api/things");
	if (!res.ok) {
		throw new Error("Failed to fetch things");
	}
	return res.json();
}

export default async function Home() {
	const things = await getThings();
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

			<h2>Add New Thing</h2>
			<ThingAddForm />
		</>
	);
}
