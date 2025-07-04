import {MongoClient} from "mongodb";
import config from "../../config.json" with {type: "json"};

const dbHost = config.mongodbHost || "localhost";
const dbPort = config.mongodbPort || 27017;

export const client = new MongoClient(`mongodb://${dbHost}:${dbPort}`);
export const db = client.db(config.mongodbDatabase);

export const thingsCollection = db.collection("things");
export const thingSchema = {
	name: "string",
	type: "string",
	description: "string",
	favorited: "boolean",
	comments: "string",
	props: "object"
};

await client.connect();
