import { useState, useEffect } from 'react';
// import RNFS from 'react-native-fs';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import verifyIdFrontApi from '../../apis/front';
import verifyIdBackApi from '../../apis/back';
import compressBase64Image from '../../utilities/compressBase64Image';

import { useI18n } from '../../localization/useI18n';
import { sdkConfig } from '../../appConfig';
import NationalIdValidationLoadingView from './NationalIdValidationLoadingView';
import NationalIdValidationErrorView from './NationalIdValidationErrorView';
import CameraOverlayView from './CameraOverlayView';
import NationalIdFrontValidationCameraView from './NationalIdFrontValidationCameraView';
import NationalIdBackValidationCameraViewAndroid from './NationalIdBackValidationCameraViewAndroidML';
import NationalIdBackValidationCameraView from './NationalIdBackValidationCameraView';


const { width, height } = Dimensions.get('window');
const cardWidth = width;
const cardHeight = cardWidth * 0.6;

type NationalIdValidationPageProps = {
    onNext: (errorCode?: string, error?: string) => void;
    onPrev: () => void;
}

export default function NationalIdValidationPage({ onNext, onPrev }: NationalIdValidationPageProps) {

    const device = useCameraDevice('back');
    const [cameraPermission, setCameraPermission] = useState(false);
    // const [cameraRef, setCameraRef] = useState<Camera | null>(null);
    const [flash, setFlash] = useState(false);

    const [step, setStep] = useState<'front' | 'flip' | 'back'>('front');

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorCode, setErrorCode] = useState(-1);

    const [didPostFrontImage, setDidPostFrontImage] = useState(false);
    const [didPostBackImage, setDidPostBackImage] = useState(false);

    const [numberOfRetries, setNumberOfRetries] = useState(1);

    useEffect(() => {
        if (didPostFrontImage && didPostBackImage) {
            handleApiResponse();
        }
    }, [didPostFrontImage, didPostBackImage]);


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
        console.log('POST Front Image)');
        try {
            const base64Compressed = await compressBase64Image(base64);
            const transactionId = sdkConfig?.transactionId;
            await verifyIdFrontApi(transactionId, base64Compressed);
        } catch (error) {
            var errorMessage = '';
            var errorCode = -1;

            if (typeof error === 'object' && error !== null) {
                const { errorCode: code, errorMessage: message } = error as any;
                if (code !== undefined && message !== undefined) {
                    errorCode = code;
                    errorMessage = message;
                    console.log('API Response Error:', errorCode, errorMessage);
                } else {
                    console.log('Unexpected Error:', error);
                    errorMessage = 'Internet connection error.';
                }
            } else {
                console.log('Unexpected Error:', error);
                errorMessage = 'Internet connection error.';
            }

            if (errorMessage == '') {
                errorMessage = t('id_error_msg');
            }

            setErrorCode(errorCode);
            setErrorMsg(errorMessage);
            
        } finally {
            setDidPostFrontImage(true);
        }
    };

    const postBackImage = async (base64: string) => {
        console.log('POST Back Image)');
        setIsLoading(true);

        const base64Compressed = await compressBase64Image(base64);
        const transactionId = sdkConfig?.transactionId;

        try {
            var data = await verifyIdBackApi(transactionId, base64Compressed);
            sdkConfig.userData = data;
        } catch (error) {
            var _errorMessage = '';
            var _errorCode = -1;

            if (typeof error === 'object' && error !== null) {
                const { errorCode: code, errorMessage: message } = error as any;
                if (code !== undefined && message !== undefined) {
                    _errorCode = code;
                    _errorMessage = message;
                    console.log('API Response Error:', _errorCode, _errorMessage);
                } else {
                    console.log('Unexpected Error:', error);
                    _errorMessage = 'Internet connection error.';
                }
            } else {
                console.log('Unexpected Error:', error);
                _errorMessage = 'Internet connection error.';
            }

            if (_errorMessage == '') {
                _errorMessage = t('id_error_msg');
            }

            if (errorMsg == '' && errorCode == -1) { // Means there was no error before in front image
                setErrorCode(_errorCode);
                setErrorMsg(_errorMessage);
            }
        } finally {
            setDidPostBackImage(true);
        }
    };

    const handleApiResponse = () => {
        console.log('handleApiResponse:', { didPostFrontImage, didPostBackImage, errorMsg, errorCode });
        if (didPostFrontImage !== true || didPostBackImage !== true) {
            return;
        }

        setIsLoading(false);

        if (errorMsg !== '' || errorCode !== -1) {
            // console.log('Call OnNext with Error:', errorMsg, errorCode);
            // onNext(errorCode.toString(), errorMsg);
            return;
        }


        onNext();
    }

    // Camera Functions
    // const captureImage = async () => {
    //     if (!cameraRef) return;

    //     try {
    //         const photo = await cameraRef.takePhoto({ enableShutterSound: true }); // TODO: Add options with image quality 
    //         const base64 = await RNFS.readFile(photo.path, 'base64');

    //         didGetImage(base64);

    //     } catch (error) {
    //         console.log('Capture Error:', error);
    //         Alert.alert(t('Error'), t('faild_to_capture_image'));
    //     }
    // };

    const didGetImage = (base64: string) => {
        if (step === 'front') {
            console.log('Front Image Callback');
            // Alert.alert(t('success'), t('front_image_captured'));
            setStep('flip');
            postFrontImage(base64);

            setTimeout(() => {
                setStep('back');
            }, 2000);

            // clearTimeout(timeout); // Not needed

        } else if (step === 'back') {
            console.log('Back Image Callback');
            // Alert.alert(t('success'), t('back_image_captured'));
            postBackImage(base64);
        }
    }

    const toggleFlash = () => {
        console.log('Flash toggled');
        setFlash(!flash);
    };

    const handleRetryScanning = () => {
        console.log('Retry Scanning');
        setNumberOfRetries(numberOfRetries + 1);
        setErrorMsg('');
        setErrorCode(-1);
        setStep('front');
        setDidPostFrontImage(false);
        setDidPostBackImage(false);
    };

    const handleExist = () => {
        onNext(errorCode.toString(), errorMsg);
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
            <NationalIdValidationLoadingView />
        );
    }

    {/* Error View */ }
    if ((errorMsg !== '' || errorCode !== -1) && didPostBackImage === true && didPostFrontImage === true) {
        return (
            <NationalIdValidationErrorView
                errorMsg={errorMsg}
                isAllowedToRetry={numberOfRetries < sdkConfig.numberOfRetries}
                handleRetryScanning={handleRetryScanning}
                handleExist={handleExist}
            />
        );
    }

    {/* Camera View */ }
    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onPrev}>
                    <Image source={require('../../assets/arrow_left.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('camera')}</Text>
                <TouchableOpacity onPress={toggleFlash}>
                    <Image
                        source={flash === false ? require('../../assets/flash_turn_on_icon.png') : require('../../assets/flash_turn_off_icon.png')}
                        style={styles.headerIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.cameraContainer}>
                {/* Camera View */}

                {step === 'front' ? (
                    <NationalIdFrontValidationCameraView callback={didGetImage} />
                ) : (
                    Platform.OS === 'android' ? (
                        <NationalIdBackValidationCameraViewAndroid callback={didGetImage} />
                    ) : (
                        <NationalIdBackValidationCameraView callback={didGetImage} />
                    )
                )}

                {/* Card Overlay */}
                <CameraOverlayView step={step} />
            </View>

            {/* Capture Button */}
            {/* <View style={styles.footer}>
                {step !== 'flip' ?
                    <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
                        <View style={styles.captureCircle} />
                    </TouchableOpacity>
                    : null}
            </View> */}
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
        height: 100,
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
        height: height - 80, // Adjust height to fit header
        position: 'relative',
        overflow: 'hidden',
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
    },
    scanButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    scanButton: {
        backgroundColor: sdkConfig.colors.primary,
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 50,
        borderRadius: 16,
        marginVertical: 5,
        marginHorizontal: 20,
        width: "90%",
    },
    scanButtonText: {
        color: sdkConfig.colors.light,
        fontSize: 16,
        fontWeight: "bold",
    },
    existButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    existButton: {
        backgroundColor: sdkConfig.colors.light,
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 50,
        borderRadius: 16,
        marginVertical: 5,
        marginHorizontal: 20,
        width: "90%",
        borderWidth: 1,
        borderColor: sdkConfig.colors.primary
    },
    existButtonText: {
        color: sdkConfig.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    }
});