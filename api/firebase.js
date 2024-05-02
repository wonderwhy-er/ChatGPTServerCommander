const express = require('express');
const { createAppInFirestore } = require('../serverModules/firebaseDB');

/**
 * @openapi
 * /api/apps:
 *   post:
 *     summary: Create an application in Firestore
 *     description: Takes application data from the request body, creates an application in Firestore, and returns the application's ID and public ID
 *     operationId: createApp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the application
 *               description:
 *                 type: string
 *                 description: Description of the application
 *               externalResources:
 *                 type: array
 *                 description: An array of objects representing external resources like scripts and stylesheets.
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The type of external resource tag name (e.g., "script", "style").
*                        enum:
 *                          - script
 *                          - style
 *                     url:
 *                       type: string
 *                       description: The URL from where the resource can be accessed.
 *               internalBlocks:
 *                 type: array
 *                 description: An array of objects representing internal content blocks such as scripts, styles, and HTML blocks.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: A unique identifier for the content block.
 *                     type:
 *                       type: string
 *                       description: The type of content block (e.g., "script", "style", "html").
 *                     content:
 *                       type: string
 *                       description: The actual content of the block (JavaScript code, CSS rules, HTML markup).
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                 publicId:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message
 */
const createAppHandler = async (req, res) => {
  try {
    const appData = req.body;
    const { id, publicId } = await createAppInFirestore(appData);
    res.status(201).json({ message: 'App created successfully', id, publicId });
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createAppHandler };
