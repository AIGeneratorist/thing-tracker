async function getThing(id) {
	const res = await fetch(`http://localhost:3000/api/things/${id}`);
	if (!res.ok) {
		throw new Error("Failed to fetch thing");
	}
	return res.json();
}

export default async function ThingView({params}) {
	const {id} = await params;
	const thing = await getThing(id);
	return (
		<>
			<h1>View Thing</h1>
			<p>{thing.name}</p>
			<p>ID: {thing._id}</p>
		</>
	);
}
