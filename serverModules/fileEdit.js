const fs = require("fs");
const conflictDelimiterRegex = /<<<<<<< HEAD[\s\S]*?>>>>>>> [\w-]+/g;
const recursiveFuzzyIndexOf = require('./fuzzySearch');

const expandToFullLines = (fileContent, startIndex, endIndex) => {
    // Expand the start index to the beginning of the line
    while (startIndex > 0 && fileContent[startIndex - 1] !== '\n') {
        startIndex--;
    }

    // Expand the end index to the end of the line
    while (endIndex < fileContent.length && fileContent[endIndex] !== '\n') {
        endIndex++;
    }

    return { startIndex, endIndex };
};

module.exports = async (fileContent, requestBody) => {
    const conflictText = requestBody.mergeText || '';
    const conflicts = conflictText.match(conflictDelimiterRegex) || [];

    if (conflicts.length > 0) {
        let unsuccessfulReplacements = [];
        let fuzzyReplacements = [];
        conflicts.forEach(conflict => {
            const parts = conflict.split("=======");
            const originalText = parts[0].replace(/<<<<<<< HEAD\n/, "");
            const replacementText = parts[1].replace(/\n>>>>>>> [\w-]+/, "");

            let startIndex = fileContent.indexOf(originalText);
            let endIndex = startIndex + originalText.length;
            const adjusted = expandToFullLines(fileContent, startIndex, endIndex);
            startIndex = adjusted.startIndex;
            endIndex = adjusted.endIndex;

            const startCounts = fileContent.split(originalText).length - 1;


            if (originalText!=="" && startCounts > 1) {
                unsuccessfulReplacements.push(`Multiple occurrences found for text: '${originalText}' found ${startCounts} times`);
                return;
            } else if (startIndex < 0) {
                const fuzzyResult = recursiveFuzzyIndexOf(fileContent, originalText);
                if (fuzzyResult.distance / originalText.length < 0.3) {
                    const adjusted = expandToFullLines(fileContent, fuzzyResult.start, fuzzyResult.end);
                    fuzzyResult.start = adjusted.startIndex;
                    fuzzyResult.end = adjusted.endIndex;
                    fuzzyReplacements.push(`Fuzzy replacement, searched for ${originalText}, found ${fuzzyResult.value}`)
                    fileContent = fileContent.substring(0, fuzzyResult.start) + replacementText + fileContent.substring(fuzzyResult.end);
                } else {
                    unsuccessfulReplacements.push(`Text not found: '${originalText}'`);
                }
                return;
            }

            fileContent = fileContent.substring(0, startIndex) + replacementText + fileContent.substring(endIndex);
        });

        return { updatedContent: fileContent, unsuccessfulReplacements, fuzzyReplacements };
    } if(conflictText.length > 0) {
        throw new Error('mergeText was not empty, but no conflict blocks were found, they are checked using regex like this /<<<<<<< HEAD[\\s\\S]*?>>>>>>> [\\w-]+/g Check what you send and try again')
    }
    return { updatedContent: fileContent, unsuccessfulReplacements: [], fuzzyReplacements: [] };
}
