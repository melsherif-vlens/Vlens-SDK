import { useRef, useState } from 'react';

import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
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
        telencyName={_telencyName} 
        apiKey={_apiKey} 
        transactionId={transactionId}
        accessToken={accessToken}
        isLivenessOnly={isLivenessOnly.current}
        locale="ar"
        onSuccess={onVLensSuccess}
        onFaild={onVLensFaild}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>VLens React SDK Demo</Text>

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
        <ActivityIndicator size="large" color="#0000ff" />
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    height: 350,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  button: {
    height: 40,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
