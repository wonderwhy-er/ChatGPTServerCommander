const fs = require('fs');
const path = require('path');
const espree = require('espree');
function checkJavaScriptFile(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        try {
            espree.parse(fileContent, {
                ecmaVersion: "latest", // or whichever ECMAScript version you are targeting
                loc: true,  // Enable line/column location information
                sourceType: "module",
            });
            resolve([]); // No syntax errors
        } catch (error) {
            if (error.message.includes("'import' and 'export'")) {
                try {
                    espree.parse(fileContent, {
                        ecmaVersion: "latest", // or whichever ECMAScript version you are targeting
                        loc: true,  // Enable line/column location information
                        sourceType: "script",
                    });
                } catch(error) {
                    resolve([{ line: error.lineNumber, column: error.column, message: error.message }]);
                }
            } else {
                resolve([{ line: error.lineNumber, column: error.column, message: error.message }]);
            }
        }
    });
}

module.exports = { checkJavaScriptFile };