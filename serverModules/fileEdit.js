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

const parseConflicts = (conflictText) => {
    const conflicts = conflictText.match(conflictDelimiterRegex) || [];
    return conflicts.map(conflict => {
        const parts = conflict.split("=======");
        const originalText = parts[0].replace(/<<<<<<< HEAD\n/, "");
        const replacementText = parts[1].replace(/\n>>>>>>> [\w-]+/, "");
        return { originalText, replacementText };
    });
};

const applyReplacements = async (fileContent, replacements) => {
    let unsuccessfulReplacements = [];
    let fuzzyReplacements = [];

    replacements.forEach(({ originalText, replacementText }) => {
        let startIndex = fileContent.indexOf(originalText);
        let endIndex = startIndex + originalText.length;
        const adjusted = expandToFullLines(fileContent, startIndex, endIndex);
        startIndex = adjusted.startIndex;
        endIndex = adjusted.endIndex;

        const startCounts = fileContent.split(originalText).length - 1;

        if (originalText !== "" && startCounts > 1) {
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
};

const mergeText = async (fileContent, replacements) => {
    if (replacements.length > 0) {
        return await applyReplacements(fileContent, replacements);
    } else {
        return { updatedContent: fileContent, unsuccessfulReplacements: [], fuzzyReplacements: [] };
    }
};

module.exports = {
    applyReplacements,
    mergeText,
    parseConflicts,
};



