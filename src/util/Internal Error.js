const isObject = require("./isObject.js");

/**
 * An internalized error used by atils.
 * @class InternalError @extends Error
 * @introduced 3.0.0, December 2022
 * @maintained
 */
class InternalError extends Error {
    /**
     * Constructor method for the InternalError Class.
     * @param {Object} InternalErrorOptions The options for the Error.
     *     @param {String} InternalErrorOptions.name The name of the Error.
     *     @param {String} InternalErrorOptions.message The message of the Error.
     *     @param {Boolean} InternalErrorOptions.stackTrace Whether the Stack Trace for the Error will be displayed.
     *     @param {Boolean} InternalErrorOptions.date Whether the Date the Error was emitted will be shown.
     */
    constructor(InternalErrorOptions) {
        if(isObject(InternalErrorOptions) === false) throw new InternalError({
            name: "Invalid Options",
            message: "The provided options were not valid for this utility.",
            stackTrace: true,
            date: true,
        });

        const options = Object.assign({
            name: "Invalid_Error_Assessment",
            message: "An Error was generated, but no information was provided.",
            stackTrace: true,
            date: true,
        }, InternalErrorOptions);

        if(options.date && options.date === true) {
            options.message = options.message + `\n\x1b[2m\x1b[35m${new Date().toString()}\x1b[0m`;
        }

        super(`\x1b[33m${options.message}\x1b[0m`);
        this.name = `\x1b[31m${options.name}\x1b[0m`;

        if(options.stackTrace === false) {
            this.stack = undefined;
        }
    }
}

module.exports = InternalError;