const fs = require('fs');
const { checkJavaScriptFile } = require('../serverModules/checkjs');
const {stringifyError} = require("../serverModules/stringifyError"); // Adjust the path as needed


/**
 * Edits a file based on specified line ranges to remove and lines to add.
 * @param {string} filePath - The path to the file to be edited.
 * @param {Array<{start: number, end: number}>} lineRangesToRemove - Line ranges to remove.
 * @param {Array<{line: number, content: string[]}>} additions - Lines to add and their positions.
 */
const editFile = async (filePath, lineRangesToRemove = [], additions = []) => {
    let fileContent = await fs.promises.readFile(filePath, 'utf8');
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

    // Re-read the file content to return it
    return fs.promises.readFile(filePath, 'utf8');
};

/**
 * @openapi
 * /api/edit-file:
 *   post:
 *     summary: Edit a file and return updated content
 *     description: Takes a file path, line ranges to remove, and lines to add, performs the edits, and returns the updated file content.
 *     operationId: editFile
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
 *         description: File edited successfully with updated content returned for review
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: The updated file content
*        400:
 *          description: Errors encountered after editing file
 *        content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: schema containing issues and updated file content
 */
const editFileHandler = async (req, res) => {
    const { filePath, lineRangesToRemove, additions } = req.body;
    try {
        let updatedContent = await editFile(filePath, lineRangesToRemove, additions);
        updatedContent = updatedContent.split('\n').map((line, index) => {
            return `${index}: ${line}`;
        }).join('\n');
        let issues = [];
        if (filePath.endsWith('.js')) {
            issues = await checkJavaScriptFile(filePath);
            if (issues.length > 0) {
                res.status(400).json({ message: 'Issues found in the file:', issues, updatedContent });
                return;
            }
        }
        res.type('text/plain').send(updatedContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `An error occurred while editing the file: ${stringifyError(error)}` });
    }
};

module.exports = editFileHandler;