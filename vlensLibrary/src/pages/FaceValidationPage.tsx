import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import type { Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'

import verifyFaceApi from '../apis/face';
import compressBase64Image from '../utilities/compressBase64Image';

import type { VLensSdkProps } from '../types';

const FaceValidationPage = (props: VLensSdkProps) => {

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

    const faceOptions = ['Smile', 'Blinking', 'Turned Right', 'Turned Left', 'Looking Straight'];
    const selectRandomFaces = () => {
        let randomFaces = faceOptions.sort(() => Math.random() - 0.5).slice(0, 3);
        
        face1.current = randomFaces[0] ?? '';
        face2.current = randomFaces[1] ?? '';
        face3.current = randomFaces[2] ?? '';
    };
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

        const transactionId     = props?.transactionId;
        const apiKey            = props?.apiKey;
        const telencyName       = props?.telencyName;
        const accessToken       = props?.accessToken;

        try {
            const data = await verifyFaceApi(accessToken, apiKey, telencyName, transactionId, face1, face2, face3);

            if (data.isVerificationProcessCompleted && data.isDigitalIdentityVerified) {
                // Alert.alert('Success', 'Digital Identity verified successfully.', [
                //     {
                //         text: 'OK',
                //         onPress: () => {
                //             props?.onSuccess();
                //         },
                //     },
                // ]);

                props?.onSuccess();
            } else {
                // Alert.alert('Error', 'Digital Identity verification failed.', [
                //     {
                //         text: 'OK',
                //         onPress: () => {
                //             props?.onFaild('Digital Identity verification failed.');
                //         },
                //     },
                // ]);
                props?.onFaild('Digital Identity verification failed.');
            }


        } catch (error) {
            if (error instanceof Error) {
                console.log('Error:', error.message);
                props?.onFaild(error.message);

            } else {
                console.log('Unexpected Error:', error);
                console.log('Error during ID back verification:', error);
                // Alert.alert('Error', 'Internet connection error.', [
                //     {
                //         text: 'OK',
                //         onPress: () => {
                //             props?.onFaild('Digital Identity verification failed.');
                //         },
                //     },
                // ]);

                props?.onFaild('Digital Identity verification failed.');
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

    // Face Detection
    const handleFacesDetection = Worklets.createRunOnJS(async (
        faces: Face[]
    ) => {

        if (isProcessing === true) {
            console.log('Already have Frame in Processor', isProcessing ? 'true' : 'false');
            return;
        }

        isProcessing = true;
        console.log('Frame Processor', isProcessing ? 'true' : 'false');


        if (isLoading) {
            console.log('stop processing due to loading');
            // setIsProcessing(false);
            isProcessing = false;
            return;
        }

        if (Array.isArray(faces) && faces.length !== 0) {

            console.log( 'handleFacesDetection' );

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
                console.log('stop processing');
                // setIsProcessing(false);
                isProcessing = false;
                return;
            }
            try {
                var currentFaceValueCompressed = await compressBase64Image(currentFaceValue);
                console.log('Did get current face compressed Value:', currentFaceValueCompressed !== '');
            } catch (error) {
                console.log('Error:', error);
                console.log('stop processing');
                // setIsProcessing(false);
                isProcessing = false;
                return
            }

            if (currentFaceValueCompressed !== null) {

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
            }

        } else {
            // console.log('No Face Detected');
        }

        // console.log('Face Detection Base64 Result:', result.frame.converted);
        console.log('stop processing');
        // setIsProcessing(false);
        isProcessing = false;
    })

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        const result = detectFaces(frame)
        handleFacesDetection(result)
    }, [handleFacesDetection])

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
                photo={true}
                isActive={Platform.OS === 'ios' ?true : isCamiraActive.current}
                photoQualityBalance='quality'
                frameProcessor={frameProcessor}
            />

            {/* Progress Indicator */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>Uploading...</Text>
                </View>
            )}

            {/* Instructions */}
            <View style={styles.controls}>
                <Text style={styles.cardInstruction}>
                    {stepNumber === 0 ? face1.current : ''}
                    {stepNumber === 1 ? face2.current : ''}
                    {stepNumber === 2 ? face3.current : ''}
                </Text>
            </View>
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


export default FaceValidationPage;