import axios from 'axios';

const loginApi = async () => {
  const url = 'https://api.vlenseg.com/api/DigitalIdentity/Login';

  const requestBody = {
    geoLocation: {
      latitude: 30.193033,
      longitude: 31.463339,
    },
    imsi: null,
    imei: '123456789',
    phoneNumber: '+201556005675',
    password: 'P@ssword123',
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'text/plain',
    ApiKey: 'W70qYFzumZYn9nPqZXdZ39eRjpW5qRPrZ4jlxlG6c',
    TenancyName: 'silverkey2',
  };

  try {
    const response = await axios.post(url, requestBody, { headers });

    // Extract accessToken from the response
    const accessToken = response.data?.data?.accessToken;
    // const refreshToken = response.data?.data?.refreshToken;

    if (accessToken) {
      console.log('Access Token:', accessToken);
      return accessToken;
    } else {
      console.log('Access Token not found in the response');
      return null;
    }
  } catch (error) {
    console.log('Error during login:', error);
    throw error;
  }
};

export default loginApi;
