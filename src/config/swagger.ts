import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "TechWeb Project API",
      version: "1.0.0",
      description: "Quicksketch API documentation generated with OpenAPI 3.1.0 and Swagger",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserCredentials: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "Kyle" },
            password: { type: "string", example: "p4ssw0rd" },
          },
        },
        LoginResponse: {
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
        SignupResponse: {
          type: "object",
          required: ["username"],
          properties: {
            username: { type: "string", example: "Kyle" },
            message: { type: "string", example: "User created successfully" },
          },
        },
        WordChoice: {
          type: "object",
          required: ["id_word", "text"],
          properties: {
            id_word: { type: "integer", example: 1 },
            text: { type: "string", example: "gatto" },
          },
        },
        WordsResponse: {
          type: "object",
          required: ["words", "token"],
          properties: {
            words: {
              type: "array",
              items: { $ref: "#/components/schemas/WordChoice" },
            },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
          },
        },
        BackendAttempt: {
          type: "object",
          required: ["guess", "is_correct"],
          properties: {
            guess: { type: "string", example: "cane" },
            is_correct: { type: "boolean", example: false },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        BackendSketch: {
          type: "object",
          required: ["id_sketch", "path", "User"],
          properties: {
            id_sketch: { type: "integer", example: 1 },
            id_user: { type: "integer", example: 2 },
            id_word: { type: "integer", example: 5 },
            path: { type: "string", example: '{"objects":[]}' },
            timestamp: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            User: {
              type: "object",
              required: ["username"],
              properties: {
                username: { type: "string", example: "marco" },
              },
            },
            Word: {
              type: "object",
              properties: {
                text: { type: "string", example: "gatto" },
              },
            },
            user_attempts: {
              type: "array",
              items: { $ref: "#/components/schemas/BackendAttempt" },
            },
          },
        },
        SketchDetail: {
          type: "object",
          required: ["id_sketch", "path", "User"],
          properties: {
            id_sketch: { type: "integer", example: 1 },
            path: { type: "string", example: '{"objects":[]}' },
            createdAt: { type: "string", format: "date-time" },
            User: {
              type: "object",
              required: ["username"],
              properties: {
                username: { type: "string", example: "marco" },
              },
            },
            Word: {
              type: "object",
              properties: {
                text: { type: "string", example: "gatto" },
              },
            },
            user_attempts: {
              type: "array",
              items: { $ref: "#/components/schemas/BackendAttempt" },
            },
          },
        },
        CreateSketchRequest: {
          type: "object",
          required: ["id_word", "path", "words_token"],
          properties: {
            id_word: { type: "integer", example: 1 },
            path: { type: "string", example: '{"objects":[]}' },
            words_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
          },
        },
        CreateAttemptRequest: {
          type: "object",
          required: ["guess"],
          properties: {
            guess: { type: "string", example: "gatto" },
          },
        },
        AttemptResponse: {
          type: "object",
          required: ["is_correct", "attempts_remaining"],
          properties: {
            id_attempt: { type: "integer", example: 12 },
            guess: { type: "string", example: "gatto" },
            is_correct: { type: "boolean", example: true },
            attempts_remaining: { type: "integer", example: 9 },
            solution: { type: "string", example: "gatto" },
          },
        },
        PlayerRanking: {
          type: "object",
          required: ["id_user", "username", "score"],
          properties: {
            id_user: { type: "integer", example: 1 },
            username: { type: "string", example: "marco" },
            score: { type: "integer", example: 15 },
          },
        },
        ArtistRanking: {
          type: "object",
          required: ["id_user", "username", "percentage", "total_attempts", "successful_attempts", "sketches_count"],
          properties: {
            id_user: { type: "integer", example: 1 },
            username: { type: "string", example: "marco" },
            percentage: { type: "integer", example: 85 },
            total_attempts: { type: "integer", example: 20 },
            successful_attempts: { type: "integer", example: 17 },
            sketches_count: { type: "integer", example: 5 },
          },
        },
        UserStats: {
          type: "object",
          required: ["sketches_count", "guessed_count", "attempts_count", "unguessed_count"],
          properties: {
            sketches_count: { type: "integer", example: 3 },
            guessed_count: { type: "integer", example: 12 },
            attempts_count: { type: "integer", example: 25 },
            unguessed_count: { type: "integer", example: 1 },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: { type: "string", example: "An error occurred" },
            code: { type: "integer", example: 400 },
            description: { type: "string", example: "Invalid input provided" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*Router.ts", "./dist/routes/*Router.js"],
});
