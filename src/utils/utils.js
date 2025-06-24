export function parseInputWithSchema(input, schema, fillNulls = true) {
	const acc = {};
	for (const field in schema) {
		const inputField = input[field];
		const fieldType = schema[field];
		if (inputField) {
			if (fieldType == "boolean") {
				acc[field] = !!inputField && inputField.toString().toLowerCase() != "false";
			} else if (fieldType == "object") {
				acc[field] = {...inputField};
			} else if (fieldType == "string") {
				acc[field] = inputField.toString();
			}
		} else if (fillNulls) {
			acc[field] = fieldType == "object" ? {} : null;
		}
	}
	return acc;
}

export function parseQueryParams(req, schema) {
	const rawPage = req.nextUrl.searchParams.get("page");
	let page;
	if (rawPage) {
		page = parseInt(rawPage);
		if (isNaN(page) || page < 1) {
			return {error: "Invalid page"};
		}
	} else {
		page = 1;
	}

	const rawLimit = req.nextUrl.searchParams.get("limit");
	let limit;
	if (rawLimit) {
		limit = parseInt(rawLimit);
		if (isNaN(limit) || limit < 1) {
			return {error: "Invalid limit"};
		}
	} else {
		limit = 25;
	}

	const rawSort = req.nextUrl.searchParams.get("sort");
	let sortField;
	let sortOrder;
	if (rawSort) {
		if (rawSort.endsWith("Desc")) {
			sortField = rawSort.slice(0, -4);
			sortOrder = "desc";
		} else if (rawSort.endsWith("Asc")) {
			sortField = rawSort.slice(0, -3);
			sortOrder = "asc";
		} else {
			sortField = rawSort;
			sortOrder = "asc";
		}

		if (!schema[sortField] && sortField != "_id") {
			return {error: "Invalid sort field"};
		}
	} else {
		sortField = "_id";
		sortOrder = "desc";
	}

	return {
		data: {
			limit,
			skip: (page - 1) * limit,
			sort: [[sortField, sortOrder]]
		}
	};
}
