import API from './api';
import { sdkConfig } from '../appConfig';
import { handleApiError } from './ApiError';
import type { VerifyIdFrontApiResponse } from './payload/VerifyIdFrontApi';

const verifyIdFrontApi = async (transactionId: string, imageBase64: string) => {
  const url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/id/front';

  const requestBody = {
    transaction_id: transactionId,
    image: imageBase64,
    getExtractedData: true, 
  };

  try {
    const response = await API.post(url, requestBody);

    const responseData = response.data as VerifyIdFrontApiResponse;
    console.log('Front Response:', responseData);

    const isVerificationProcessCompleted = responseData?.data?.isVerificationProcessCompleted;
    const isDigitalIdentityVerified = responseData?.data?.isDigitalIdentityVerified;

    console.log('Verification Completed:', isVerificationProcessCompleted);
    console.log('Digital Identity Verified:', isDigitalIdentityVerified);

    return { isVerificationProcessCompleted, isDigitalIdentityVerified };
  } catch (error) {
      throw handleApiError(error);
  }
};

export default verifyIdFrontApi;
