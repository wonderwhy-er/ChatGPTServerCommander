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

        // Construct the HTML response
        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>${appData.name}</title>
    <meta name="description" content="${appData.description}">
<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
        import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyDY-xzvZw-nzLZ4Zi4HI9B1bYI-VeRwGIM",
          authDomain: "appcookbook-a6d17.firebaseapp.com",
          projectId: "appcookbook-a6d17",
          storageBucket: "appcookbook-a6d17.appspot.com",
          messagingSenderId: "109493777387",
          appId: "1:109493777387:web:eb87d3a352f15231d3dfae",
          measurementId: "G-Z3TCSFW81L"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Function to clear previous head HTML
        function clearHeadHtml() {
            const headHtmlElements = document.querySelectorAll('.dynamic-head');
            headHtmlElements.forEach(el => el.remove());
        }

        // Function to add new head HTML
        function addHeadHtml(html) {
            const headWrapper = document.createElement('div');
            headWrapper.classList.add('dynamic-head');
            headWrapper.innerHTML = html;
            document.head.appendChild(headWrapper);
        }

        // Subscribe to changes
        document.addEventListener('DOMContentLoaded', (event) => {
            const privateId = "${private_id}";
            const q = query(collection(db, 'Apps'), where('privateId', '==', privateId));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const appData = doc.data();
                    document.title = appData.name;
                    document.querySelector('meta[name="description"]').setAttribute("content", appData.description);

                    // Update head HTML
                    clearHeadHtml();
                    addHeadHtml(appData.headHtml);

                    // Update body HTML
                    document.body.innerHTML = '';
                    const offScreenDiv = document.createElement('div');
                    offScreenDiv.style.display = 'none';
                    offScreenDiv.innerHTML = appData.bodyHtml;
                    
                    
                    while (offScreenDiv.firstChild) {
                        const child = offScreenDiv.firstChild;
                        document.body.appendChild(child);
            
                        // If the child is a script, re-create and append it to execute
                        if (child.tagName === 'SCRIPT') {
                            const scriptElement = document.createElement('script');
                            scriptElement.textContent = child.textContent;
                            document.body.appendChild(scriptElement);
                            document.body.removeChild(child); // Remove the old script
                        }
                    }
                });
            });
        });
    </script>
</head>
<body>
    <h1 id="app-name"></h1>
    <p id="app-description"></p>
    <!-- Add more HTML to display or edit the app data -->
</body>
</html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error('Error retrieving application:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {viewAppHandler, editAppHandler};