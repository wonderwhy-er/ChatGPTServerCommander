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


        // Insert head HTML content directly
        html += appData.headHtml || '';
        html += `</head><body>`;


        // Body content directly from HTML string
        html += appData.bodyHtml;
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