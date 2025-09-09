import { useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import compressBase64Image from '../../utilities/compressBase64Image';
import { useI18n } from '../../localization/useI18n';
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera';

type NationalIdBackValidationCameraViewProps = {
    callback: (imageInBase64: string) => void;
};

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function NationalIdBackValidationCameraView({ callback }: NationalIdBackValidationCameraViewProps) {

    const [isActive, setIsActive] = useState(true);
    const device = useCameraDevice('back');
    const isCamiraActive = useRef(true);
    const hasHandledScan = useRef(false);

    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const [timerCount, setTimerCount] = useState(0);

    const { t } = useI18n();

    //timer counter
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCamiraActive.current) {
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

        if (!cameraRef) return;
        if (!isCamiraActive.current && Platform.OS !== 'ios') return;

        try {
            const photo = await cameraRef?.takePhoto({
                enableShutterSound: false,
            }); // TODO: Add options with image quality 
            if (photo) {
                return await RNFS.readFile(photo.path, 'base64');
            } else {
                return
            }
        } catch (error) {
            console.log('Capture Error:', error);
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

    // Code scanner configuration for PDF417
    const codeScanner = useCodeScanner({
        codeTypes: ['pdf-417'],
        onCodeScanned: (codes) => {

            if (timerCount < 3 || timerCount > 7) {
                return;
            }

            console.log('Codes detected:', codes);

            if (codes.length > 0 && isActive && !hasHandledScan.current) {
                hasHandledScan.current = true;
                handleCodeScanned();

            }
        },
    });

    const handleCodeScanned = async () => {
        await sleep(1500);
        const imageInBase64 = await getBase64ImageFromCamera();

        // Pause scanning after detection
        isCamiraActive.current = false;
        setIsActive(false);


        if (!imageInBase64) {
            console.warn('No image captured from camera.');
            return;
        }
        const compressedImage = await compressBase64Image(imageInBase64); // Compress image to 50% quality
        console.log('Compressed Image:', compressedImage);
        // Call the callback with the compressed image
        callback(compressedImage);
        // Pause scanning after detection
    };


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
                photo={true}
                device={device}
                isActive={isActive}
                codeScanner={isActive ? codeScanner : undefined}
                onError={(error) => {
                    console.error('Camera error:', error);
                }}
            />

            {/* Capture Button */}
            <View style={styles.footer}>
                {timerCount > 7 ?
                    <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
                        <View style={styles.captureCircle} />
                    </TouchableOpacity>
                    : null}
            </View>
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