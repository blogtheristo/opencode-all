# 📱 Firehorse Mobile App
## React Native - iOS & Android

**Version**: 1.0.0  
**Date**: December 30, 2025  
**Status**: 🚀 Ready for Development

---

## 🎯 Overview

Firehorse Mobile App tuo työmaapäiväkirjan ja vastaanottotarkastuksen suoraan työmaan käyttöön. Täysi offline-tuki, automaattinen synkronointi, ja edge nodes -integraatio.

### Key Features

- ✅ **Offline-First**: Toimii ilman nettiyhteyttä
- ✅ **Auto-Sync**: Automaattinen synkronointi kun netti palaa
- ✅ **Camera Integration**: Kuvat ja videot suoraan päiväkirjaan
- ✅ **GPS Tagging**: Automaattinen sijaintitieto
- ✅ **Digital Signature**: Juridisesti pätevä allekirjoitus
- ✅ **Edge Nodes**: Reaaliaikainen data sää, lämpötila, työntekijät
- ✅ **360° Photos**: Panoraamakuvat VR-valmiina
- ✅ **Voice Input**: Puhesyöttö päiväkirjaan
- ✅ **Push Notifications**: Muistutukset päiväkirjan täyttöön

---

## 🏗️ Architecture

```
firehorse-mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── DiaryScreen.tsx
│   │   ├── InspectionScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── components/
│   │   ├── DiaryForm/
│   │   ├── PhotoCapture/
│   │   ├── SignaturePad/
│   │   ├── WeatherWidget/
│   │   └── WorkerCounter/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── sync.ts
│   │   ├── camera.ts
│   │   ├── gps.ts
│   │   ├── edgeNodes.ts
│   │   └── storage.ts
│   │
│   ├── store/
│   │   ├── diarySlice.ts
│   │   ├── inspectionSlice.ts
│   │   └── offlineSlice.ts
│   │
│   └── utils/
│       ├── validation.ts
│       ├── formatting.ts
│       └── offline.ts
│
├── ios/
├── android/
├── package.json
└── README.md
```

---

## 📦 Tech Stack

### Core
- **React Native**: 0.73+
- **TypeScript**: 5.0+
- **Expo**: 50+ (managed workflow)

### State Management
- **Redux Toolkit**: Global state
- **React Query**: Server state & caching
- **AsyncStorage**: Local persistence

### UI/UX
- **React Native Paper**: Material Design
- **React Navigation**: Navigation
- **React Native Reanimated**: Animations

### Camera & Media
- **expo-camera**: Camera access
- **expo-image-picker**: Photo/video picker
- **react-native-panorama**: 360° photos
- **expo-av**: Video recording

### Sensors & Location
- **expo-location**: GPS tracking
- **expo-sensors**: Device sensors
- **react-native-ble-plx**: Bluetooth (RFID)

### Offline & Sync
- **WatermelonDB**: Offline database
- **NetInfo**: Network status
- **Background Fetch**: Background sync

### Signature & Forms
- **react-native-signature-canvas**: Digital signature
- **react-hook-form**: Form management
- **yup**: Validation

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install Node.js 18+
node --version

# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for builds)
npm install -g eas-cli
```

### Installation

```bash
# Clone repository
cd Firehorse/mobile-app

# Install dependencies
npm install

# Start development server
expo start
```

### Run on Device

```bash
# iOS Simulator
expo start --ios

# Android Emulator
expo start --android

# Physical device (scan QR code with Expo Go app)
expo start
```

---

## 📱 Screens

### 1. Home Screen
- Päivän yhteenveto
- Viimeisimmät päiväkirjamerkinnät
- Nopeat toiminnot
- Synkronointitila

### 2. Diary Screen (Työmaapäiväkirja)
- **Auto-täyttö**: Sää, lämpötila, työntekijämäärä
- **Kamera**: Kuvat ja videot
- **Allekirjoitus**: Digitaalinen allekirjoitus
- **Offline**: Toimii ilman nettiä

### 3. Inspection Screen (Tarkastus)
- **360° kuvat**: Panoraamakuvaus
- **Puutelista**: AI-tunnistus
- **BIM-linkitys**: IFC GUID
- **Videot**: 4K-tallenteet

### 4. Camera Screen
- **Tavallinen**: Normaali kuva
- **360°**: Panoraamakuva
- **Video**: 4K-video
- **GPS**: Automaattinen sijaintitieto

### 5. Settings Screen
- Käyttäjätiedot
- Synkronointiasetukset
- Offline-tila
- Ilmoitukset

---

## 🔧 Key Features Implementation

### 1. Offline-First Architecture

```typescript
// services/offline.ts
import WatermelonDB from '@nozbe/watermelondb';
import NetInfo from '@react-native-community/netinfo';

