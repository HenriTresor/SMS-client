# Credit Jambo Client Application

Mobile banking application for customers to manage their savings accounts securely.

## Features

- 🔐 **Secure Authentication**: Device-based registration and login with admin verification
- 💰 **Savings Management**: Deposit and withdraw funds with real-time balance tracking
- 📱 **Push Notifications**: Receive alerts for transactions and account activities
- 📊 **Transaction History**: View detailed transaction history with filtering
- 🔄 **Real-time Updates**: Pull-to-refresh for latest account information
- ⏳ **Secure Sessions**: Automatic logout on app close or after 30 minutes of inactivity

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

1. **Backend API (Terminal 1)**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The API is available at `http://localhost:3000`.

2. **Expo mobile app (Terminal 2)**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   For the fastest feedback loop, install **Expo Go** on your device, scan the QR code printed by the CLI, and test changes instantly. Expo Go respects `EXPO_PUBLIC_API_URL` from your `.env`.

### Running on devices

```bash
# Expo Go (recommended during development)
npm start

# Native binary with Expo prebuild (when you need device-specific modules or a signed APK/AAB)
npm run prebuild   # generates android/ via expo prebuild --platform android
npm run android:native
```

> Tip: set `EXPO_DEV_SERVER_PORT` when you need Metro on a custom port, e.g. `EXPO_DEV_SERVER_PORT=19002 npm run android:native`.

- Optional: run `npm run setup` in `backend/` to install deps and push Prisma schema in one step.

### API Documentation

- **Swagger/OpenAPI**: Served from [`http://localhost:3000/docs`](http://localhost:3000/docs) while the backend is running. Export the schema via `/docs.json` if you want to share with other tools.
- **Postman / Requestly Collection**: Maintain a collection (suggested path `docs/postman/client-api.postman_collection.json`) mirroring the endpoints listed below.
- Capture responses for typical scenarios (success, validation errors, auth failures) to help mobile QA.

### Quick Postman Checklist
1. Set `{{baseUrl}}` to `http://localhost:3000` (or your tunnel/LAN URL).
2. Create `POST /auth/register` and `POST /auth/login` requests for the full auth flow.
3. Add an environment variable for the JWT (`{{authToken}}`) and use Postman scripts to reuse it.
4. Sync the collection to your team workspace and commit changes alongside backend updates.

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

- `backend/.env` – copy from the root `.env.example` in this repo (or create one) and set:

  ```env
  DATABASE_URL="postgresql://username:password@localhost:5432/credit_jambo"
  JWT_SECRET="your-super-secure-jwt-secret-here"
  PORT=3000
  EXPO_ACCESS_TOKEN="your-expo-access-token-for-push-notifications"
  ```

- `frontend/.env` – copy from `frontend/.env.example` and point the mobile app at a reachable URL:

  ```env
  EXPO_PUBLIC_API_URL="http://YOUR_LAN_IP:3000"
  ```

  Use your machine's LAN IP when testing on physical devices so they can reach the API.

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

The Jest + Supertest suites cover both authentication (`/auth/register`, `/auth/login`) and savings routes (`/savings/balance`, `/savings/deposit`, `/savings/withdraw`, `/savings/history`) using mocked services. When adding new specs that require JWTs, set `process.env.JWT_SECRET` within the test harness so issued tokens match middleware expectations.

## Production Deployment

### Docker Deployment
```bash
# Build and start services (database + backend)
docker-compose up --build -d

# Follow backend logs
docker-compose logs -f backend

# Stop and remove containers
docker-compose down
```

Populate a `.env` file next to `docker-compose.yml` to override defaults:

```env
CLIENT_DB_NAME=credit_jambo
CLIENT_DB_USER=postgres
CLIENT_DB_PASSWORD=postgres
CLIENT_DB_PORT=5434
CLIENT_DATABASE_URL=postgresql://postgres:postgres@db:5432/credit_jambo
CLIENT_JWT_SECRET=changeme
CLIENT_BACKEND_PORT=3000
```

Anything omitted falls back to the compose defaults.

### Manual Deployment
```bash
# Transpile backend
npm run build

# Start backend
npm start
```

### Native Android Builds

When you need a full native binary (outside Expo Go):

```bash
# From frontend/
npm run prebuild      # npx expo prebuild --platform android (run after native config changes)
npm run android       # builds & installs via expo run:android
```

Ensure your Android device is connected with USB debugging enabled or an emulator is running. The first build may take several minutes while Gradle downloads dependencies.

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

All commands below should be run from the appropriate package directory.

- **Backend (`client-app/backend`)**
  - `npm run dev` – Start the Express API with hot reload (`tsx watch`).
  - `npm run build` – Compile TypeScript -> `dist/`.
  - `npm start` – Run the compiled server.
  - `npm run setup` – Install deps, generate Prisma client, push schema.
  - `npm run db:generate` / `npm run db:push` / `npm run db:studio` / `npm run db:migrate` – Prisma utilities.
  - `npm run test` / `npm run test:coverage` / `npm run test:watch` – Jest test suites.
  - `npm run lint` / `npm run lint:fix` – ESLint checks.
  - `npm run clean` – Reinstall dependencies and rebuild (uses `rm -rf`, keep on Unix-like shells).

- **Frontend (`client-app/frontend`)**
  - `npm start` – Expo dev server (best with Expo Go).
  - `npm run web` – Expo web preview.
  - `npm run lint` – Expo linting pipeline.
  - `npm run prebuild` – `expo prebuild --platform android` (generates native Android project).
  - `npm run android` / `npm run android:native` – Build & install via `expo run:android`.

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

## Coding Style

- React Native + TypeScript with Expo Router conventions.
- ESLint configuration lives under `frontend/.eslintrc`; run `npm run lint` before committing.
- Keep component files focused (UI logic in `components/`, network logic in `services/`).

## Assumptions & Notes

- Backend base URL is supplied via `EXPO_PUBLIC_API_URL`; set it to a host reachable from your device (e.g., LAN IP or tunnel).
- Expo Go has limited push-notification support. To test notifications end-to-end, run prebuild command.

## License

This project is for educational purposes.
