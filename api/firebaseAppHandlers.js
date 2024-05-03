const { getFirebaseAppByPublicId } = require('../serverModules/firebaseDB');

async function viewAppHandler(req, res) {
    const { public_id } = req.params;
    try {
        const appData = await getFirebaseAppByPublicId(public_id);
        if (!appData) {
            return res.status(404).send('Application not found.');
        }

        // Construct HTML response
        let html = `
<html>
<head>
<title>${appData.name}</title>
<meta name="description" content="${appData.description}">
`;

        // Include external resources in the head
        if (appData.externalResources) {
            appData.externalResources.forEach(resource => {
                if (resource.type === 'style') {
                    html += `<link rel="stylesheet" href="${resource.url}">`;
                } else if (resource.type === 'script') {
                    html += `<script src="${resource.url}"></script>`;
                }
            });
        }

        html += `</head><body>`;

        // Internal blocks as body content
        if (appData.internalBlocks) {
            appData.internalBlocks.forEach(block => {
                html += `<${block.type}>${block.content}</${block.type}>`;
                // Add more conditions here for different types of content
            });
        }

        html += `</body></html>`;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error('Error retrieving application:', error);
        res.status(500). send('Internal Server Error');
    }
}

const { getFirebaseAppByPrivateId } = require('../serverModules/firebaseDB');

async function editAppHandler(req, res) {
    const { private_id } = req.params;
    try {
        const appData = await getFirebaseAppByPrivateId(private_id);
        if (!appData) {
            return res.status(404).send('Application not found.');
        }
        res.json(appData);
    } catch (error) {
        console.error('Error retrieving application:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {viewAppHandler, editAppHandler};