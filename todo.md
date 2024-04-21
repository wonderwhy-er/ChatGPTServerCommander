# To-Do List

## API Handling and Updates
- [ ] **Update API Handler**:
   - Refactor `createAppHandler` in `firebase.js` to handle create, read, and update operations based on request parameters (`id` and `content`).
- [ ] **OpenAPI Documentation Update**:
   - Adjust the OpenAPI comment in `firebase.js` to describe the unified API's functionality, including the create, read, and update operations.
- [ ] **Error Handling and Validation**:
   - Implement robust error handling and parameter validation for the unified API.
- [ ] **Implement Helper Functions**:
   - Create or ensure functions for reading and updating application data by ID in `firebaseDB.js`.
- [ ] **Testing**:
   - Thoroughly test the unified API for create, read, and update operations with various inputs.

## Add git diff viewer
- [ ] **Implement Git Diff Generation**:
   - Integrate `simple-git` to generate diffs for specified files and commits.
- [ ] **Setup Diff Viewer**:
   - Utilize `diff2html` to parse and display diffs in a user-friendly format.
- [ ] **Create API Endpoint**:
   - Develop a new API endpoint to handle git diff requests and return formatted HTML.
- [ ] **Setup Server-Side HTML Generation**:
   - Develop server-side logic to generate an HTML page that embeds the git diff directly in the body.
- [ ] **Include JavaScript Library from CDN**:
   - Include a script tag in the HTML to load a diff rendering library like `diff2html` from a CDN.
- [ ] **Automatically Render Diff on Page Load**:
   - Ensure the JavaScript library automatically renders the diff content in a formatted style when the HTML page is loaded.- [ ] **Testing and Documentation**:
   - Conduct thorough testing for the new features and update project documentation accordingly.
