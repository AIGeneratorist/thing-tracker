"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function ThingDeleteContainer({thingId}) {
	const [isOpen, setOpen] = useState(false);
	const router = useRouter();

	async function handleDelete() {
		const res = await fetch(`http://localhost:3000/api/things/${thingId}`, {
			method: "DELETE"
		});

		if (!res.ok) {
			throw new Error("Failed to delete thing");
		}

		router.back();
	}

	return (
		<>
			<button disabled={isOpen} onClick={() => setOpen(true)}>Delete</button>
			{isOpen && (
				<>
					<p>Are you sure you want to delete this thing?</p>
					<button onClick={handleDelete}>Yes</button>
					<button onClick={() => setOpen(false)}>No</button>
				</>
			)}
		</>
	);
}
