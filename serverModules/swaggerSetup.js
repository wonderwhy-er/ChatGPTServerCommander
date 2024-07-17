// Swagger/OpenAPI Documentation Setup
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.1.0', // OpenAPI spec version
        info: {
            title: 'Terminal for ChatGPT', // Title of your API
            version: '1.0.0', // Version of your API
        },
    },
    apis: ['./api/*.js'], // Path to your endpoint definitions
};
const openapiSpecification = swaggerJsdoc(options);
openapiSpecification.components = {
    "schemas": {}
};

console.log(openapiSpecification);

module.exports = {
    setURL: (url) => {
        openapiSpecification.servers = [{
            url: url,
        }];
    },
    openapiSpecification: (expressApp, url) => {

        expressApp.get('/openapi.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(openapiSpecification);
        });
    }
};
