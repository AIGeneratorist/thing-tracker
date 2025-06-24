import {thingSchema, thingsCollection} from "@/db/db.js";
import {parseQueryParams} from "@/utils/utils.js";

function parseSearchQuery(query) {
	const filters = {};
	const defaultFilterWords = [];

	const queryRegex = /(\w+):(?:"(.+?)"|(\S+))|(\S+)/g;
	let match;
	while (match = queryRegex.exec(query)) {
		const operator = match[1];
		if (operator) {
			const foundFieldType = thingSchema[operator];
			if (foundFieldType) {
				if (match[3] == "null") {
					filters[operator] = null;
				} else {
					const keywords = match[2] || match[3];
					if (foundFieldType == "boolean") {
						filters[operator] = !!keywords && keywords.toLowerCase() != "false";
					} else if (foundFieldType == "string") {
						filters[operator] = {
							$regex: new RegExp(keywords.replace(/([\^$\\.*+?()[\]{}|])/g, "\\$1"), "i")
						};
					}
				}
			}
		} else {
			defaultFilterWords.push(match[4].replace(/([\^$\\.*+?()[\]{}|])/g, "\\$1"));
		}
	}

	return {filters, defaultFilterWords};
}

export const GET = async (req, {params}) => {
	const {query} = await params;
	const {filters, defaultFilterWords} = parseSearchQuery(query);
	if (Object.keys(filters).length == 0 && defaultFilterWords.length == 0) {
		return Response.json({results: [], count: 0});
	}

	const parseRes = parseQueryParams(req, thingSchema);
	if (parseRes.error) {
		return Response.json(parseRes, {status: 400});
	}

	const filterOptions = {
		...filters,
		name: {
			$regex: new RegExp(defaultFilterWords.join(" "), "i")
		}
	};

	try {
		const [results, count] = await Promise.all([
			thingsCollection.find(filterOptions, parseRes.data).toArray(),
			thingsCollection.countDocuments(filterOptions)
		]);
		return Response.json({results, count});
	} catch (err) {
		return Response.json({error: `Server error: ${err}`}, {status: 500});
	}
};