class OfflineService {
  private db: WatermelonDB;
  private syncQueue: SyncItem[] = [];
  
  async saveDiaryOffline(entry: DiaryEntry) {
    // Save to local database
    await this.db.write(async () => {
      await this.db.collections
        .get('diary_entries')
        .create(entry);
    });
    
    // Add to sync queue
    this.syncQueue.push({
      type: 'diary',
      data: entry,
      timestamp: Date.now()
    });
    
    // Try to sync if online
    if (await this.isOnline()) {
      await this.sync();
    }
  }
  
  async sync() {
    const isOnline = await this.isOnline();
    if (!isOnline) return;
    
    for (const item of this.syncQueue) {
      try {
        await api.post('/sync', item);
        // Remove from queue on success
        this.syncQueue = this.syncQueue.filter(i => i !== item);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
  
  private async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }
}
```

### 2. Auto-Fill from Edge Nodes

```typescript
// services/edgeNodes.ts
import { BleManager } from 'react-native-ble-plx';

class EdgeNodeService {
  private bleManager: BleManager;
  
  async getWeatherData(): Promise<WeatherData> {
    // Connect to edge node via Bluetooth
    const device = await this.bleManager.connectToDevice('EDGE_NODE_001');
    
    // Read weather characteristics
    const temperature = await device.readCharacteristic(
      'WEATHER_SERVICE_UUID',
      'TEMPERATURE_CHAR_UUID'
    );
    
    const humidity = await device.readCharacteristic(
      'WEATHER_SERVICE_UUID',
      'HUMIDITY_CHAR_UUID'
    );
    
    return {
      temperature: this.parseTemperature(temperature.value),
      humidity: this.parseHumidity(humidity.value),
      timestamp: Date.now()
    };
  }
  
  async getWorkerCount(): Promise<number> {
    // Read RFID counter from edge node
    const device = await this.bleManager.connectToDevice('EDGE_NODE_001');
    
    const workerCount = await device.readCharacteristic(
      'RFID_SERVICE_UUID',
      'WORKER_COUNT_CHAR_UUID'
    );
    
    return parseInt(workerCount.value, 10);
  }
}
```

### 3. Camera with GPS Tagging

```typescript
// components/PhotoCapture/index.tsx
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export const PhotoCapture = () => {
  const [camera, setCamera] = useState<Camera | null>(null);
  
  const takePicture = async () => {
    if (!camera) return;
    
    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    // Take photo
    const photo = await camera.takePictureAsync({
      quality: 1,
      exif: true,
      base64: false
    });
    
    // Add GPS metadata
    const photoWithGPS = {
      ...photo,
      gps: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy
      },
      timestamp: Date.now()
    };
    
    // Save to local storage
    await savePhoto(photoWithGPS);
    
    // Add to sync queue
    await offlineService.addToSyncQueue({
      type: 'photo',
      data: photoWithGPS
    });
  };
  
  return (
    <Camera
      ref={setCamera}
      style={{ flex: 1 }}
      type={Camera.Constants.Type.back}
    >
      <TouchableOpacity onPress={takePicture}>
        <Text>Take Photo</Text>
      </TouchableOpacity>
    </Camera>
  );
};
```

### 4. Digital Signature

```typescript
// components/SignaturePad/index.tsx
import SignatureCanvas from 'react-native-signature-canvas';

export const SignaturePad = ({ onSave }: Props) => {
  const handleSignature = async (signature: string) => {
    // Get device info for audit trail
    const deviceInfo = await Device.getDeviceInfoAsync();
    
    // Get location
    const location = await Location.getCurrentPositionAsync();
    
    // Create signature object
    const signatureData = {
      signature: signature, // Base64 image
      timestamp: Date.now(),
      deviceInfo: {
        model: deviceInfo.modelName,
        os: deviceInfo.osName,
        osVersion: deviceInfo.osVersion
      },
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      ipAddress: await getIPAddress(),
      legallyBinding: true
    };
    
    onSave(signatureData);
  };
  
  return (
    <SignatureCanvas
      onOK={handleSignature}
      descriptionText="Allekirjoita tähän"
      clearText="Tyhjennä"
      confirmText="Vahvista"
      webStyle={`
        .m-signature-pad {
          border: 2px solid #3b82f6;
          border-radius: 8px;
        }
      `}
    />
  );
};
```

### 5. 360° Panorama Photos

```typescript
// components/PanoramaCapture/index.tsx
import { Panorama } from 'react-native-panorama';

export const PanoramaCapture = () => {
  const capturePanorama = async () => {
    const panorama = await Panorama.capture({
      quality: 1,
      format: 'equirectangular',
      resolution: '4K'
    });
    
    // Add metadata
    const panoramaWithMeta = {
      ...panorama,
      gps: await Location.getCurrentPositionAsync(),
      timestamp: Date.now(),
      vrReady: true,
      format: 'equirectangular'
    };
    
    // Save and queue for sync
    await savePanorama(panoramaWithMeta);
    await offlineService.addToSyncQueue({
      type: 'panorama',
      data: panoramaWithMeta
    });
  };
  
  return (
    <View>
      <Button onPress={capturePanorama}>
        Ota 360° Kuva
      </Button>
    </View>
  );
};
```

---

## 📊 State Management

### Redux Store Structure

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import diaryReducer from './diarySlice';
import inspectionReducer from './inspectionSlice';
import offlineReducer from './offlineSlice';

export const store = configureStore({
  reducer: {
    diary: diaryReducer,
    inspection: inspectionReducer,
    offline: offlineReducer
  }
});

// Diary Slice
const diarySlice = createSlice({
  name: 'diary',
  initialState: {
    entries: [],
    currentEntry: null,
    autoFillData: {
      weather: null,
      workers: null,
      equipment: null
    },
    syncStatus: 'idle'
  },
  reducers: {
    setAutoFillData: (state, action) => {
      state.autoFillData = action.payload;
    },
    saveEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    }
  }
});
```

---

## 🔔 Push Notifications

```typescript
// services/notifications.ts
import * as Notifications from 'expo-notifications';

class NotificationService {
  async scheduleDaily Reminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Muista täyttää työmaapäiväkirja! 📋",
        body: "Päivän päiväkirjamerkintä odottaa",
        data: { screen: 'Diary' }
      },
      trigger: {
        hour: 16,
        minute: 0,
        repeats: true
      }
    });
  }
  
  async notifySyncComplete(itemCount: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Synkronointi valmis ✓",
        body: `${itemCount} kohdetta synkronoitu palvelimelle`
      },
      trigger: null // Immediate
    });
  }
}
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests (Detox)
npm run test:e2e:ios
npm run test:e2e:android

# Coverage
npm run test:coverage
```

---

## 📦 Build & Deploy

### Development Build

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Production Build

```bash
# iOS App Store
eas build --profile production --platform ios

# Android Play Store
eas build --profile production --platform android
```

### Over-the-Air Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"
```

---

## 🎯 Roadmap

### Phase 1 (Q1 2026) ✅
- [x] Basic diary functionality
- [x] Camera integration
- [x] Offline support
- [x] Digital signature

### Phase 2 (Q2 2026)
- [ ] Edge nodes integration
- [ ] 360° photos
- [ ] AI defect detection
- [ ] BIM viewer

### Phase 3 (Q3 2026)
- [ ] Voice input
- [ ] AR annotations
- [ ] Blockchain audit trail
- [ ] Multi-language

### Phase 4 (Q4 2026)
- [ ] Wearable support (Apple Watch)
- [ ] Drone integration
- [ ] Advanced analytics
- [ ] Team collaboration

---

## 📞 Support

- **Technical**: support@dws6.com
- **Mobile**: mobile@dws6.com
- **Documentation**: https://docs.dws6.com/mobile

---

**Status**: 🚀 Ready for Development  
**Platform**: iOS 14+ | Android 8+  
**Last Updated**: December 30, 2025
