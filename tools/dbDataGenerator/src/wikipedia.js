const wiki = require('wikipedia');
const fs = require('fs');
const path = require('path');

const heading1Regex = () => /^\s*=\s*.*=\s*$/gm;
const heading2Regex = () => /^\s*==\s*.*==\s*$/gm;
const heading3Regex = () => /^\s*===\s*.*===\s*$/gm;
const heading4Regex = () => /^\s*====\s*.*====\s*$/gm;
const heading5Regex = () => /^\s*=====\s*.*=====\s*$/gm;
const heading6Regex = () => /^\s*======\s*.*======\s*$/gm;

const headingRegexes = [
    heading1Regex,
    heading2Regex,
    heading3Regex,
    heading4Regex,
    heading5Regex,
    heading6Regex,
];

module.exports.getPageContentChunks = async (pageId, maxWordLengthPerChunk) => {
    var content = await wiki.content(pageId);

    if (!content) return [];

    if (!maxWordLengthPerChunk || content.split(' ').length <= maxWordLengthPerChunk) {
        return [ content ];
    }

    const chunks = [];

    let prefix = '';

    let reg;
    for (let i = 0; i < headingRegexes.length; i++) {
        const curReg = headingRegexes[i]();
        const matches = content.match(curReg);
        if (matches?.length > 1) {
            reg = curReg;
            break;
        } else if (matches?.length === 1) {
            prefix += matches[0];
        }
    }
    if (!reg) {
        throw new Error(`No heading regex found for page ${pageId}`);
    }
    let match = reg.exec(content);
    if (match.index !== 0) {
        chunks.push(content.substring(0, match.index));
    }
    while (match) {
        const heading = match[0];
        const headingIndex = match.index;
        match = reg.exec(content);
        let contentChunk = match
            ? content.substring(headingIndex + heading.length, match.index)
            : content.substring(headingIndex + heading.length);
        chunks.push(prefix + heading + contentChunk);
    }

    const countWords = (str) => str.split(' ').length;

    let combinedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (i === chunks.length - 1) {
            combinedChunks.push(chunk);
            break;
        }

        let newChunk = chunk;
        let newI = i + 1;
        while (newI < chunks.length && countWords(newChunk) + countWords(chunks[newI]) <= maxWordLengthPerChunk) {
            newChunk += chunks[newI];
            newI++;
        }

        i = newI - 1;
        combinedChunks.push(newChunk);
    }

    return combinedChunks;
}
