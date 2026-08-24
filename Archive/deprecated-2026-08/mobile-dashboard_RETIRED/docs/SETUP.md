# DWS IQ Mobile Dashboard - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.0.0 or higher ([download](https://nodejs.org/))
- **npm** 8.0.0 or higher (comes with Node.js)
- **Git** ([download](https://git-scm.com/))
- **Expo CLI** (will be installed as dev dependency)

### Platform-Specific Requirements

**iOS Development:**
- macOS 12+
- Xcode 14+
- CocoaPods

**Android Development:**
- Android SDK 21+
- Android Studio (optional)
- Android emulator or physical device

**Windows Development (Kimi K2):**
- Windows 10+
- Android SDK tools
- Android emulator or ADB access to physical device

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/blogtheristo/dws6.git
cd dws6/mobile-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Expo, React Native, Redux, and testing libraries.

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.dws-iq.ncc.corp/v1/mobile
EXPO_PUBLIC_API_TIMEOUT=30000

# OAuth/OIDC Configuration
EXPO_PUBLIC_OAUTH_CLIENT_ID=your-client-id
EXPO_PUBLIC_OAUTH_AUTHORITY=https://auth.ncc.corp

# Feature Flags
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
EXPO_PUBLIC_ENABLE_MOCK_API=false

# Analytics
EXPO_PUBLIC_ANALYTICS_ENABLED=true
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Environment
EXPO_PUBLIC_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

This launches Expo Dev Server. You'll see a menu with options:

```
› Press s to use Snack
› Press a to open Android
› Press i to open iOS simulator
› Press w to open web
› Press r to reload
› Press m to toggle menu
```

## Running on Different Platforms

### iOS Simulator

```bash
npm run ios
```

**Requirements:** macOS + Xcode

### Android Emulator

```bash
npm run android
```

**Setup Android Emulator:**

1. Open Android Studio
2. Tools → Device Manager
3. Create a virtual device (API 21+)
4. Start the emulator
5. Run `npm run android`

### Kimi K2 (Android Device)

```bash
npm run android
```

**Prerequisites:**
- USB cable connecting Kimi K2 to development machine
- USB debugging enabled on device
- ADB drivers installed

**Enable USB Debugging on Kimi K2:**
1. Settings → About → Tap Build Number 7 times
2. Settings → Developer Options → Enable USB Debugging
3. Connect device via USB
4. Run `adb devices` to verify connection
5. Execute `npm run android`

### Web (Testing)

```bash
npm run web
```

Opens in browser at `http://localhost:19006`

## Development Workflow

### TypeScript Compilation

```bash
npm run type-check
```

Checks for TypeScript errors without building.

### Linting

```bash
npm run lint          # Check for style issues
npm run lint:fix      # Auto-fix style issues
```

### Testing

```bash
npm run test          # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Code Organization

```
src/
├── components/        # Reusable components (cards, buttons, etc.)
├── screens/           # Full screens (Dashboard, Projects, etc.)
├── services/          # API & data services
├── hooks/             # Custom React hooks
├── context/           # Context providers
├── store/             # Redux store & slices
├── types/             # TypeScript types
├── utils/             # Utilities & helpers
└── styles/            # Global styles & theme
```

## Mock API / Offline Development

For local testing without backend:

```bash
# In .env
EXPO_PUBLIC_ENABLE_MOCK_API=true
```

Mock data is served from `config/fixtures/` directory. This allows:

- Full app functionality without live API
- Testing offline mode
- Rapid UI iteration

## Debugging

### React DevTools

```bash
# Integrated in Expo - access via menu
# Press 'm' while app is running
# Select "Launch React DevTools"
```

### Network Inspector

View all API requests in Expo DevTools:

1. Open Expo DevTools (press 'm')
2. Select "Launch Redux DevTools" or Network tab
3. Monitor requests/responses

### Console Logs

```bash
# iOS/Android console visible in terminal where you ran `npm run dev`
# Or use React Native Debugger for enhanced debugging
```

### Crash Logs

Crashes are collected in:
- Console output
- Sentry (if configured in .env)

## Building for Production

### Prepare Release Build

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo account
eas login

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

### Configuration

Create `eas.json` in project root:

```json
{
  "build": {
    "production": {
      "node": "16.13.0",
      "npm": "8.1.0",
      "env": {
        "EXPO_PUBLIC_ENV": "production"
      }
    }
  }
}
```

### Submit to App Stores

```bash
# Submit to App Store (requires Apple Developer account)
npm run submit:ios

# Submit to Google Play (requires Google Play Developer account)
npm run submit:android
```

## Troubleshooting

### "Cannot find module" Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### Port Already in Use

If Expo Dev Server fails to start:

```bash
# Default ports: 8081, 19000, 19001
# Try manually specifying different port
expo start --port 8085
```

### Android Emulator Issues

```bash
# List connected devices
adb devices

# Restart ADB server
adb kill-server
adb start-server

# Wipe emulator data (if needed)
adb -e shell wm wipe-data
```

### iOS Build Errors

```bash
# Clear iOS build cache
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstall pods
cd ios && rm -rf Pods Podfile.lock
pod install
cd ..
```

### Network Timeouts

If API calls timeout:

1. Check `EXPO_PUBLIC_API_BASE_URL` in `.env`
2. Verify network connectivity
3. Increase timeout in `.env`: `EXPO_PUBLIC_API_TIMEOUT=60000`

## Performance Optimization

### Bundle Size

```bash
npm run build:web

# Analyze bundle
npm install -g source-map-explorer
source-map-explorer 'web-build/**/*.js'
```

### Memory Profiling

Use React Native Debugger for memory profiling:

```bash
# Download: https://github.com/jhen0409/react-native-debugger
# Extract and run
```

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] API tokens stored in secure storage (not AsyncStorage)
- [ ] HTTPS enforced for all API calls
- [ ] TLS pinning implemented for sensitive endpoints
- [ ] OAuth tokens refreshed securely
- [ ] Sensitive data cleared on logout

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android |
| `npm run web` | Run web version |
| `npm run lint:fix` | Fix style issues |
| `npm run type-check` | Check TypeScript |
| `npm run test:coverage` | Test with coverage |
| `npm run build:android` | Build APK/AAB |
| `npm run build:ios` | Build IPA |

## Next Steps

1. **Run the app**: `npm run dev` → `a` (Android) or `i` (iOS)
2. **Explore screens**: Navigate through mock data
3. **Read docs**: Check `docs/ARCHITECTURE.md` for system design
4. **Start coding**: Create your first component in `src/components/`
5. **Write tests**: Add test files alongside components

## Documentation

- **API Integration**: See `docs/API_SPECIFICATION.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Components**: See `docs/COMPONENTS.md` (to be created)
- **Testing**: See `docs/TESTING.md` (to be created)

## Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Redux Documentation**: https://redux.js.org/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Version**: 1.0.0  
**Last Updated**: December 23, 2025  
**Maintained By**: Development Team

