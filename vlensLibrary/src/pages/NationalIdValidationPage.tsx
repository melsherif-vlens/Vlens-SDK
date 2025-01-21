import { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Dimensions, Image } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import verifyIdFrontApi from '../apis/front';
import verifyIdBackApi from '../apis/back';
import compressBase64Image from '../utilities/compressBase64Image';

import { useI18n } from '../localization/useI18n';
import { sdkConfig } from '../appConfig';


const { width } = Dimensions.get('window');
const cardWidth = width;
const cardHeight = cardWidth * 0.6;

type NationalIdValidationPageProps = {
    onNext: (error?: string) => void;
    onPrev: () => void;
}

export default function NationalIdValidationPage({ onNext, onPrev }: NationalIdValidationPageProps) {

    const device = useCameraDevice('back');
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [flash, setFlash] = useState(false);

    const [step, setStep] = useState<'front' | 'back'>('front');

    const [isLoading, setIsLoading] = useState(false);

    const { t } = useI18n();

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
        const transactionId = sdkConfig?.transactionId;
        await verifyIdFrontApi(transactionId, base64Compressed);
    };

    const postBackImage = async (base64: string) => {
        setIsLoading(true);

        const base64Compressed = await compressBase64Image(base64);
        const transactionId = sdkConfig?.transactionId;

        try {
            await verifyIdBackApi(transactionId, base64Compressed);
            onNext();

        } catch (error) {
            if (error instanceof Error) {
                console.log('Error Message:', error.message);
                Alert.alert(t('Error'), error.message);
                onNext(error.message);

            } else {
                console.log('Unexpected Error:', error);
                console.log('Error during ID back verification:', error);
                Alert.alert(t('Error'), t('internet_connection_error'));
                onNext('Internet connection error.');
            }

            setIsLoading(false);
        }
    };

    // Camera Functions
    const captureImage = async () => {
        if (!cameraRef) return;

        try {
            const photo = await cameraRef.takePhoto({ enableShutterSound: true }); // TODO: Add options with image quality 
            const base64 = await RNFS.readFile(photo.path, 'base64');

            if (step === 'front') {
                // Alert.alert(t('success'), t('front_image_captured'));
                setStep('back');
                postFrontImage(base64);
            } else if (step === 'back') {
                // Alert.alert(t('success'), t('back_image_captured'));
                postBackImage(base64);
            }
        } catch (error) {
            console.log('Capture Error:', error);
            Alert.alert(t('Error'), t('faild_to_capture_image'));
        }
    };

    const toggleFlash = () => {
        console.log('Flash toggled');
        setFlash(!flash);
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

    {/* Loading View */ }
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>

                {/* Logo and Title */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/vlens_logo_temp.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>{t('scanning_your_id')}</Text>
                </View>

                {/* Scanning Illustration */}
                <View style={styles.scanIllustrationContainer}>
                    <View style={styles.scanIllustration}>
                        <Image
                            source={require('../assets/face_id_vector.png')}
                            style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }}
                        />
                    </View>
                </View>

                {/* Instructions */}
                <Text style={styles.instructions}>{t('processing_your_id')}</Text>

                {/* Footer */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>{t('powered_by')}</Text>
                    <Image source={require('../assets/vlens_logo_powered_by_icon.png')} style={styles.footerIcon} />
                </View>

            </View>
        );
    }

    {/* Camera View */ }
    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onPrev}>
                    <Image source={require('../assets/arrow_left.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('camera')}</Text>
                <TouchableOpacity onPress={toggleFlash}>
                    <Image
                        source={flash === false ? require('../assets/flash_turn_on_icon.png') : require('../assets/flash_turn_off_icon.png')}
                        style={styles.headerIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.cameraContainer}>
                {/* Camera View */}
                <Camera
                    ref={(ref) => setCameraRef(ref)}
                    style={styles.camera}
                    device={device}
                    isActive={true}
                    photo={true}
                    torch={flash == true ? 'on' : 'off'}
                />

                {/* Card Overlay */}
                <View style={styles.overlay}>
                    <Image
                        source={step === 'front' ? require('../assets/scanning_natioanl_id_front_vector.png') : require('../assets/scanning_natioanl_id_back_vector.png')}
                        style={styles.cardOutlineImage}
                    />
                    <Text style={styles.instructionText}>
                        {step === 'front' ? t('align_id_front_side_msg') : t('align_id_back_side_msg')}
                    </Text>
                </View>
            </View>

            {/* Capture Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
                    <View style={styles.captureCircle} />
                </TouchableOpacity>
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
    header: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#1a1a1a',
        paddingTop: 50,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    cameraContainer: {
        flex: 1,
        position: 'relative'
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    cardOutlineImage: {
        width: cardWidth,
        height: cardHeight,
        resizeMode: 'contain',
        position: 'absolute',
        top: '30%',
    },
    instructionText: {
        width: '80%',
        bottom: 20,
        lineHeight: 22,
        paddingVertical: 8,
        paddingHorizontal: 50,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        borderRadius: 10,
        backgroundColor: '#13172295',
    },
    footer: {
        height: 160,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
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
    },
    logoContainer: {
        alignItems: "center",
        margin: 20,
    },
    logo: {
        width: 150,
        height: 100,
        resizeMode: "contain",
        marginTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: sdkConfig.colors.primary,
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: sdkConfig.colors.background,
    },
    scanIllustrationContainer: {
        flex: 1,
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scanIllustration: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: sdkConfig.colors.secondary,
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    instructions: {
        textAlign: "center",
        fontSize: 18,
        color: sdkConfig.colors.accent,
        paddingHorizontal: 40,
        marginBottom: 80,
        lineHeight: 25,
    },
    footerContainer: {
        height: 60,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: 40,
    },
    footerText: {
        fontSize: 14,
        color: sdkConfig.colors.accent,
        alignItems: "center",
        paddingTop: 4,
        paddingEnd: 5,
    },
    footerIcon: {
        width: 60,
        height: 20,
        resizeMode: "contain",
    }
});