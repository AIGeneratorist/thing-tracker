"use client";

import {useState} from "react";

export default function ThingAddForm() {
	const [inputData, setInputData] = useState({
		name: "",
		type: "",
		description: "",
		favorited: false,
		comments: ""
	});
	const [props, setProps] = useState([]);
	const [nextPropId, setNextPropId] = useState(0);

	async function handlePropAdd() {
		setProps([
			...props,
			{id: nextPropId, name: "", value: ""}
		]);
		setNextPropId(nextPropId + 1);
	}

	async function handlePropChange(propId, name, value) {
		setProps(
			props.map(prop => {
				return prop.id == propId ? {id: prop.id, name, value} : prop
			})
		);
	}

	async function handlePropRemove(propId) {
		setProps(props.filter(prop => prop.id != propId));
	}

	async function handleSubmit(ev) {
		ev.preventDefault();

		const res = await fetch("http://localhost:3000/api/things", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				...inputData,
				type: inputData.type || null,
				description: inputData.description || null,
				comments: inputData.comments || null,
				props: props
					.filter(prop => prop.name != "" && prop.value != "")
					.reduce((acc, prop) => {
						acc[prop.name] = prop.value;
						return acc;
					}, {})
			})
		})

		if (!res.ok) {
			throw new Error("Failed to add thing");
		}

		setInputData({
			name: "",
			type: "",
			description: "",
			favorited: false,
			comments: ""
		})
		setProps([]);
	}

	const propInputs = props.map(({id, name, value}) => (
		<div key={id}>
			<input
				type="text"
				name={`prop-${id}-name`}
				value={name}
				onChange={e => handlePropChange(id, e.target.value, value)}
			/>
			<input
				type="text"
				name={`prop-${id}-value`}
				value={value}
				onChange={e => handlePropChange(id, name, e.target.value)}
			/>
			<button onClick={() => handlePropRemove(id)}>&times;</button>
		</div>
	));

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="input-name">Name:</label>{" "}
			<input
				type="text"
				name="name"
				value={inputData.name}
				autoComplete="off"
				id="input-name"
				onChange={ev => setInputData({...inputData, name: ev.target.value})}
			/><br />

			<label htmlFor="input-type">Type:</label>{" "}
			<input
				type="text"
				name="type"
				value={inputData.type}
				id="input-type"
				onChange={ev => setInputData({...inputData, type: ev.target.value})}
			/><br />

			<label htmlFor="input-description">Description:</label>{" "}
			<input
				type="text"
				name="description"
				value={inputData.description}
				autoComplete="off"
				id="input-description"
				onChange={ev => setInputData({...inputData, description: ev.target.value})}
			/><br />

			<label htmlFor="chk-favorited">Favorite:</label>{" "}
			<input
				type="checkbox"
				name="favorited"
				checked={inputData.favorited}
				id="chk-favorited"
				onChange={ev => setInputData({...inputData, favorited: ev.target.checked})}
			/><br />

			<label htmlFor="ta-comments">Comments:</label>{" "}
			<textarea
				name="comments"
				value={inputData.comments}
				id="ta-comments"
				onChange={ev => setInputData({...inputData, comments: ev.target.value})}
			/><br />

			Properties:
			{propInputs}<br />
			<button type="button" onClick={handlePropAdd}>Add Property</button><br />

			<button type="submit">Add</button>
		</form>
	);
}
