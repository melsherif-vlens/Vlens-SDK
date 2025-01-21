import { useState, useEffect, useRef } from 'react';
import RNFS from 'react-native-fs';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform, Vibration } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import type { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'

import verifyFaceApi from '../apis/face';
import compressBase64Image from '../utilities/compressBase64Image';

import { useI18n } from '../localization/useI18n';
import { sdkConfig } from '../appConfig';
import SoundPlayer from 'react-native-sound-player'


type FaceValidationPageProps = {
    onNext: (error?: string) => void;
    onPrev: () => void;
}

export default function FaceValidationPage({ onNext, onPrev }: FaceValidationPageProps) {

    const device = useCameraDevice('front');
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
    const [stepNumber, setStepNumber] = useState(0);

    const face1 = useRef<string>('');
    const face2 = useRef<string>('');
    const face3 = useRef<string>('');
    const face1Value = useRef<string>('');
    const face2Value = useRef<string>('');
    const face3Value = useRef<string>('');

    const isCamiraActive = useRef(true);

    const [isLoading, setIsLoading] = useState(false);
    var isProcessing = false;

    const { t } = useI18n();


    // Get Random Faces
    const getRandomFaces = (): string[] => {

        let flow1 = ['Blinking', 'Turned Right', 'Smile'];
        let flow2 = ['Blinking', 'Turned Left', 'Smile'];
        let flow3 = ['Smile', 'Turned Right', 'Blinking'];
        let flow4 = ['Smile', 'Turned Left', 'Blinking'];
        let flow5 = ['Blinking', 'Turned Right', 'Looking Straight'];
        let flow6 = ['Blinking', 'Turned Left', 'Looking Straight'];
        let flow7 = ['Smile', 'Turned Right', 'Looking Straight'];
        let flow8 = ['Smile', 'Turned Left', 'Looking Straight'];
        let flow9 = ['Blinking', 'Smile', 'Looking Straight'];
        let flow10 = ['Smile', 'Blinking', 'Looking Straight'];

        let flows = [flow1, flow2, flow3, flow4, flow5, flow6, flow7, flow8, flow9, flow10];

        let randomFlowIndex = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

        return flows[randomFlowIndex] ?? flow1;
    };

    const selectRandomFaces = () => {
        let randomFaces = getRandomFaces()//faceOptions.sort(() => Math.random() - 0.5).slice(0, 3);

        face1.current = randomFaces[0] ?? '';
        face2.current = randomFaces[1] ?? '';
        face3.current = randomFaces[2] ?? '';
    };

    const getCurrenFaceName = () => {
        switch (stepNumber) {
            case 0:
                return face1.current;
            case 1:
                return face2.current;
            default:
                return face3.current;
        }
    }


    const getCurrentFaceImageSource = () => {
        var currentFaceName = getCurrenFaceName();

        switch (currentFaceName) {
            case 'Blinking':
                return require('../assets/Blinking.png');
            case 'Smile':
                return require('../assets/Smile.png');
            case 'Turned Right':
                return require('../assets/Turned Right.png');
            case 'Turned Left':
                return require('../assets/Turned Left.png');
            default:
                return require('../assets/Looking Straight.png');
        }
    };

    const getCurrentFaceSoundSource = () => {
        var currentFaceName = getCurrenFaceName();

        var currentLocal = sdkConfig?.defaultLocale ?? 'en';

        if (currentLocal === 'ar') {
            switch (currentFaceName) {
                case 'Blinking':
                    return require('../assets/sounds/ar/blink.mp3');
                case 'Smile':
                    return require('../assets/sounds/ar/smile.mp3');
                case 'Turned Right':
                    return require('../assets/sounds/ar/right.mp3');
                case 'Turned Left':
                    return require('../assets/sounds/ar/left.mp3');
                default:
                    return require('../assets/sounds/ar/look_directly.mp3');
            }
        } else {
            switch (currentFaceName) {
                case 'Blinking':
                    return require('../assets/sounds/en/blink.mp3');
                case 'Smile':
                    return require('../assets/sounds/en/smile.mp3');
                case 'Turned Right':
                    return require('../assets/sounds/en/right.mp3');
                case 'Turned Left':
                    return require('../assets/sounds/en/left.mp3');
                default:
                    return require('../assets/sounds/en/look_directly.mp3');
            }
        }
    }

    useEffect(() => {
        console.log('selectRandomFaces');
        selectRandomFaces();
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

    useEffect(() => {
        if (face1Value.current !== '' && face2Value.current !== '' && face3Value.current !== '') {
            setIsLoading(true);
            postFacesImage(face1Value.current, face2Value.current, face3Value.current);
        }
    }, [face3Value.current]);

    // API Calls
    const postFacesImage = async (face1: string, face2: string, face3: string) => {

        console.log('calling postFacesImage API');

        const transactionId = sdkConfig?.transactionId;

        try {
            const data = await verifyFaceApi(transactionId, face1, face2, face3);

            if (data.isVerificationProcessCompleted && data.isDigitalIdentityVerified) {
                onNext();
            } else {
                onNext(t('div_failed'));
            }


        } catch (error) {
            if (error instanceof Error) {
                console.log('Error:', error.message);
                onNext(error.message);

            } else {
                console.log('Unexpected Error:', error);
                console.log('Error during ID back verification:', error);
                onNext(t('div_failed'));
            }
            setIsLoading(false);
        }

    };

    const getBase64ImageFromCamira = async () => {

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

    // Paly Sound
    const playSound = () => {
        try {
            let path = getCurrentFaceSoundSource();
            console.log('Playing Sound:', path);
            SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
                console.log('Finished Playing:', success);
                isProcessing = false;
            });

            isProcessing = true;
            SoundPlayer.playAsset(path);
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    };

    // Face Detection
    const handleFacesDetection = Worklets.createRunOnJS(async (
        faces: Face[]
    ) => {

        if (isProcessing === true || face3Value.current !== '' || stepNumber === 3) {
            console.log('Already have Frame in Processor', isProcessing ? 'true' : 'false');
            return;
        }

        isProcessing = true;
        // console.log('Frame Processor', isProcessing ? 'true' : 'false');


        if (isLoading) {
            // console.log('stop processing due to loading');
            // setIsProcessing(false);
            isProcessing = false;
            return;
        }

        if (Array.isArray(faces) && faces.length !== 0) {

            console.log('handleFacesDetection');

            const face = faces[0];

            if (!face) {
                console.log('No face detected');
                isProcessing = false;
                return;
            }

            const leftEyeOpenProbability = face.leftEyeOpenProbability;
            const rightEyeOpenProbability = face.rightEyeOpenProbability;
            const yawAngle = face.yawAngle;
            const smilingProbability = face.smilingProbability;

            console.log('Face Detected with:', leftEyeOpenProbability, rightEyeOpenProbability, yawAngle, smilingProbability);
            // Blink Detection (eyes closed)

            console.log('Current Step:', stepNumber);

            var currentFace = '';
            var currentFaceValue = '';

            if (stepNumber === 0) {
                currentFace = face1.current;
            } else if (stepNumber === 1) {
                currentFace = face2.current;
            } else if (stepNumber === 2) {
                currentFace = face3.current;
            } else {
                console.log('stop processing stepNumber:', stepNumber);
                // setIsProcessing(false);
                isProcessing = false;
                return;
            }

            console.log('Current Face:', currentFace);
            console.log('all faces:', face1, face2, face3);

            if (currentFace == 'Blinking') {
                if (leftEyeOpenProbability < 0.1 && rightEyeOpenProbability < 0.1) {
                    console.log('Blinking');
                    // needsToGetPicture = true;
                    currentFaceValue = await getBase64ImageFromCamira() as string;
                }
            }

            if (currentFace == 'Smile') {
                if (smilingProbability > 0.3) {
                    console.log('Smile');
                    // needsToGetPicture = true;
                    currentFaceValue = await getBase64ImageFromCamira() as string;
                }
            }

            if (currentFace == 'Turned Right') {
                if (yawAngle > 13) {
                    console.log('Turned Right');
                    // needsToGetPicture = true;
                    currentFaceValue = await getBase64ImageFromCamira() as string;
                }
            }

            if (currentFace == 'Turned Left') {
                if (yawAngle < -13) {
                    console.log('Turned Left');
                    // needsToGetPicture = true;
                    currentFaceValue = await getBase64ImageFromCamira() as string;
                }
            }

            if (currentFace == 'Looking Straight') {
                if (yawAngle > -10 && yawAngle < 10) {
                    console.log('Looking Straight');
                    // needsToGetPicture = true;
                    currentFaceValue = await getBase64ImageFromCamira() as string;
                }
            }

            if (currentFaceValue === '') {
                // console.log('stop processing');
                // setIsProcessing(false);
                isProcessing = false;
                return;
            }
            try {
                var currentFaceValueCompressed = await compressBase64Image(currentFaceValue);
                console.log('Did get current face compressed Value:', currentFaceValueCompressed !== '');
            } catch (error) {
                console.log('Error:', error);
                // console.log('stop processing');
                // setIsProcessing(false);
                isProcessing = false;
                return
            }

            if (currentFaceValueCompressed !== null) {

                console.log('---> Face Detected:', currentFace);
                Vibration.vibrate(1000);
                SoundPlayer.playAsset(require('../assets/sounds/success.mp3'));

                setTimeout(() => {
                    // compress image before save
                    if (stepNumber === 0) {
                        // stepNumber.current = 1;
                        // setFace1Value(currentFaceValueCompressed);
                        face1Value.current = currentFaceValueCompressed;
                        setStepNumber(1);
                    } else if (stepNumber === 1) {
                        // stepNumber.current = 2;
                        // setFace2Value(currentFaceValueCompressed);
                        face2Value.current = currentFaceValueCompressed;
                        setStepNumber(2);
                    } else if (stepNumber === 2) {

                        // stepNumber.current = 3;
                        // setFace3Value(currentFaceValueCompressed);
                        face3Value.current = currentFaceValueCompressed;
                        isCamiraActive.current = false;
                        setStepNumber(3);
                    }

                    isProcessing = false;
                }, 3000);

                return;
            }

        } else {
            // console.log('No Face Detected');
        }

        // console.log('Face Detection Base64 Result:', result.frame.converted);
        // console.log('stop processing');
        // setIsProcessing(false);
        isProcessing = false;
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
                    <Text style={styles.title}>{t('verifying_your_identity')}</Text>
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
                <Text style={styles.instructions}>
                    {t('verifying_your_identity')}
                </Text>

                {/* Footer */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>{t('powered_by')}</Text>
                    <Image source={require('../assets/vlens_logo_powered_by_icon.png')} style={styles.footerIcon} />
                </View>

            </View>
        );
    }

    {/* Camera View */ }

    if (stepNumber < 3 && face3Value.current === '') {
        playSound();
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onPrev}>
                    <Image source={require('../assets/arrow_left.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('camera')}</Text>
            </View>

            {/* Camera View */}
            <View style={styles.cameraContainer}>

                <Camera
                    ref={(ref) => setCameraRef(ref)}
                    style={styles.camera}
                    device={device}
                    photo={true}
                    isActive={Platform.OS === 'ios' ? true : isCamiraActive.current}
                    photoQualityBalance='quality'
                    frameProcessor={frameProcessor}
                />

                {/* Instruction Overlay */}
                <View style={styles.overlay}>
                    <Image source={getCurrentFaceImageSource()} style={styles.InstructionIcon} />
                    <Text style={styles.instructionText}>
                        {stepNumber === 0 ? t(face1.current) : ''}
                        {stepNumber === 1 ? t(face2.current) : ''}
                        {stepNumber === 2 ? t(face3.current) : ''}
                    </Text>
                </View>

            </View>

            {/* Footer */}
            <View style={styles.footer}>

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
        textAlign: 'center',
        flex: 1,
        marginEnd: 30,
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
    InstructionIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#13172295',
        marginBottom: 50,
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
        height: 60,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
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