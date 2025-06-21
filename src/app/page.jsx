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
			<ul>
				{things.map(thing => (
					<li key={thing._id}>{thing.name}</li>
				))}
			</ul>
		</>
	);
}
