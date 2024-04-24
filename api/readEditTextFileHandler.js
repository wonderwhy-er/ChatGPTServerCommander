const fs = require('fs');
const { checkJavaScriptFile } = require('../serverModules/checkjs');
const { stringifyError } = require("../serverModules/stringifyError");
const {log} = require("../serverModules/logger");
const {createToken} = require("../serverModules/fileAccessHandler");
const {getCurrentDirectory} = require("./terminal");
const fileEdit = require('../serverModules/fileEdit');

const replaceTextInSection = async (filePath, requestBody) => {
    let fileHandle;
    let fileContent = '';

    // Check if the file exists only when replacements are empty
    if ((!requestBody.mergeText || requestBody.mergeText.length === 0) && !fs.existsSync(filePath)) {
        throw new Error('File does not exist, if you want to create it ask for initial content and all again.'); // File does not exist and no replacements specified, so do nothing
    }

    try {
        fileHandle = await fs.promises.open(filePath, 'a+'); // Open file, 'a+' flag still creates the file if it doesn't exist
        fileContent = await fileHandle.readFile('utf8');
    } catch (err) {
        log('Error reading or creating file:', err);
    } finally {
        if (fileHandle !== undefined) await fileHandle.close(); // Close the file handle regardless of success or error
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = `${filePath}.backup-${timestamp}`;
    await fs.promises.writeFile(backupFilePath, fileContent);

    const result = await fileEdit(fileContent, requestBody);

    await fs.promises.writeFile(filePath, result.updatedContent);

    return result;
};

/**
 * @openapi
 * /api/read-or-edit-file:
 *   post:
 *     summary: Read or modify a file using merge conflict-style blocks
 *     description: Accepts a file path and a merge conflict text block, processes modifications, and returns the updated file content
 *     operationId: replaceTextInSection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: Path to the file to be edited
 *               mergeText:
 *                 type: string
 *                 description: optional parameter text containing merge conflict-style modifications for the file, if omitted it operation will just read and return file
 *     responses:
 *       200:
 *         description: File modification was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Updated file content and urls
 *       400:
 *         description: There was an error in the text replacement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Details of the error along with file current content and access url
 */
const readEditTextFileHandler = (getURL) => async (req, res) => {
    let { filePath } = req.body;
    filePath = (await getCurrentDirectory()) + '/' + filePath; // Adjusting filePath to be relative to the current directory
    try {
        let { updatedContent, unsuccessfulReplacements } = await replaceTextInSection(filePath, req.body);

        const url = createToken(getURL, filePath);
        let responseMessage = `File url: ${url}\nChanged diff url: ${createToken(getURL, filePath)}?diff=1\nFile content: ${updatedContent}`;

        // Check if the updated file content has any JavaScript issues
        if (filePath.endsWith('.js')) {
            let issues = await checkJavaScriptFile(filePath);
            if (issues.length > 0) {
                responseMessage += 'Issues found in the file: \n' + JSON.stringify(issues);
                res.status(400).send(responseMessage);
                return;
            }
        }

        // Construct the response message

        
        // Include information about unsuccessful replacements, if any
        if (unsuccessfulReplacements.length > 0) {
            let unsuccessfulMessages = unsuccessfulReplacements.join("; ");
            responseMessage += `\nUnsuccessful replacements due to missing texts: ${unsuccessfulMessages}`;
            res.status(400).send(responseMessage);
            return;
        }

        res.type('text/plain').send(responseMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: stringifyError(error) });
    }
};

module.exports = readEditTextFileHandler;
