import {ObjectId} from "mongodb";
import {thingsCollection} from "@/db/db.js";

const allowedFields = ["name", "type", "description", "favorited", "comments", "props"];

export const GET = async (req, {params}) => {
	const {id} = await params;
	const thing = await thingsCollection.findOne({_id: new ObjectId(id)});
	return Response.json(thing);
};

export const PATCH = async (req, {params}) => {
	const {id} = await params;
	const body = await req.json();

	const newFields = allowedFields.reduce((acc, field) => {
		if (body[field]) {
			acc[field] = body[field];
		}
		return acc;
	}, {});

	await thingsCollection.updateOne({_id: new ObjectId(id)}, {$set: newFields});
	return new Response();
};

export const DELETE = async (req, {params}) => {
	const {id} = await params;
	await thingsCollection.deleteOne({_id: new ObjectId(id)});
	return new Response();
};
