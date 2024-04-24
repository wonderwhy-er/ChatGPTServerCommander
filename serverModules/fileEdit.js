const fs = require("fs");
const conflictDelimiterRegex = /<<<<<<< HEAD[\s\S]*?>>>>>>> [\w-]+/g;

module.exports = async (fileContent, requestBody) => {
    const conflictText = requestBody.mergeText || '';
    const conflicts = conflictText.match(conflictDelimiterRegex) || [];

    if (conflicts.length > 0) {

        let unsuccessfulReplacements = [];
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
                unsuccessfulReplacements.push(`Text not found: '${originalText}'`);
                return;
            }

            fileContent = fileContent.substring(0, startIndex) + replacementText + fileContent.substring(endIndex);
        });

        return { updatedContent: fileContent, unsuccessfulReplacements };
    }
    return { updatedContent: fileContent, unsuccessfulReplacements: [] };
}
