const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const AI_NOTICE = "Notice: This page has been created with summarized text and AI and may not"
    + " be accurate. When this page has been reviewed by a goSolve editor, sources"
    + " will be added and this notice will be removed.";

const createHeader = (title, level = 1) => ({
    id: nanoid(),
    type: 'header',
    data: {
        text: title,
        level,
    },
});

const createParagraph = (text) => ({
    id: nanoid(),
    type: 'paragraph',
    data: {
        text,
    },
});

const createDelimiter = () => ({
    id: nanoid(),
    type: 'delimiter',
    data: {},
});

const splitText = (text) => text
    .split('\n')
    .filter(el => el.trim() !== '');

module.exports.createTopicPageContent = (overview, problem, solution, callToAction) => {
    var content = {
        time: Date.now(),
        blocks: [],
    };

    content.blocks.push(createHeader('Overview'));
    splitText(overview).forEach((txt) => content.blocks.push(createParagraph(txt)));
    content.blocks.push(createHeader('Problem'));
    splitText(problem).forEach((txt) => content.blocks.push(createParagraph(txt)));
    content.blocks.push(createHeader('Solution'));
    splitText(solution).forEach((txt) => content.blocks.push(createParagraph(txt)));
    content.blocks.push(createHeader('Call to action'));
    splitText(callToAction).forEach((txt) => content.blocks.push(createParagraph(txt)));
    content.blocks.push(createDelimiter());
    content.blocks.push(createParagraph(AI_NOTICE));

    content.version = "2.26.4";
    return content;
};
