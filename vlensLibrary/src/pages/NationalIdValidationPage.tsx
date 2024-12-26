import { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import verifyIdFrontApi from '../apis/front';
import verifyIdBackApi from '../apis/back';
import compressBase64Image from '../utilities/compressBase64Image';

import type { VLensSdkProps } from '../types/VLensSdkProps';

const NationalIdValidationPage = (props: VLensSdkProps) => {

    const device = useCameraDevice('back');
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);

    const [step, setStep] = useState<'front' | 'back'>('front');

    const [isLoading, setIsLoading] = useState(false);

    // Request Camera Permission
    useEffect(() => {
        const requestPermission = async () => {
            const status = await Camera.requestCameraPermission();
            setCameraPermission(status === 'granted');
        };
        requestPermission();
    }, []);

    // API Calls
    const postFrontImage = async (base64: string) => {

        const base64Compressed = await compressBase64Image(base64);

        const transactionId     = props?.transactionId;
        const apiKey            = props?.apiKey;
        const telencyName       = props?.telencyName;
        const accessToken       = props.accessToken;

        await verifyIdFrontApi(accessToken, apiKey, telencyName, transactionId, base64Compressed);
    };

    const postBackImage = async (base64: string) => {
        setIsLoading(true);

        const base64Compressed = await compressBase64Image(base64);

        const transactionId     = props?.transactionId;
        const apiKey            = props?.apiKey;
        const telencyName       = props?.telencyName;
        const accessToken       = props?.accessToken;
        const onSuccess         = props?.onSuccess;
        const onFaild           = props?.onFaild;

        try {
            await verifyIdBackApi(accessToken, apiKey, telencyName, transactionId, base64Compressed);
            onSuccess();

        } catch (error) {
            if (error instanceof Error) {
                console.log('Error Message:', error.message);
                Alert.alert('Error', error.message);
                onFaild(error.message);

            } else {
                console.log('Unexpected Error:', error);
                console.log('Error during ID back verification:', error);
                Alert.alert('Error', 'Internet connection error.');
                onFaild('Internet connection error.');
            }
            
            setIsLoading(false);
        }
    };

    // Camera Functions
    const captureImage = async () => {
        if (!cameraRef) return;

        try {
            const photo = await cameraRef.takePhoto({enableShutterSound: true}); // TODO: Add options with image quality 
            const base64 = await RNFS.readFile(photo.path, 'base64');

            if (step === 'front') {
                Alert.alert('Success', 'Front image captured.');
                setStep('back');
                postFrontImage(base64);
            } else if (step === 'back') {
                Alert.alert('Success', 'Back image captured.');
                postBackImage(base64);
            }
        } catch (error) {
            console.log('Capture Error:', error);
            Alert.alert('Error', 'Failed to capture image.');
        }
    };

    // Views
    if (!cameraPermission) {
        return (
            <View style={styles.center}>
                <Text>Camera permission is required to use this feature.</Text>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.center}>
                <Text>No camera device found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Camera View */}
            <Camera
                ref={(ref) => setCameraRef(ref)}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />

            {/* Card Overlay */}
            <View style={styles.overlay}>
                <View style={styles.cardFrame}>

                </View>
            </View>

            {/* Capture Button */}
            <View style={styles.controls}>
                <Text style={styles.cardInstruction}>
                    {step === 'front'
                        ? 'Align the front side of the ID within the frame'
                        : 'Align the back side of the ID within the frame'}
                </Text>
                <TouchableOpacity style={styles.captureButton} onPress={captureImage} disabled={isLoading}>
                    <View style={styles.captureCircle} />
                </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>Uploading...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFrame: {
        width: 350,
        height: 220,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    },
    cardInstruction: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        width: '100%',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'gray',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
});

export default NationalIdValidationPage;