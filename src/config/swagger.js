// src/config/swagger.js
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tech Quiz API",
      version: "1.0.0",
      description: "API documentation for the Tech Quiz Application",
      contact: {
        name: "Support",
      },
    },
    servers: [
      {
        url: "http://localhost:5050/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        Technology: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            icon: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LevelConfig: {
          type: "object",
          properties: {
            _id: { type: "string" },
            technology: { $ref: "#/components/schemas/Technology" },
            level: {
              type: "string",
              enum: ["basic", "intermediate", "advanced"],
            },
            questionCount: { type: "number" },
            timeLimit: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Question: {
          type: "object",
          properties: {
            _id: { type: "string" },
            text: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctAnswer: { type: "string" }, // Note: not sent in start response
            technology: { $ref: "#/components/schemas/Technology" },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
            explanation: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Attempt: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            technology: { $ref: "#/components/schemas/Technology" },
            level: { type: "string" },
            difficulty: { type: "string" },
            score: { type: "number" },
            totalQuestions: { type: "number" },
            timeTaken: { type: "number" },
            submittedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/authroutes.js",
    "./src/routes/quiz.js",
    "./src/routes/analytics.js",
    "./src/routes/technologies.js",
    "./src/routes/admin/technologies.js",
    "./src/routes/admin/levelConfigs.js",
    "./src/routes/admin/questions.js",
    "./src/routes/admin/analytics.js",
  ],
};

const specs = swaggerJsdoc(options);
export default specs;
