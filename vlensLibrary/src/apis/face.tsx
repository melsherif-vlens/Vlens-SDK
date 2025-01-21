import API from './api';
import { sdkConfig } from '../appConfig';
import { handleApiError } from './ApiError';

const verifyFaceApi = async (transactionId: string, face1: string, face2: string, face3: string) => {
    const url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/liveness/multi';

    console.log('URL:', url);

    const requestBody = {
        transaction_id: transactionId,
        face_1: face1,
        face_2: face2,
        face_3: face3
    };

    // console.log('Request Body:', requestBody);

    try {
        const response = await API.post(url, requestBody);

        // Extracting relevant data from the response
        console.log('Response:', response.data);
        console.log('validation_errors:', response.data.services.Validations.validation_errors);

        response.data.services.Validations.validation_errors.forEach((element: any) => {
            console.log('validation_errors:', element.errors);
        });
        const { isVerificationProcessCompleted, isDigitalIdentityVerified } =
            response.data?.data || {};

        console.log('Verification Completed:', isVerificationProcessCompleted);
        console.log('Digital Identity Verified:', isDigitalIdentityVerified);

        return { isVerificationProcessCompleted, isDigitalIdentityVerified };
    } catch (error) {
        // Handle API errors
        throw handleApiError(error);
    }
};

export default verifyFaceApi;
