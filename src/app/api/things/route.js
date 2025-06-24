import {thingSchema, thingsCollection} from "@/db/db.js";
import {parseInputWithSchema} from "@/utils/utils.js";

export const GET = async req => {
	const rawPage = req.nextUrl.searchParams.get("page");
	let page;
	if (rawPage) {
		page = parseInt(rawPage);
		if (isNaN(page) || page < 1) {
			return Response.json({error: "Invalid page"}, {status: 400});
		}
	} else {
		page = 1;
	}

	const rawLimit = req.nextUrl.searchParams.get("limit");
	let limit;
	if (rawLimit) {
		limit = parseInt(rawLimit);
		if (isNaN(limit) || limit < 1) {
			return Response.json({error: "Invalid limit"}, {status: 400});
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

		if (!thingSchema[sortField] && sortField != "_id") {
			return Response.json({error: "Invalid sort field"}, {status: 400});
		}
	} else {
		sortField = "_id";
		sortOrder = "desc";
	}

	try {
		const [results, count] = await Promise.all([
			thingsCollection.find({}, {
				limit,
				skip: (page - 1) * limit,
				sort: [[sortField, sortOrder]]
			}).toArray(),
			thingsCollection.countDocuments()
		]);
		return Response.json({results, count});
	} catch (err) {
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};

export const POST = async req => {
	try {
		const body = await req.json();
		if (!body.name) {
			return Response.json({error: "Missing name"}, {status: 400});
		}

		const thingData = parseInputWithSchema(body, thingSchema);
		const thing = await thingsCollection.insertOne(thingData);

		return Response.json(thing);
	} catch (err) {
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};
