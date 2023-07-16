const { convert } = require('html-to-text');

const convertHtmlToText = (html) => {
    return convert(html, {
        wordwrap: false,
    });
}
