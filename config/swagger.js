const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Chola Restaurant API",
      description: "API documentation for managing categories",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
