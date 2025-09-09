import API from './api';
import { sdkConfig } from '../appConfig';
import { checkIfThereIsError } from './ApiError';

const verifyFaceApi = async (transactionId: string, face1: string, face2: string, face3: string) => {
    // const url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/liveness/multi';

    var url = ""

    if (!sdkConfig.env.accessToken) { 
        url = sdkConfig.env.apiBaseUrl + '/v1/ocr/liveness/multi';
    } else {
        url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/liveness/multi';
    }

    console.log('URL:', url);

    const requestBody = {
        transaction_id: transactionId,
        face_1: face1,
        face_2: face2,
        face_3: face3
    };

    // console.log('Request Body:', requestBody);

    const response = await API.post(url, requestBody);

    // Extracting relevant data from the response
    console.log('Response:', response.data);
    console.log('validation_errors:', response.data.services.Validations.validation_errors);
        
    const {errorCode, errorMessage} = checkIfThereIsError(response);
    if (errorCode != -1) {
        console.error('API Error:', errorCode, errorMessage);
        throw { errorCode, errorMessage };
    }

    const { isVerificationProcessCompleted, isDigitalIdentityVerified, isMatched } = response.data?.data || {};

    console.log('Verification Completed:', isVerificationProcessCompleted);
    console.log('Digital Identity Verified:', isDigitalIdentityVerified);
    console.log('isMatched:', isMatched);

    return { isVerificationProcessCompleted, isDigitalIdentityVerified, isMatched };
};

export default verifyFaceApi;
