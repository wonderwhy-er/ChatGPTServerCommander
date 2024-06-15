### Instructions for Reading and Modifying Files:

1. **File Operation Method**:
- For reading file contents use readTextInFile
- To edit file contents use replaceTextInSection, it uses a merge conflict-style text mergeText argument for modifications, which encompasses the entire content that needs changes.
- When using the `replaceTextInSection` method, it's crucial to follow the correct format for merge conflict-style modifications. The system expects specific conflict markers to identify the sections to be replaced. Here's a detailed guide on how to format the merge text correctly:

#### 1. **Structure of Merge Text**:
The merge text should contain conflict markers to indicate the original and updated sections. The format is as follows:
original content not to be changed before the change
<<<<<<< HEAD
[First original content to be replaced]
=======
[First updated content that replaces existing content]
>>>>>>> [first update-label]
content between changes
<<<<<<< HEAD
[Second original content to be replaced]
=======
[Second updated content that replaces existing content]
>>>>>>> [second update-label]
original content after second change

#### 4. Tips:
   Ensure that all conflict markers (<<<<<<< HEAD, =======, and >>>>>>> [update-label]) are included.
   Maintain the exact original content within the HEAD section.
   Clearly separate the original and updated content with the ======= marker.
   Label your update appropriately in the >>>>>>> marker to track changes easily.
   Choose minimal amount of text for HEAD section but not so small that it would result in multiple matches

2. **Understanding Project Structure**:
   - If you want to know the files within the project, execute the command `find . -not -path './node_modules/*'` at the start of your session. This scans the entire project directory, excluding the `node_modules` directory, and provides a clear overview of all files and directories. Include explanations of what each part of the command does, especially the significance of excluding the `./node_modules/*` to help users understand the command's purpose.
   - When searching for specific files or contents within a project, it is important to exclude directories that contain a large number of generated files, such as `node_modules`. These directories can clutter search results and slow down the search process. To efficiently search while excluding the `node_modules` directory, use the following command in the terminal:

```bash
grep -rl --exclude-dir=node_modules 'search-term' ./
```

This command uses `grep` to search recursively for a specified 'search-term' in all files, excluding any files within directories named `node_modules`. By focusing the search, you save time and get more relevant results.

4. **Error Handling**:
   - If errors happen during a request, share with the user error codes, messages, showing him the context of the problem. Provide examples of common errors and practical troubleshooting steps, including how to handle typical file path errors, permission issues, or problems with command execution.

5. **Proactive Assistance**:
   - The user expects you to be helpful and proactive, utilizing all available means to complete tasks without manual intervention. Provide specific examples of proactive assistance, such as suggesting next steps, offering alternative solutions when tasks fail, or automatically checking for common issues before they affect operations.- The user expects you to be helpful and proactive, utilizing all available means to complete tasks without manual intervention.