# VLens Library

VLens Library is a React-based SDK for integrating VLens functionalities into your applications.

## Installation

To install the VLens Library, use npm or yarn:

```bash
npm install react-native-vlens
```

## Additional Installation
```bash
npm install react-native-vision-camera react-native-vision-camera-face-detector react-native-worklets-core react-native-reanimated react-native-fs react-native-image-resizer react-native-sound-player
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
  transactionId={transactionId}
  isLivenessOnly={false}
  isNationalIdOnly={false}
  env={{
    apiBaseUrl: 'https://api.vlenseg.com',
    accessToken: accessToken,
    refreshToken: '',
    apiKey: _apiKey,
    tenancyName: _telencyName,
  }}
  defaultLocale={'en'}
  colors={{
    accent: '#4E5A78',
    primary: '#397374',
    secondary: '#AF9759',
    background: '#FEFEFE',
    dark: '#000000',
    light: '#FFFFFF',
  }}
  errorMessages={[]} // Coming soon
  onSuccess={onVLensSuccess}
  onFaild={onVLensFaild}
/>

```

### Props

### Required Props

1. **transactionId**
   - Type: `string`
   - Description: A unique identifier for the transaction.

2. **isLivenessOnly**
   - Type: `boolean`
   - Description: If `true`, only the liveness detection will be performed.

3. **env**
   - Type: `object`
   - Description: Environment configuration containing API details.
   - Fields:
     - **apiBaseUrl**: Base URL for the VLens API.
     - **accessToken**: Authorization token for API access.
     - **refreshToken**: Token for refreshing the session (if applicable).
     - **apiKey**: API key for authentication.
     - **tenancyName**: The tenant's name for identification.

4. **onSuccess**
   - Type: `function`
   - Description: Callback invoked when the operation succeeds.
   - Arguments:
     - Response object containing success details.

5. **onFaild**
   - Type: `function`
   - Description: Callback invoked when the operation fails.
   - Arguments:
     - Response object containing error details.

### Optional Props

1. **isNationalIdOnly**
   - Type: `boolean`
   - Default: `false`
   - Description: If `true`, only national ID scanning will be performed.

2. **defaultLocale**
   - Type: `string`
   - Default: `'en'`
   - Description: Sets the default language for the component (e.g., `'en'` for English).

3. **colors**
   - Type: `object`
   - Description: Customize the color palette for the component's UI.
   - Fields:
     - **accent**: Accent color.
     - **primary**: Primary color.
     - **secondary**: Secondary color.
     - **background**: Background color.
     - **dark**: Dark theme color.
     - **light**: Light theme color.

4. **errorMessages**
   - Type: `array`
   - Default: `[]`
   - Description: Custom error messages for specific scenarios. (Coming soon)

## Callbacks

1. **onSuccess(response)**
   - Triggered when the operation is successful.
   - `response`: Contains the result data.

2. **onFaild(error)**
   - Triggered when the operation fails.
   - `error`: Contains error details.

## Notes
- Ensure all required props are properly configured to avoid unexpected behavior.
- Customize the `colors` prop to match the application's theme.
- The `errorMessages` feature is planned for future updates and is currently a placeholder.

## Styling
The `colors` prop allows you to control the UI theme. For example:

```javascript
colors={{
  accent: '#4E5A78',
  primary: '#397374',
  secondary: '#AF9759',
  background: '#FEFEFE',
  dark: '#000000',
  light: '#FFFFFF',
}}
```


## Contact
For any questions or support, please contact us at support@vlenseg.com.
