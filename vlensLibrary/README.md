# VLens Library

VLens Library is a React-based SDK for integrating VLens functionalities into your applications.

## Installation

To install the VLens Library, use npm or yarn:

```bash
npm install react-native-vlens
```

## Additional Installation
```bash
npm install react-native-vision-camera react-native-vision-camera-face-detector react-native-worklets-core react-native-reanimated react-native-fs react-native-image-resizer
```

Then add the VisionCamera plugin to your Expo config (app.json, app.config.json or app.config.js): More details [here](https://react-native-vision-camera.com/docs/guides/).
```json
{
  "name": "my app",
  "plugins": [
    [
      "react-native-vision-camera",
      {
        "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera."
      }
    ]
  ]
}
```

Finally, compile the mods:
```bash
npm expo prebuild
```

## Usage

Here is a basic example of how to use the VLens Library in your React application:

```tsx
import VLensView from 'react-native-vlens';

<VLensView
    telencyName={_telencyName} 
    apiKey={_apiKey} 
    transactionId={transactionId}
    accessToken={accessToken}
    isLivenessOnly={isLivenessOnly.current}
    onSuccess={onVLensSuccess}
    onFaild={onVLensFaild}
/>

```

## Contact

For any questions or support, please contact us at mtaher@vlens.com.
