const express = require('express');
const { createAppInFirestore } = require('../serverModules/firebaseDB');

/**
 * @openapi
 * /api/apps:
 *   post:
 *     summary: Create a web application
 *     description: Used to create web applications out of title, description, external resources and internal blocks.
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
 *               headTags:
 *                 type: array
 *                 description: An array of tags representing external resources like scripts and stylesheets that will be added in to html head tag
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: header tag name like script or style
 *                       enum:
 *                         - script
 *                         - style
 *                     url:
 *                       type: string
 *                       description: The URL from where the resource will be loaded, src or href for tags
 *               internalBlocks:
 *                 type: array
 *                 description: An array of tags representing body html tags scripts, styles, and divs and others.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: A unique identifier for the tag
 *                     type:
 *                       type: string
 *                       description: The type of content tag (e.g., "script", "style", "div" and others).
 *                     content:
 *                       type: string
 *                       description: Content of the tag depending on its type (JavaScript code, CSS rules, HTML markup).
 *     responses:
 *       200:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Success message with ids and urls
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message
 */
module.exports = (getServerUrl) => {
  return async (req, res) => {
    try {
      const appData = req.body;
      const { id, privateId } = await createAppInFirestore(appData);
      const serverUrl = getServerUrl();
      const viewUrl = `${serverUrl}/api/apps/view/${id}`;
      const editUrl = `${serverUrl}/api/apps/edit/${privateId}`;
      res.type('text/plain').send(`App created successfully. ${JSON.stringify({id, privateId, viewUrl, editUrl}, undefined, 2)}`)

    } catch (error) {
      console.error('Error creating app:', error);
      res.status(500).send('Internal Server Error');
    }
  };
};