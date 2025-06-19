// import { useState, useEffect, useRef } from 'react';
// import RNFS from 'react-native-fs';
// import { StyleSheet, View, Text, Platform } from 'react-native';
// import compressBase64Image from '../../utilities/compressBase64Image';
// import { useI18n } from '../../localization/useI18n';
// import {
//     Camera,
//     useFrameProcessor,
//     useCameraDevice,
// } from 'react-native-vision-camera';

// import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';


// type NationalIdBackValidationCameraViewProps = {
//     callback: (imageInBase64: string) => void;
// };

// export default function NationalIdBackValidationCameraView({ callback }: NationalIdBackValidationCameraViewProps) {

//     const [isActive, setIsActive] = useState(true);
//     const device = useCameraDevice('back');
//     const isCamiraActive = useRef(true);
//     const hasHandledScan = useRef(false);

//     const [cameraPermission, setCameraPermission] = useState(false);
//     const [cameraRef, setCameraRef] = useState<Camera | null>(null);

//     const { t } = useI18n();

//     // Request Camera Permission
//     useEffect(() => {
//         console.log('requestPermission');
//         const requestPermission = async () => {
//             const status = await Camera.requestCameraPermission();
//             setCameraPermission(status === 'granted');
//         };
//         requestPermission();
//     }, []);


//     const getBase64ImageFromCamera = async () => {

//         if (!cameraRef) return;
//         if (!isCamiraActive.current && Platform.OS !== 'ios') return;

//         try {
//             const photo = await cameraRef?.takePhoto({
//                 enableShutterSound: false,
//             }); // TODO: Add options with image quality 
//             if (photo) {
//                 return await RNFS.readFile(photo.path, 'base64');
//             } else {
//                 return
//             }
//         } catch (error) {
//             console.log('Capture Error:', error);
//             // Alert.alert('Error', 'Failed to capture image.');
//             return
//         }

//     }

//     const handleCodeScanned = async () => {
//         const imageInBase64 = await getBase64ImageFromCamera();
//         if (!imageInBase64) {
//             console.warn('No image captured from camera.');
//             return;
//         }
//         const compressedImage = await compressBase64Image(imageInBase64); // Compress image to 50% quality
//         console.log('Compressed Image:', compressedImage);
//         // Call the callback with the compressed image
//         callback(compressedImage);
//         // Pause scanning after detection
//     };

//     const frameProcessor = useFrameProcessor((frame) => {
//         'worklet'
//         console.log('Processing frame...');
//         const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
//         if (detectedBarcodes.length > 0 && isActive && !hasHandledScan.current) {
//             hasHandledScan.current = true;
//             console.log('Codes detected:', detectedBarcodes);
//             handleCodeScanned();
//             // Pause scanning after detection
//             isCamiraActive.current = false;
//             setIsActive(false);
//         }
//         handleCodeScanned()
//     }, [handleCodeScanned])


//     // Views
//     {/*  Camera Permission Denied View */ }
//     if (!cameraPermission) {
//         return (
//             <View style={styles.container}>
//                 <Text>{t('camera_permission_msg')}</Text>
//             </View>
//         );
//     }

//     {/*  Camera Not Found View */ }
//     if (!device) {
//         return (
//             <View style={styles.container}>
//                 <Text>{t('no_camera_device_found')}</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Camera
//                 ref={(ref) => setCameraRef(ref)}
//                 style={styles.camera}
//                 photo={true}
//                 device={device}
//                 isActive={isActive}
//                 frameProcessor={frameProcessor}
//                 onError={(error) => {
//                     console.error('Camera error:', error);
//                 }}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#000',
//     },
//     camera: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//     },
// });