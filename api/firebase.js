const express = require('express');
const { createAppInFirestore, getFirebaseAppByPrivateId } = require('../serverModules/firebaseDB');

/**
 * //@openapi
 * ---
 * /api/apps:
 *   post:
 *     operationId: createApp
 *     summary: Create a web application
 *     description: Used to create web applications out of title, description, external
 *       resources and internal blocks.
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
 *               headHtml:
 *                 type: string
 *                 description: HTML content for the head section
 *                 example: <meta charset='UTF-8'>
 *               bodyHtml:
 *                 type: string
 *                 description: HTML content for the body section
 *                 example: <h1>Welcome to the Application</h1>
 *             required:
 *               - name
 *               - description
 *     responses:
 *       "200":
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Success message with ids and urls
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message
 *   get:
 *     summary: Get a web application by privateId
 *     description: Retrieves a web application using its privateId.
 *     operationId: getAppByPrivateId
 *     parameters:
 *       - name: privateId
 *         in: query
 *         required: true
 *         description: Private ID of the application
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 privateId:
 *                   type: string
 *                   description: Private ID of the application
 *                 name:
 *                   type: string
 *                   description: Name of the application
 *                 description:
 *                   type: string
 *                   description: Description of the application
 *                 headHtml:
 *                   type: string
 *                   description: HTML content for the head section
 *                 bodyHtml:
 *                   type: string
 *                   description: HTML content for the body section
 *       "400":
 *         description: Bad Request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message indicating that privateId query parameter is required
 *       "404":
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 description: Error message
 *         description: Application not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Error message indicating that application was not found
 */
module.exports = (getServerUrl) => {
  return async (req, res) => {
    if (req.method === 'POST') {
      // Handle POST request to create a new app
      try {
        const appData = req.body;
        const { id, privateId } = await createAppInFirestore(appData);
        const serverUrl = getServerUrl();
        const viewUrl = `${serverUrl}/api/apps/view/${id}`;
        const editUrl = `${serverUrl}/api/apps/edit/${privateId}`;
        res.type('text/plain').send(`App created successfully. ${JSON.stringify({id, privateId, viewUrl, editUrl}, undefined, 2)}`);
      } catch (error) {
        console.error('Error creating app:', error);
        res.status(500).send('Internal Server Error');
      }
    } else if (req.method === 'GET') {
      // Handle GET request to retrieve an app by privateId
      try {
        const { privateId } = req.query;
        if (!privateId) {
          return res.status(400).send('privateId query parameter is required.');
        }
        const appData = await getFirebaseAppByPrivateId(privateId);
        if (!appData) {
          return res.status(404).send('Application not found.');
        }
        res.status(200).json(appData);
      } catch (error) {
        console.error('Error retrieving app:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.status(405).send('Method Not Allowed');
    }
  };
};