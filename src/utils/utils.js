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
