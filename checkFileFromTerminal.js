const { checkJavaScriptFile } = require('./serverModules/checkjs');

// Ensure a file path is provided
if (process.argv.length < 3) {
    console.log("Usage: node checkFileFromTerminal.js <path_to_js_file>");
    process.exit(1);
}

const filePath = process.argv[2]; // Get the file path from command line arguments

checkJavaScriptFile(filePath).then(issues => {
    if (issues.length === 0) {
        console.log("No issues found.");
    } else {
        console.log("Issues found:");
        issues.slice(0, 10).forEach(issue => {
            console.log(JSON.stringify(issue));
        });
        console.log()
    }
}).catch(error => {
    console.error("Error checking file:", error);
});

