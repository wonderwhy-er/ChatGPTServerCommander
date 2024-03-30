/**
 * @openapi
 * /api/server-url:
 *   get:
 *     summary: Retrieves the server's URL
 *     description: Returns the current URL at which the server is accessible.
 *     operationId: getServerURL
 *     responses:
 *       200:
 *         description: Server URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The URL of the server.
 */

module.exports = (getURL) => (req, res) => {
    res.json({ url: getURL() });
};
