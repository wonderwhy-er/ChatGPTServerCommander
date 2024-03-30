// exitApplicationHandler.js

/**
 * Handler function to exit the Node.js application.
 * This function should be attached to a specific route in the main server.
 *
 * @openapi
 * /api/restart:
 *   post:
 *     summary: Restart the Node.js application.
 *     description: This endpoint allows for the controlled restart of the server application upon request.
 *     operationId: exitApplication
 *     responses:
 *       '200':
 *         description: Application is exiting.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the application is restarting.
 */
const exitApplicationHandler = (close) => (req, res) => {
  console.log('Exit request received. Shutting down.');
  res.json({ message: 'Exiting application...' });
  setTimeout(() => close(), 100);
  setTimeout(() => process.exit(), 500);
};

module.exports = exitApplicationHandler;

