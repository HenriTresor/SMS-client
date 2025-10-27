# Savings Management System - Mobile Client App

A comprehensive React Native mobile application for customer savings management, built with Expo and TypeScript.

## Features

### 🔐 Authentication & Security
- Secure user registration and login
- SHA-512 password hashing
- JWT authentication with session management
- Device verification system (admin approval required)
- Automatic session expiration

### 💰 Savings Operations
- **Dashboard**: Real-time balance display and account overview
- **Deposit**: Easy money deposits with preset amounts and validation
- **Withdraw**: Secure withdrawals with balance checks and limits
- **Transaction History**: Complete history with detailed information
- **Balance Management**: Real-time updates and low balance alerts

### 🔔 Push Notifications
- Deposit confirmations
- Withdrawal alerts
- Low balance warnings
- Device verification notifications
- Login confirmations

### 🎨 Modern UI/UX
- Beautiful, responsive design with dark/light mode support
- Smooth animations and transitions
- Comprehensive error handling and loading states
- Pull-to-refresh functionality
- Form validation with real-time feedback

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Storage**: AsyncStorage for persistent data
- **Notifications**: Expo Notifications
- **TypeScript**: Full type safety
- **API Client**: Custom REST API client with error handling

## Project Structure

```
client-app/frontend/
├── app/                    # App screens (file-based routing)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Dashboard screen
│   │   ├── explore.tsx    # Transaction history
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── deposit.tsx        # Deposit screen
│   ├── withdraw.tsx       # Withdraw screen
│   └── _layout.tsx        # Root layout with auth
├── components/            # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── Input.tsx          # Custom input component
│   ├── Card.tsx           # Card container component
│   └── index.ts           # Component exports
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── services/              # API and utility services
│   ├── apiClient.ts       # Backend API client
│   └── notificationService.ts # Push notification service
├── types/                 # TypeScript type definitions
│   └── index.ts           # App types
├── hooks/                 # Custom React hooks
└── constants/             # App constants and themes
```

## Prerequisites

- Node.js (v20.19.4 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android device/emulator

## Installation

1. **Install dependencies:**
   ```bash
   cd client-app/frontend
   npm install
   ```

2. **Environment Setup:**
   The app connects to the backend API running on `http://localhost:3000`. Make sure the backend is running before starting the mobile app.

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/emulator:**
   - **iOS**: `npm run ios` or press `i` in the terminal
   - **Android**: `npm run android` or press `a` in the terminal
   - **Web**: `npm run web` or press `w` in the terminal

## Backend Integration

The mobile app integrates with the backend API endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /savings/balance` - Get account balance
- `POST /savings/deposit` - Make a deposit
- `POST /savings/withdraw` - Make a withdrawal
- `GET /savings/history` - Get transaction history

### Authentication Flow

1. User registers with email, password, device ID, and push token
2. Admin must verify the device before login is allowed
3. Once verified, user can log in and access all features
4. JWT tokens are stored securely and used for API authentication

## Key Features Explained

### Device Verification System
- Each device gets a unique ID when the app is first installed
- Registration includes the device ID and push notification token
- Admin must verify devices before users can access full functionality
- Prevents unauthorized access from unverified devices

### Security Features
- All API requests include JWT authentication headers
- Passwords are hashed with SHA-512 before transmission
- Form validation on both client and server sides
- Secure storage of sensitive data using AsyncStorage

### Push Notifications
- Automatic permission requests on first login
- Notifications for all major account activities
- Custom notification service with proper error handling
- Platform-specific notification configurations

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add comprehensive comments for complex logic

### Component Structure
- Keep components small and focused
- Use custom hooks for shared logic
- Implement proper prop types
- Follow the single responsibility principle

### API Integration
- Use the provided `apiClient` for all backend communication
- Handle all API errors gracefully
- Implement loading states for all async operations
- Use TypeScript types for API responses

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Production Build
```bash
# Build for production
npx expo build:android
npx expo build:ios

# Or use EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

### Environment Variables
For production deployment, update the API base URL in `services/apiClient.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-domain.com';
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npm start -- --clear`
2. **Network errors**: Ensure backend is running on port 3000
3. **Authentication errors**: Check that device is verified by admin
4. **Push notification issues**: Verify notification permissions are granted

### Debug Mode
Enable debug logging by setting:
```typescript
console.log('API_BASE_URL:', API_BASE_URL);
```

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation as needed
4. Test on both iOS and Android platforms
5. Ensure accessibility compliance

## License

This project is part of the Savings Management System and follows the same licensing terms.
