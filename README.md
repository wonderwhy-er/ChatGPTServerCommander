# ChatGPT Server Commander
<img src="logo4.png" width="350pxp" height="350px"/>
This project is a server that exposes terminal commands and file editing functionality as an API for ChatGPT Actions. In essence, it allows you to control any machine where you install this with ChatGPT. Install, run, and edit anything, even itself.

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

# Setup Instructions

### 1.  First you will need to install Node.js, at time of writting its v20.16.0 https://nodejs.org/en
### 2.  Checkout the code and open Terminal in the folder
### 3.  install dependencies

```bash
npm install
```

### 4. Start the server with:

```bash
npm run start
```
### 5. On the first run, the setup process will guide you through configuring the port, determining whether it runs locally or on a server, and setting the domain.
### 6. The setup will generate a secret key for use in CustomGPT called authKey, don't share it, it will be used later to allow ChatGPT to call your server or computer

![image](https://github.com/user-attachments/assets/03570d60-3eea-4157-bb5f-785f05fe0ce7)

### 7. Finally, create a CustomGPT here https://chatgpt.com/gpts/editor
### 8. Add prompt to custom gpt from [prompt.md](./prompt.md)

![image](https://github.com/user-attachments/assets/666f50ef-e264-4cd3-ab8a-6d1554b089c1)

### 9. Add your URL to the generated OpenAPI spec, similar to this but with your domain: `https://appcookbook.wonderwhy-er.com/openapi.json`

![image](https://github.com/user-attachments/assets/901a7f31-22b7-42bf-b698-db346a8cb8f1)

### 10. Add API authentication, choose Bearer an add authKey from step 6   

![image](https://github.com/user-attachments/assets/2b41d095-c329-417c-a18e-d83f0a979afb)

For more detailed instructions, please refer to the setup video (TODO: Add video).

## Contributing

Contributions to the Server Commander project are welcome.
I did not put in work yet to make it easy to contribute but I will if I see interest in that.

Feel free to reach out to me on LinkedIn https://www.linkedin.com/in/eduardruzga/
Or Discord https://discord.com/channels/wonderwhyer
Or Twitter/X https://x.com/wonderwhy_er

## License

The project is licensed under the MIT License.
