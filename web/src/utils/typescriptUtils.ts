// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertUnreachable = (x: never): never => {
    throw new Error("Didn't expect to get here");
};
