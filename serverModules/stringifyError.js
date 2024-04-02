function stringifyError(err) {
    if (!(err instanceof Error)) throw new TypeError("Only Error instances can be stringified");

    const errorObject = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    };

    // Add any additional properties that are specific to the Error type
    // or the environment (such as 'code' in Node.js errors)
    if ('code' in err) {
        errorObject.code = err.code;
    }

    // Convert to a JSON string
    return JSON.stringify(errorObject, null, 2);
}

module.exports = {
    stringifyError
}
