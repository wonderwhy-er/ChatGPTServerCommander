const PipelineSingleton = require("./transformers.js");
function splitIntoSentences(text) {
    return text.split(/\.\s+|\?\s+|\!\s+|\s*$/).filter(Boolean) || [];
}

async function getSentenceVectors(text) {
    const sentences = splitIntoSentences(text);
    console.log("Sentences extracted:", sentences, 'from', text);
    let classifier;
    try {
        classifier = await PipelineSingleton.getInstance();
    } catch (error) {
        console.error("Error initializing classifier:", error);
        throw error;
    }
    
    const results = [];
    for (const sentence of sentences) {
        const vector = await classifier(sentence);
        console.log(sentence, vector.data);
        results.push({
            sentence: sentence.trim(),
            vector: vector.data
        });
    }

    return results;
}

module.exports = getSentenceVectors;
