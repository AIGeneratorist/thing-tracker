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
			<p>Type: {thing.type || <i>Unknown type</i>}</p>
			<p>Description: {thing.description || <i>No description</i>}</p>
			<p>Favorite: {thing.favorited ? "Yes" : "No"}</p>
			<p>Comments: {thing.comments || <i>No comments</i>}</p>
			<p>Properties:</p>
			{
				Object.keys(thing.props).length > 0 ?
				(
					<ul>
						{Object.entries(thing.props).map(([prop, value]) => (
							<li key={prop}>
								{prop}: {value}
							</li>
						))}
					</ul>
				) : (
					<i>No properties</i>
				)
			}
		</>
	);
}
