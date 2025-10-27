# Credit Jambo Client Application

Mobile banking application for customers to manage their savings accounts securely.

## Features

- 🔐 **Secure Authentication**: Device-based registration and login with admin verification
- 💰 **Savings Management**: Deposit and withdraw funds with real-time balance tracking
- 📱 **Push Notifications**: Receive alerts for transactions and account activities
- 📊 **Transaction History**: View detailed transaction history with filtering
- 🔄 **Real-time Updates**: Pull-to-refresh for latest account information

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with device verification
- **Notifications**: Expo Push Notifications

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Expo CLI (`npm install -g @expo/cli`)

### Setup
```bash
# Install all dependencies
npm run setup

# Start development servers
npm run dev
```

This will start:
- Backend API on port 3000
- Expo development server for mobile app

### Mobile App
```bash
# Start Expo development server
npm run dev:frontend

# Build for production
npm run build:frontend
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user with device
- `POST /auth/login` - Login with device verification

### Savings Operations
- `GET /savings/balance` - Get account balance
- `POST /savings/deposit` - Deposit funds
- `POST /savings/withdraw` - Withdraw funds
- `GET /savings/history` - Transaction history

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/credit_jambo_client"
JWT_SECRET="your-super-secure-jwt-secret-here"
PORT=3000
EXPO_ACCESS_TOKEN="your-expo-access-token-for-push-notifications"
```

## Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# View database in Prisma Studio
npm run db:studio
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Production Deployment

### Docker Deployment
```bash
# Build and start services
npm run deploy

# View logs
npm run docker:logs

# Stop services
npm run stop
```

### Manual Deployment
```bash
# Build backend
npm run build:backend

# Build mobile app
npm run build:frontend

# Start backend
npm run start:backend
```

## Mobile App Usage

1. **Registration**: Enter email, password, and device will be automatically registered
2. **Device Verification**: Wait for admin approval before login
3. **Login**: Use verified device to access account
4. **Dashboard**: View balance and recent transactions
5. **Transactions**: Deposit/withdraw with confirmation
6. **Notifications**: Receive push notifications for account activities

## Security Features

- SHA-512 password hashing
- JWT authentication with expiration
- Device-based access control
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure HTTP headers

## Development Scripts

```bash
# Setup everything
npm run setup

# Development mode
npm run dev

# Build for production
npm run build

# Clean and rebuild
npm run clean

# Database operations
npm run db:generate
npm run db:push
npm run db:studio

# Testing
npm test
npm run test:coverage

# Docker operations
npm run docker:build
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Project Structure

```
client-app/
├── frontend/              # React Native + Expo app
│   ├── screens/           # App screens (Login, Dashboard, etc.)
│   ├── components/        # Reusable UI components
│   ├── services/          # API and utility services
│   └── constants/         # App constants
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Custom middleware
│   │   ├── routes/        # API routes
│   │   ├── schemas/       # Validation schemas
│   │   ├── dtos/          # Data transfer objects
│   │   └── server.ts      # Server entry point
│   ├── prisma/            # Database schema and migrations
│   └── tests/             # Test files
├── docker-compose.yml     # Docker orchestration
├── package.json           # Project scripts and dependencies
└── README.md             # This file
```

## Contributing

1. Follow TypeScript and ESLint rules
2. Write tests for new features
3. Use conventional commit messages
4. Test on both iOS and Android
5. Update documentation for API changes

## License

This project is for educational purposes.
