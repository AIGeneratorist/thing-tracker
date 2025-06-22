import {thingSchema, thingsCollection} from "@/db/db.js";
import {parseInputWithSchema} from "@/utils/utils.js";

export const GET = async () => {
	try {
		const things = await thingsCollection.find().toArray();
		return Response.json(things);
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
