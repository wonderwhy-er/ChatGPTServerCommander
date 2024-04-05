const fs = require('fs');
const { checkJavaScriptFile } = require('../serverModules/checkjs');
const {stringifyError} = require("../serverModules/stringifyError");
const {log} = require("../serverModules/logger"); // Adjust the path as needed


/**
 * Edits a file based on specified line ranges to remove and lines to add.
 * @param {string} filePath - The path to the file to be edited.
 * @param {Array<{start: number, end: number}>} lineRangesToRemove - Line ranges to remove.
 * @param {Array<{line: number, content: string[]}>} additions - Lines to add and their positions.
 */
const editFile = async (filePath, lineRangesToRemove = [], additions = []) => {
    let fileHandle;
    let fileContent;
    try {
        fileHandle = await fs.promises.open(filePath, 'a+'); // Open file, 'a+' flag creates the file if it doesn't exist
        fileContent = await fileHandle.readFile('utf8');
        log(fileContent); // Process your file content as needed
    } catch (err) {
       log('Error reading or creating file:', err);
    } finally {
        if (fileHandle !== undefined) await fileHandle.close(); // Close the file handle regardless of success or error
    }

    if (lineRangesToRemove.length > 0 || additions.length > 0) {
        // Create a backup of the original file with a timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFilePath = `${filePath}.backup-${timestamp}`;
        await fs.promises.writeFile(backupFilePath, fileContent);

        let lines = fileContent.split('\n');
        // Remove specified line ranges
        lineRangesToRemove.forEach(range => {
            lines = [...lines.slice(0, range.start - 1), ...lines.slice(range.end)];
        });
        // Add new lines
        additions.forEach(addition => {
            lines.splice(addition.line - 1, 0, ...addition.content);
        });
        await fs.promises.writeFile(filePath, lines.join('\n'));
    } else {
        return fileContent;
    }

    // Re-read the file content to return it
    return fs.promises.readFile(filePath, 'utf8');
};

/**
 * @openapi
 * /api/edit-or-read-file:
 *   post:
 *     summary: Edit or read a file and get its content with line numbers
 *     description: Takes a file path, optional line ranges to remove, and optional lines to add, performs the edits, and returns the file content with line numbers
 *     operationId: editOrReadFile
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
 *               lineRangesToRemove:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: integer
 *                     end:
 *                       type: integer
 *                 description: Array of start and end line numbers to remove
 *               additions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     line:
 *                       type: integer
 *                     content:
 *                       type: array
 *                       items:
 *                         type: string
 *                 description: Array of lines to add and their respective positions
 *     responses:
 *       200:
 *         description: File edited or read was successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: file content with line numbers
 *       400:
 *         description: There was an error in editing file
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: details of the error including file content with line numbers
 */
const editFileHandler = async (req, res) => {
    const { filePath, lineRangesToRemove, additions } = req.body;
    try {
        let updatedContent = await editFile(filePath, lineRangesToRemove, additions);
        updatedContent = updatedContent.split('\n').map((line, index) => {
            return `${index + 1}: ${line}`;
        }).join('\n');
        if (filePath.endsWith('.js')) {
            let issues = await checkJavaScriptFile(filePath);
            if (issues.length > 0) {
                res.status(400).send('Issues found in the file: \n' + JSON.stringify(issues) + '\n File content with line numbers: ' + updatedContent);
                return;
            }
        }
        res.type('text/plain').send(`File content with line numbers${lineRangesToRemove || additions ? ". Check if changes look correct" : ""}: \n` + updatedContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `An error occurred while editing the file: ${stringifyError(error)}` });
    }
};

module.exports = editFileHandler;