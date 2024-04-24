const fs = require("fs");

module.exports = async (fileContent, requestBody) => {
    const replacements = requestBody.replacements || [];
    if (replacements.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFilePath = `${filePath}.backup-${timestamp}`;
        await fs.promises.writeFile(backupFilePath, fileContent);

        let unsuccessfulReplacements = [];
        replacements.forEach((replacement) => {
            let {startText, endText} = replacement;
            let startIndex = fileContent.indexOf(startText);
            let endIndex = fileContent.indexOf(endText, startIndex);
            const startCounts = fileContent.split(startText).length;
            const endCounts = fileContent.split(endText).length;


            if (startCounts > 2 || endCounts > 2) {
                if(startCounts > 2 && endCounts > 2) {
                    unsuccessfulReplacements.push(`Multiple occurrences found for texts: startText: '${startText}' found ${startCounts - 1} times, endText: '${endText}' found ${endCounts - 1} times`);
                } else if(startCounts > 2) {
                    unsuccessfulReplacements.push(`Multiple occurrences found for texts: startText: '${startText}' found ${startCounts - 1}`);
                } else {
                    unsuccessfulReplacements.push(`Multiple occurrences found for texts: endText: '${endText}' found ${endCounts - 1} times`);
                }

                return; // Skip replacement for this iteration
            } else if (startIndex < 0 || endIndex < 0) {
                if (startIndex < 0 && endText < 0) {
                    unsuccessfulReplacements.push(`Text not found: both startText: '${startText}' and endText: '${endText}'`);
                } if(startIndex < 0) {
                    unsuccessfulReplacements.push(`Text not found. startText: '${startText}`);
                } else {
                    unsuccessfulReplacements.push(`Text not found: endText: '${endText}'`);
                }

                return; // Skip replacement for this iteration
            }

            fileContent = fileContent.substring(0, startIndex) + replacement.replacementText + fileContent.substring(endIndex);
        });

        await fs.promises.writeFile(filePath, fileContent);

        // Return unsuccessful replacements if any
        if (unsuccessfulReplacements.length > 0) {
            return { updatedContent: fileContent, unsuccessfulReplacements };
        }

        return { updatedContent: fileContent, unsuccessfulReplacements: [] };
    }
    return { updatedContent: fileContent, unsuccessfulReplacements: [] };
}
