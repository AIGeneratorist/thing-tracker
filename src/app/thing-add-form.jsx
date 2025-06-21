"use client";

import {useState} from "react";

export default function ThingAddForm() {
	const [name, setName] = useState("");

	async function handleSubmit(ev) {
		ev.preventDefault();

		const res = await fetch("http://localhost:3000/api/things", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({name})
		})

		if (!res.ok) {
			throw new Error("Failed to add thing");
		}

		setName("");
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="input-name">Name:</label>{" "}
			<input
				type="text"
				name="name"
				value={name}
				autoComplete="off"
				id="input-name"
				onChange={e => setName(e.target.value)}
			/><br />
			<button type="submit">Add</button>
		</form>
	);
}
