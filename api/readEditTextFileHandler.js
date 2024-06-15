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


    const result = await fileEdit(fileContent, requestBody);

    await fs.promises.writeFile(filePath, result.updatedContent);

    return result;
};

/**
 * @openapi
 * /api/read-or-edit-file:
 *   get:
 *      operationId: readTextInFile
 *      summary: Read a file content
 *      parameters:
 *        - in: query
 *          name: filePath
 *          required: true
 *          schema:
 *            type: string
 *          description: Path to the file to be read
 *      responses:
 *        200:
 *          description: File read successfully
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *        400:
 *          description: Error reading the file
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    description: Error message explaining the reason for failure
 *   post:
 *     summary: Modify a file using merge conflict-style blocks
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
 *                 description: parameter text containing merge conflict-style modifications for the file using <<<<<<< HEAD\nold content\n=======\nnew content\n>>>>>>> change label
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
    let filePath;
    let body = {}; // Initialize with an empty object for safety

    if (req.method === 'GET') {
        filePath = req.query.filePath; // Get the file path from query parameters
        body = { filePath }; // Mimic the structure expected by replaceTextInSection
    } else if (req.method === 'POST') {
        filePath = req.body.filePath; // Get the file path from request body
        body = req.body; // Use the full request body for POST requests
    }

    filePath = (await getCurrentDirectory()) + '/' + filePath;
    try {
        let { updatedContent, unsuccessfulReplacements, fuzzyReplacements } = await replaceTextInSection(filePath, body);

        const url = createToken(getURL, filePath);
        let responseMessage = `
        File url: ${url}
        Changed diff url: ${createToken(getURL, filePath)}?diff=1`;

        if (fuzzyReplacements.length > 0) {
            responseMessage += `Fuzzy replacements: ${fuzzyReplacements.join('\n')}`
        }

        if (filePath.endsWith('.js')) {
            let issues = await checkJavaScriptFile(filePath);
            if (issues.length > 0) {
                responseMessage += 'Issues found in the file: \n' + JSON.stringify(issues);
                res.status(400).send(responseMessage);
                return;
            }
        }

        if (unsuccessfulReplacements.length > 0) {
            let unsuccessfulMessages = unsuccessfulReplacements.join("; ");
            responseMessage += `\nUnsuccessful replacements due to missing texts: ${unsuccessfulMessages}`;
            res.status(400).send(responseMessage);
            return;
        }

        responseMessage+= `\nFile content: ${updatedContent}`;

        // Include information about unsuccessful replacements, if any

        res.type('text/plain').send(responseMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: stringifyError(error) });
    }
};

module.exports = readEditTextFileHandler;

