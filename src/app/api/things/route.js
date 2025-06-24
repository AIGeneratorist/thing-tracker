import {thingSchema, thingsCollection} from "@/db/db.js";
import {parseInputWithSchema, parseQueryParams} from "@/utils/utils.js";

export const GET = async req => {
	const parseRes = parseQueryParams(req, thingSchema);
	if (parseRes.error) {
		return Response.json(parseRes, {status: 400});
	}

	try {
		const [results, count] = await Promise.all([
			thingsCollection.find({}, parseRes.data).toArray(),
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
