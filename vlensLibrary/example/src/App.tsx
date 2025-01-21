import { useRef, useState } from 'react';

import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

import loginApi from './loginApi';
import generateUUID from './IdGenerator';

import VLensView from 'react-native-vlens';

export default function App() {

  const _telencyName: string = 'silverkey2';
  const _apiKey: string = 'W70qYFzumZYn9nPqZXdZ39eRjpW5qRPrZ4jlxlG6c'
  
  const [transactionId, setTransactionId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  
  const [loading, setLoading] = useState(false);

  const [isVlensMode, setIsVlensMode] = useState(false);
  const isLivenessOnly = useRef(false);

  const handleSetDefaultData = async () => {
    setLoading(true);
    try {
      const _accessToken = await loginApi();
      setAccessToken(_accessToken);

      const _transactionId = generateUUID();
      setTransactionId(_transactionId);

      Alert.alert('Success', 'Default data set successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to set default data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    isLivenessOnly.current = false;
    setIsVlensMode(true);
  };

  const handleGetStartedWithLivenessOnly = () => {
    isLivenessOnly.current = true;
    setIsVlensMode(true);
  };

  const onVLensSuccess = () => {
    Alert.alert('Success', 'Validation done successfully!');
    setIsVlensMode(false);
  };

  const onVLensFaild = (error: string) => {
    Alert.alert('Error', 'Validation failed with error: ' + error);
    setIsVlensMode(false);
  };

  if (isVlensMode) {
    return (
      <VLensView
        transactionId={transactionId}
        isLivenessOnly={isLivenessOnly.current}
        isNationalIdOnly={false}
        env={{
          apiBaseUrl: 'https://api.vlenseg.com',
          accessToken: accessToken,
          refreshToken: '',
          apiKey: _apiKey,
          tenancyName: _telencyName,
        }}
        defaultLocale={'en'}
        colors={{
          accent: '#4E5A78',
          primary: '#397374',
          secondary: '#AF9759',
          background: '#FEFEFE',
          dark: '#000000',
          light: '#FFFFFF',
      }}
        errorMessages={[]} // comming soon
        onSuccess={onVLensSuccess}
        onFaild={onVLensFaild}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>VLens React SDK Demo</Text>

      <Image 
        source={require('../assets/vlens_logo_temp.png')} 
        style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }} 
      />

      <Text style={styles.label}>Transaction ID</Text>
      <TextInput
        style={styles.trxIdInput}
        value={transactionId}
        onChangeText={setTransactionId}
        placeholder="Enter Transaction ID"
      />

      <Text style={styles.label}>Access Token</Text>
      <TextInput
        style={styles.accessTokenInput}
        value={accessToken}
        onChangeText={setAccessToken}
        placeholder="Enter Access Token"
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#397374" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleSetDefaultData}>
            <Text style={styles.buttonText}>Set Default Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGetStartedWithLivenessOnly}>
            <Text style={styles.buttonText}>Get Started With Liveness Only</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    color: '#397374',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#204061'
  },
  trxIdInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  accessTokenInput: {
    height: 250,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  button: {
    height: 40,
    backgroundColor: '#397374',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
