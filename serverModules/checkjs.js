const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
function checkJavaScriptFile(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        try {
            esprima.parseScript(fileContent);
            resolve([]); // No syntax errors
        } catch (error) {
            resolve([{ line: error.lineNumber, message: error.description }]);
        }
    });
}

module.exports = { checkJavaScriptFile };

