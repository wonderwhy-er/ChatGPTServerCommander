const fs = require("fs");
const conflictDelimiterRegex = /<<<<<<< HEAD[\s\S]*?>>>>>>> [\w-]+/g;
const recursiveFuzzyIndexOf = require('./fuzzySearch');

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
            const startCounts = fileContent.split(originalText).length - 1;


            if (startCounts > 1) {
                unsuccessfulReplacements.push(`Multiple occurrences found for text: '${originalText}' found ${startCounts} times`);
                return;
            } else if (startIndex < 0) {
                const fuzzyResult = recursiveFuzzyIndexOf(fileContent, originalText);
                if (fuzzyResult.distance / originalText.length < 0.3) {
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
    }
    return { updatedContent: fileContent, unsuccessfulReplacements: [], fuzzyReplacements: [] };
}
