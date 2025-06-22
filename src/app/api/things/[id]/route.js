import {BSON, ObjectId} from "mongodb";
import {thingsCollection} from "@/db/db.js";

const allowedFields = ["name", "type", "description", "favorited", "comments", "props"];

export const GET = async (req, {params}) => {
	const {id} = await params;
	try {
		const thing = await thingsCollection.findOne({_id: new ObjectId(id)});
		if (!thing) {
			return Response.json({error: "Thing not found"}, {status: 404});
		}
		return Response.json(thing);
	} catch (err) {
		if (err instanceof BSON.BSONError) {
			return Response.json({error: "Invalid ID"}, {status: 404});
		}
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};

export const PATCH = async (req, {params}) => {
	const {id} = await params;
	try {
		const body = await req.json();

		const newFields = allowedFields.reduce((acc, field) => {
			if (body[field]) {
				acc[field] = body[field];
			}
			return acc;
		}, {});
		if (Object.keys(newFields).length == 0) {
			return Response.json({error: "Invalid field name(s)"}, {status: 400});
		}

		const {matchedCount} = await thingsCollection.updateOne({_id: new ObjectId(id)}, {$set: newFields});
		if (matchedCount == 0) {
			return Response.json({error: "Thing not found"}, {status: 404});
		}

		return new Response();
	} catch (err) {
		if (err instanceof BSON.BSONError) {
			return Response.json({error: "Invalid ID"}, {status: 404});
		}
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};

export const DELETE = async (req, {params}) => {
	const {id} = await params;
	try {
		const {deletedCount} = await thingsCollection.deleteOne({_id: new ObjectId(id)});
		if (deletedCount == 0) {
			return Response.json({error: "Thing not found"}, {status: 404});
		}
		return new Response();
	} catch (err) {
		if (err instanceof BSON.BSONError) {
			return Response.json({error: "Invalid ID"}, {status: 404});
		}
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};
