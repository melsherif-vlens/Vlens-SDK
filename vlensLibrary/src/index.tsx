import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { sdkConfig } from './appConfig';

import StartNationalIdValidationPage from './pages/StartNationalIdValidationPage';
import NationalIdValidationPage from './pages/NationalIdValidationPage';

import StartFaceValidationPage from './pages/StartFaceValidationPage';
import FaceValidationPage from './pages/FaceValidationPage';

import type { SdkConfig } from './types/SdkConfig';

type VLensViewProps = SdkConfig

const VLensView = (props: VLensViewProps) => {

    const [step, setStep] = useState<'startNationalId' | 'nationalId' | 'startFace' | 'face'>('startNationalId');
    // const numberOfLivenessRetries = useRef(0);
  
    // Check props
    useEffect(() => {
        console.log('VLensView Props:', props);

        sdkConfig.transactionId = props.transactionId;
        sdkConfig.isLivenessOnly = props.isLivenessOnly;
        sdkConfig.isNationalIdOnly = props.isNationalIdOnly;
        sdkConfig.env = props.env;
        sdkConfig.defaultLocale = props.defaultLocale;
        sdkConfig.colors = props.colors;

        console.log('VLensView Config:', sdkConfig);

        if (props.isLivenessOnly) {
            setStep('startFace');
        }
    }, []);

    // Callbacks
    const onNext = (error?: string) => {

        // Handle Next Steps In Error Case
        if (error) {
            console.log('VLensView in', step, ' with error:', error);
            // if (step === 'face' && numberOfLivenessRetries.current < 2) {
            //     numberOfLivenessRetries.current += 1;
            //     setStep('face');
            // }
            props.onFaild(error);
            return;
        }

        // Handle Next Steps In Success Case
        console.log(`VLensView Success on ${step} step`);

        if (step === 'startNationalId') {
            setStep('nationalId');
            return;
        }

        if (step === 'nationalId') {
            if (props.isNationalIdOnly) {
                props.onSuccess();
            } else {
                setStep('startFace');
            }
            return
        }

        if (step === 'startFace') {
            setStep('face');
            return;
        }

        props.onSuccess();
    }

    const onPrev = () => {
        // Handle Next Steps
        console.log(`VLensView handle prev step on ${step} step`);

        if (step === 'startNationalId') {
            props.onFaild('User cancelled the process');
            return;
        }

        if (step === 'nationalId') {
            setStep('startNationalId');
            return
        }

        if (step === 'startFace') {
            if (props.isLivenessOnly) {
                props.onFaild('User cancelled the process');
            } else {
                setStep('startNationalId');
            }
            return;
        }

        if (step === 'face') {
            setStep('startFace');
            return;
        }
    }

    // Start National ID Validation Step
    if (step === 'startNationalId') {
        return (
            <View style={styles.container}>
                <StartNationalIdValidationPage onNext={onNext} />
            </View>
        );
    }

    // National ID Validation Step
    if (step === 'nationalId') {
        return (
            <View style={styles.container}>
                <NationalIdValidationPage onNext={onNext} onPrev={onPrev} />
            </View>
        );
    }

    // Start Face Validation Step
    if (step === 'startFace') {
        return (
            <View style={styles.container}>
                <StartFaceValidationPage onNext={onNext} />
            </View>
        );
    }

    // Face Validation Step
    return (
        <View style={styles.container}>
            <FaceValidationPage onNext={onNext} onPrev={onPrev} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default VLensView;