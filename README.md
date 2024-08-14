# ChatGPT Server Commander

This project is a server that exposes terminal commands and file editing functionality as an API for ChatGPT Actions. In essence, it allows you to control any machine where you install this with ChatGPT. Install, run, and edit things.

## Features

- Execute server commands through a REST API that is compatible with Custom ChatGPT actions
- Interface with external APIs and services.
- Local Tunnel integration for easy access to the server running on a local machine, making the API accessible to ChatGPT.

## Work in Progress

- Auto-generation of API schema with Swagger is in progress. For a detailed to-do list, please refer to [todo.md](./todo.md).

## Requirements/Installation

- Node.js v14+

To install the project dependencies, run:

```bash
npm install
```

**Setup Instructions**

- It's recommended to install pm2 to manage the process, as it will automatically restart the server if it crashes.
- Start the server with:

```bash
npm run start
```
- On the first run, the setup process will guide you through configuring the port, determining whether it runs locally or on a server, and setting the domain.
- The setup will generate a secret key for use in CustomGPT.
- Finally, create a CustomGPT and add your URL to the generated OpenAPI spec, similar to this format: `https://appcookbook.wonderwhy-er.com/openapi.json`.
- Also add prompt to custom gpt from [prompt.md](./prompt.md)
For more detailed instructions, please refer to the setup video (TODO: Add video).

## Contributing

Contributions to the Server Commander project are welcome.
I did not put in work yet to make it easy to contribute but I will if I see interest in that.

Feel free to reach out to me on LinkedIn https://www.linkedin.com/in/eduardruzga/
Or Discord https://discord.com/channels/wonderwhyer
Or Twitter/X https://x.com/wonderwhy_er

## License

The project is licensed under the MIT License.
