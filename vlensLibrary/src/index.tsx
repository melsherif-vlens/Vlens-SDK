import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { VLensSdkProps } from './types/VLensSdkProps';
import { sdkConfig } from './appConfig';

import NationalIdValidationPage from './pages/NationalIdValidationPage';
import FaceValidationPage from './pages/FaceValidationPage';

const VLensView = (props: VLensSdkProps) => {

  const [step, setStep] = useState<'nationalId' | 'face'>('nationalId');
  const numberOfLivenessRetries = useRef(0);

  // Check props
  useEffect(() => {
    console.log('VLensView Props:', props);

    sdkConfig.i18n.defaultLocale = props.locale;

    if (props.isLivenessOnly) {
      setStep('face');
    }
  }, []);

  // Callbacks
  const onSccess = () => {
    console.log('VLensView Success:', step);
    
    if (step === 'nationalId') {
      setStep('face');
      return
    }

    if (step === 'face' && numberOfLivenessRetries.current < 2) {
      numberOfLivenessRetries.current += 1;
      setStep('face');
      return;
    }

    props.onSuccess();
  }

  const onFaild = (error: string) => {
    console.log('VLensView in', step, ' with error:', error);
    props.onFaild(error);
  }

  // National ID Validation Step
  if (step === 'nationalId') {
    return (
      <View style={styles.container}>
        <NationalIdValidationPage
          {...props}
          onSuccess={onSccess}
          onFaild={onFaild}
        />
      </View>
    );
  }

  // Face Validation Step
  return (
    <View style={styles.container}>
      <FaceValidationPage
        {...props}
        onSuccess={onSccess}
        onFaild={onFaild}
      />
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