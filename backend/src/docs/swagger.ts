import swaggerJsdoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Credit Jambo Client API',
    version: '1.0.0',
    description:
      'REST API powering the Credit Jambo mobile banking application. Handles onboarding, authentication, savings transactions, and balance retrieval.',
  },
  servers: [
    {
      url: process.env.SWAGGER_BASE_URL || 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'deviceId'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          password: {
            type: 'string',
            example: 'MySecurePassword123!'
          },
          deviceId: {
            type: 'string',
            example: 'device-123',
          },
          pushToken: {
            type: 'string',
            nullable: true,
            description: 'Expo push token if notifications are enabled on the device',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password', 'deviceId'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          deviceId: { type: 'string' },
          pushToken: {
            type: 'string',
            nullable: true,
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT to include in Authorization header of subsequent requests',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              balance: { type: 'number', format: 'double' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      SavingsBalanceResponse: {
        type: 'object',
        properties: {
          balance: { type: 'number', format: 'double', example: 150.75 },
        },
      },
      SavingsTransactionRequest: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: {
            type: 'number',
            format: 'double',
            example: 50.0,
            minimum: 0.01,
          },
        },
      },
      TransactionHistoryResponse: {
        type: 'object',
        properties: {
          transactions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                amount: { type: 'number', format: 'double' },
                type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAW'] },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'User onboarding and login' },
    { name: 'Savings', description: 'Balance, deposit, withdraw, and history' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user and device',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate a verified device and return JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Authentication failed (device unverified or wrong credentials)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings/balance': {
      get: {
        tags: ['Savings'],
        summary: 'Get current savings balance',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current balance',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SavingsBalanceResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings/deposit': {
      post: {
        tags: ['Savings'],
        summary: 'Deposit funds into the savings account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SavingsTransactionRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated balance and confirmation',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SavingsBalanceResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings/withdraw': {
      post: {
        tags: ['Savings'],
        summary: 'Withdraw funds from the savings account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SavingsTransactionRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated balance and confirmation',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SavingsBalanceResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/savings/history': {
      get: {
        tags: ['Savings'],
        summary: 'Retrieve transaction history',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Array of recent transactions',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionHistoryResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({ definition, apis: [] });

export default swaggerSpec;
