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

	try {
		const [results, count] = await Promise.all([
			thingsCollection.find({}, {
				limit: 25,
				skip: (page - 1) * 25
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
