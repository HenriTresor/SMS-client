# Credit Jambo - Client Application

## Overview
The Client Application is a mobile app built with React Native and Expo, allowing customers to register, log in, and manage their savings securely.

## Features
- User registration and login with device verification
- Deposit and withdraw funds
- View balance and transaction history
- Secure JWT authentication
- Push notifications (placeholder)

## Tech Stack
- React Native
- Expo
- Axios for API calls

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For web: `npm run web`

## Backend
The app communicates with the backend at `http://localhost:3000`.

## Notes
- Ensure the backend is running before using the app.
- Device ID is obtained via Expo Device API.
