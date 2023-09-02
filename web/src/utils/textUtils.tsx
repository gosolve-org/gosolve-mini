/* eslint-disable react/no-array-index-key */
import { Fragment } from 'react';

export const withBreaks = (content: string | null) =>
    content == null
        ? []
        : content.split('\n').flatMap((line, index) => {
              return index > 0
                  ? [<br key={`br-${index}`} />, <Fragment key={index}>{line}</Fragment>]
                  : [<Fragment key={index}>{line}</Fragment>];
          });

export const trimToFirstLine = (content: string | null) => {
    if (content == null) return null;
    const lines = content.split('\n');
    return lines.length <= 1 ? lines[0] : `${lines[0]}…`;
};

export const urlPartToReadable = (content: string | null) => {
    if (content == null) return null;
    return decodeURIComponent(content).replaceAll('-', ' ');
};
export const toUrlPart = (content: string | null) => {
    if (content == null) return null;
    return encodeURIComponent(content.replaceAll(' ', '-'));
};
