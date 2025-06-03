import { useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import type { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import compressBase64Image from '../../utilities/compressBase64Image';
import { useI18n } from '../../localization/useI18n';

type NationalIdFrontValidationCameraViewProps = {
    callback: (imageInBase64: string) => void;
};

export default function NationalIdFrontValidationCameraView({ callback }: NationalIdFrontValidationCameraViewProps) {

    const isCameraActive = useRef(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const device = useCameraDevice('back');
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        // detection options
        landmarkMode: "none",
        performanceMode: "accurate",
        classificationMode: "all",
        trackingEnabled: true,
        contourMode: "all",
        // convertFrame: true
    }).current

    const { detectFaces } = useFaceDetector(faceDetectionOptions)
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const { t } = useI18n();

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
            // Alert.alert('Error', 'Failed to capture image.');
            return
        }

    }

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
        const result = detectFaces(frame)
        handleFacesDetection(result)
    }, [handleFacesDetection])


    // Views
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});