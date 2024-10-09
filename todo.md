# To - Do List

# # API Handling and Updates

  -
  [] ** Log HTTP Error Responses
for Future Investigation **:
  - ** Objective **: Log all error responses sent by API handlers, including inputs, error messages, and relevant file content. -
  ** Files to Edit **:
  -API Handlers( e.g., `readEditTextFileHandler.js` ): Add logging at points where `res.status(400/500)`
is called. -
  ** Information to Collect **:
  -Inputs: Request body, query parameters, and file paths involved in the request. -
  Errors: Error messages and reasons
for failure. -
  File Content: Before and after content(
    if applicable ). -
  ** Where to Log **: Save all error details in a file like `http_error_responses.log`
for later investigation.

    - [] add support for global paths for file reader

      -
      [] ** Refactor API Handler
    for Create Operation **:
      -Update `createAppHandler` in `firebase.js`
    to handle `headHtml`
    and `bodyHtml`
    as strings. - [] ** OpenAPI Documentation Update **:
      -Adjust the OpenAPI comment in `firebase.js`
    to describe the API 's functionality with the new HTML string parameters.


# # Errors
1. creates duplicate code, how to
catch and error ? better fix ?
  3. read operation errors out, on error writing we should revert, inform chat gpt about it
4. may be we should not error but instruct back that error happend and what it was
5. sometimes it puts incomplete text in replace, improve prompting to explain how it works
6. Sometimes when targeted replace fails it proposes whole file rewrite, add a method ?

  8. Feels like we could want to use AST ? Replace constants / functions / classes ? Class methods ? We want something like xpath
for css / js
9. When you need to replace things that are multiple times in a file, better prompt of how to work around in that situation, actually,
  return multiple occurances and nearby lines, and lines so AI does not need to do additional call to figure out which one to change

- [] multiple edits if one fails otehr succeed it thinks other succeeded, return what failed and reverted file, do not tell about success
- [] 