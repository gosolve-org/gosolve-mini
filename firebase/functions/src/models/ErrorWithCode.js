class ErrorWithCode extends Error {
    code;

    constructor(code) {
        super();

        this.code = code;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ErrorWithCode.prototype);
    }
}

module.exports = ErrorWithCode;
