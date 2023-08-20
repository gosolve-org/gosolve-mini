import { Fragment } from "react";

export const withBreaks = (content: string) => !content ? [] : content
    .split('\n')
    .flatMap((line, index) => {
        return index > 0
            ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>]
            : [<Fragment key={index}>{line}</Fragment>]
    });

export const trimToFirstLine = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.length <= 1 ? lines[0] : lines[0] + '…';
}

export const urlPartToReadable = (content: string) => {
    if (!content) return null;
    return decodeURIComponent(content).replaceAll("-", " ");
};
export const toUrlPart = (content: string) => {
    if (!content) return null;
    return encodeURIComponent(content.replaceAll(" ", "-"));
}
