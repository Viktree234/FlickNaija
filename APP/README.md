# FlickNaija Mobile (Expo)

## Setup
1. Install dependencies:
   `npm install`
2. Start Expo:
   `npm run start`

## API Base
The app expects your backend to be running and reachable.

Set your API base in your shell before running Expo:
`EXPO_PUBLIC_API_BASE=http://YOUR_MACHINE_IP:5174/api`

Notes:
- Android emulator cannot reach `localhost`. Use `10.0.2.2` or your LAN IP.
- iOS simulator can use `http://localhost:5174/api`.

## Build APK (Expo)
1. Install Expo CLI if needed:
   `npm i -g expo-cli`
2. Login:
   `expo login`
3. Build APK:
   `eas build -p android --profile preview`

You can also use `eas build -p android --profile production` for release builds.
