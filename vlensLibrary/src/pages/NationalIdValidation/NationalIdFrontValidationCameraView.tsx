import { useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import type { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import compressBase64Image from '../../utilities/compressBase64Image';
import { useI18n } from '../../localization/useI18n';
import { sdkConfig } from '../../appConfig';

type NationalIdFrontValidationCameraViewProps = {
    callback: (imageInBase64: string) => void;
};

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function NationalIdFrontValidationCameraView({ callback }: NationalIdFrontValidationCameraViewProps) {

    const isCameraActive = useRef(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const device = useCameraDevice('back');
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        // detection options
        landmarkMode: "none",
        performanceMode: "fast",
        classificationMode: "none",
        trackingEnabled: false,
        contourMode: "none",
        // convertFrame: true
    }).current

    const { detectFaces } = useFaceDetector(faceDetectionOptions)
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const [timerCount, setTimerCount] = useState(0);

    const { t } = useI18n();

    //timer counter
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCameraActive.current) {
            timer = setInterval(() => {
                setTimerCount(prevCount => prevCount + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, []);

    // Request Camera Permission
    useEffect(() => {
        console.log('requestPermission');
        const requestPermission = async () => {
            const status = await Camera.requestCameraPermission();
            setCameraPermission(status === 'granted');
        };
        requestPermission();
    }, []);


    const getBase64ImageFromCamera = async () => {
        if (isProcessing) {
            console.log('Processing is already in progress, skipping capture.');
            return;
        }
        setIsProcessing(true);
        console.log('getBase64ImageFromCamera called');
        if (!cameraRef) return;
        if (!isCameraActive.current) return;

        // Wait for a short duration to ensure the camera is ready
        await sleep(1500);
        console.log('Taking photo...');

        try {
            const photo = await cameraRef?.takePhoto({
                enableShutterSound: false,
            }); // TODO: Add options with image quality 
            console.log('Photo taken:', photo);
            if (photo) {
                var result = await RNFS.readFile(photo.path, 'base64');
                setIsProcessing(false);
                return result;
            } else {
                setIsProcessing(false);
                return
            }
        } catch (error) {
            console.log('Capture Error:', error);
            setIsProcessing(false);
            // Alert.alert('Error', 'Failed to capture image.');
            return
        }

    }

    // Capture Image
    const captureImage = async () => {
        const base64Image = await getBase64ImageFromCamera();
        if (typeof base64Image === 'string' && base64Image !== '') {
            var currentFaceValueCompressed = await compressBase64Image(base64Image);
            callback(currentFaceValueCompressed);
        }
    };

    // Face Detection
    const handleFacesDetection = Worklets.createRunOnJS(async (
        faces: Face[]
    ) => {
        if (Array.isArray(faces) && faces.length !== 0) {
            try {
                const currentFaceValue = await getBase64ImageFromCamera();
                if (typeof currentFaceValue === 'string' && currentFaceValue !== '') {
                    var currentFaceValueCompressed = await compressBase64Image(currentFaceValue);
                    console.log('Did get current face compressed Value:', currentFaceValueCompressed !== '');
                } else {
                    console.log('No valid image captured');
                    return;
                }
            } catch (error) {
                console.log('Error:', error);
                console.log('No face detected');
                return
            }

            if (currentFaceValueCompressed !== '') {
                console.log('Face Detected:', faces.length);
                isCameraActive.current = false;

                callback(currentFaceValueCompressed);
            } else {
                console.log('No face detected');
            }
        }
    })

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'

        if (sdkConfig.allowAutoCapture === false) {
            return;
        }

        if (timerCount < 3 || timerCount > 7) {
            return;
        }

        console.log('Processing frame for face detection...');

        const result = detectFaces(frame)
        handleFacesDetection(result)
    }, [handleFacesDetection])


    // Views

    const captureButtonView = () => {
        return (
            <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
                <View style={styles.captureCircle} />
            </TouchableOpacity>
        );
    }

    {/*  Camera Permission Denied View */ }
    if (!cameraPermission) {
        return (
            <View style={styles.container}>
                <Text>{t('camera_permission_msg')}</Text>
            </View>
        );
    }

    {/*  Camera Not Found View */ }
    if (!device) {
        return (
            <View style={styles.container}>
                <Text>{t('no_camera_device_found')}</Text>
            </View>
        );
    }

    console.log('Starting Camera to detect front side of National ID with all');

    return (
        <View style={styles.container}>
            <Camera
                ref={(ref) => setCameraRef(ref)}
                style={styles.camera}
                device={device}
                photo={true}
                isActive={Platform.OS === 'ios' ? true : isCameraActive.current}
                photoQualityBalance='quality'
                frameProcessor={frameProcessor}
            />

            {/* Capture Button */}
            <View style={styles.footer}>
                {
                    (sdkConfig.allowAutoCapture === false) ?
                        captureButtonView() : (
                            (timerCount > 7) ?
                                captureButtonView()
                                : null
                        )}
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    footer: {
        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    captureButton: {
        position: 'absolute',
        bottom: 90,
        alignSelf: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff', // Outer white circle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
    },
    captureCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: '#1a1a1a',
        borderWidth: 4,
        backgroundColor: '#fff',
    }
});