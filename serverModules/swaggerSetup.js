// Swagger/OpenAPI Documentation Setup
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.1', // OpenAPI spec version
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
    openapiSpecification: expressApp => {
        expressApp.get('/openapi.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(openapiSpecification);
        });
    }
};
