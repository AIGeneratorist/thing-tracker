"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {getViewURL} from "@/utils/client-utils.js";

export default function ViewOptions({sort: rawSort = "_idDesc", prefix = "/"}) {
	const [sort, setSort] = useState(rawSort);
	const router = useRouter();
	const searchParams = useSearchParams();

	function handleSortChange(newSort) {
		setSort(newSort);
		router.push(
			getViewURL(prefix, searchParams, {page: 1, newSearchParams: {sort: newSort}})
		);
	}

	return (
		<form>
			<label htmlFor="sel-sort">Sort:</label>{" "}
			<select
				name="sort"
				value={sort}
				id="sel-sort"
				onChange={ev => handleSortChange(ev.target.value)}
			>
				<option value="nameAsc">Name (A-Z)</option>
				<option value="nameDesc">Name (Z-A)</option>
				<option value="typeAsc">Type (A-Z)</option>
				<option value="typeDesc">Type (Z-A)</option>
				<option value="_idDesc">Newest</option>
				<option value="_idAsc">Oldest</option>
			</select>
		</form>
	);
}
