import axios from 'axios';

const verifyIdFrontApi = async (accessToken: string, apiKey: string, tenancyName: string, transactionId: string, imageBase64: string) => {
  const url = 'https://api.vlenseg.com/api/DigitalIdentity/verify/id/front';

  const requestBody = {
    transaction_id: transactionId,
    image: imageBase64 
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'text/plain',
    Authorization: 'Bearer ' + accessToken,
    ApiKey: apiKey,
    TenancyName: tenancyName,
  };

  console.log('Headers:', headers);
  // console.log('Request Body:', requestBody);

  try {
    const response = await axios.post(url, requestBody, { headers });
    console.log('Response:', response.data);
    
    // Extracting relevant data from the response
    const { isVerificationProcessCompleted, isDigitalIdentityVerified } =
      response.data?.data || {};

    console.log('Verification Completed:', isVerificationProcessCompleted);
    console.log('Digital Identity Verified:', isDigitalIdentityVerified);

    return { isVerificationProcessCompleted, isDigitalIdentityVerified };
  } catch (error) {
    console.log('Error during ID front verification:', error);
    throw error;
  }
};

export default verifyIdFrontApi;
