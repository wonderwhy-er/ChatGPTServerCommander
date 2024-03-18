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

async function handleSentenceVectors(req, res) {
    const { text } = req.body;
    if (!text) {
        res.status(400).send({ error: "Text is required." });
        return;
    }

    try {
        const results = await getSentenceVectors(text);
        log(results);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: "Failed to process the request." });
    }
}

module.exports = handleSentenceVectors;
