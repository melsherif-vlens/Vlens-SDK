import API from './api';
import { sdkConfig } from '../appConfig';
import { handleApiError } from './ApiError';

const verifyIdFrontApi = async (transactionId: string, imageBase64: string) => {
  const url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/id/front';

  const requestBody = {
    transaction_id: transactionId,
    image: imageBase64 
  };

  try {
    const response = await API.post(url, requestBody);
    console.log('Response:', response.data);
    
    // Extracting relevant data from the response
    const { isVerificationProcessCompleted, isDigitalIdentityVerified } = response.data?.data || {};

    console.log('Verification Completed:', isVerificationProcessCompleted);
    console.log('Digital Identity Verified:', isDigitalIdentityVerified);

    return { isVerificationProcessCompleted, isDigitalIdentityVerified };
  } catch (error) {
      throw handleApiError(error);
    
  }
};

export default verifyIdFrontApi;
