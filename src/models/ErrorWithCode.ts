export class ErrorWithCode extends Error {
    code: string;

    constructor(code: string) {
        super();

        this.code = code;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ErrorWithCode.prototype);
    }
}
