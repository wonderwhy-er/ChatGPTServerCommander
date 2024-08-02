# To-Do List

## API Handling and Updates

- [ ] **Refactor API Handler for Create Operation**:
   - Update `createAppHandler` in `firebase.js` to handle `headHtml` and `bodyHtml` as strings.
- [ ] **OpenAPI Documentation Update**:
   - Adjust the OpenAPI comment in `firebase.js` to describe the API's functionality with the new HTML string parameters.
- [ ] **Update Firestore Handling**:
   - Ensure `createAppInFirestore` in `firebaseDB.js` is adapted to store HTML strings.
- [ ] **Frontend Modifications** (if applicable):
   - Update frontend submissions to the `createApp` endpoint.

## Errors
1. creates duplicate code, how to catch and error? better fix?
3. read operation errors out, on error writing we should revert, inform chat gpt about it
4. may be we should not error but instruct back that error happend and what it was