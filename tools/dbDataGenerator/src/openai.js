const { Configuration, OpenAIApi } = require('openai');
const { createTopicPageContent } = require('./editorjs');
const fs = require('fs');
const path = require('path');

const nameof = (obj) => Object.keys(obj)[0];

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getTemplate = (templateName) => fs.readFileSync(
    path.join(__dirname, '..', 'in', 'aiTemplates', `${templateName}.template`)).toString();

const summarizeTemplate = getTemplate('summarize');
const fillSummarizeTemplate = ({ content, amountOfParagraphs }) =>
    summarizeTemplate
        .replace('{{CONTENT}}', content)
        .replace('{{AMOUNT_OF_PARAGRAPHS}}', amountOfParagraphs);

const topicGenerationTemplate = getTemplate('topic_generation');
const fillTopicGenerationTemplate = ({ category, location, summary }) =>
    topicGenerationTemplate
        .replace(/{{CATEGORY}}/g, category)
        .replace(/{{LOCATION}}/g, location)
        .replace(/{{SUMMARY}}/g, summary);

module.exports.summarizeContent = async (content, amountOfParagraphs = 2) => {
    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {
                role: 'user',
                content: fillSummarizeTemplate({ content, amountOfParagraphs }),
            },
        ],
    });

    return result.data.choices[0].message.content;
}

module.exports.generateTopicPageContent = async (location, category, summary) => {
    const result = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: fillTopicGenerationTemplate({ location, category, summary }),
            },
        ],
        /*
        functions: [
            {
                name: nameof({ createTopicPageContent }),
                description: 'Completes a page of information',
                parameters: {
                    type: 'object',
                    properties: {
                        overview: {
                            type: 'string',
                            description: 'The overview of the topic',
                        },
                        problem: {
                            type: 'string',
                            description: 'The problem of the topic',
                        },
                        solution: {
                            type: 'string',
                            description: 'The solution of the topic',
                        },
                        callToAction: {
                            type: 'string',
                            description: 'The call to action of the topic',
                        },
                    },
                    required: ['overview', 'problem', 'solution', 'callToAction'],
                }
            }
        ],
        function_call: { name: nameof({ createTopicPageContent }) },
        */
    });

    const response = result.data.choices[0].message.content;
    const overviewRegex = /-- Overview --/i;
    const problemRegex = /-- Problem --/i;
    const solutionRegex = /-- Solution --/i;
    const callToActionRegex = /-- Call to Action --/i;
    const overviewMatch = response.match(overviewRegex);
    const problemMatch = response.match(problemRegex);
    const solutionMatch = response.match(solutionRegex);
    const callToActionMatch = response.match(callToActionRegex);
    if (!overviewMatch || !problemMatch || !solutionMatch || !callToActionMatch) {
        throw new Error('Could not find all sections in GPT response.');
    }

    const overview = response.substring(
        overviewMatch.index + overviewMatch[0].length,
        problemMatch.index).trim();
    const problem = response.substring(
        problemMatch.index + problemMatch[0].length,
        solutionMatch.index).trim();
    const solution = response.substring(
        solutionMatch.index + solutionMatch[0].length,
        callToActionMatch.index).trim();
    const callToAction = response.substring(
        callToActionMatch.index + callToActionMatch[0].length).trim();

    /*
    const args = JSON.parse(choice.message.function_call.arguments);
    if (!args || Object.keys(args).length === 0) {
        throw new Error('No arguments found in GPT response.');
    }
    */

    return createTopicPageContent(overview, problem, solution, callToAction);
}
