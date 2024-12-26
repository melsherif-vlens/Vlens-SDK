import axios, { AxiosError } from 'axios';
import { sdkConfig } from '../appConfig';
import { getApiError } from './ApiError';

interface ApiErrorResponse {
    error_code: number;
    error_message: string;
    data: any | null;
}
const verifyFaceApi = async (accessToken: string, apiKey: string, tenancyName: string, transactionId: string, face1: string, face2: string, face3: string) => {
    const url = sdkConfig.env.apiBaseUrl + 'api/DigitalIdentity/verify/liveness/multi';

    const requestBody = {
        transaction_id: transactionId,
        face_1: face1,
        face_2: face2,
        face_3: face3
    };

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        Authorization: 'Bearer ' + accessToken,
        ApiKey: apiKey,
        TenancyName: tenancyName,
    };

    console.log('Headers:', headers);
    console.log('Request Body:', requestBody);

    try {
        const response = await axios.post(url, requestBody, { headers });

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
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            // Handle API response errors
            if (axiosError.response) {
                const { error_code } = axiosError.response.data || {};

                const error_message = getApiError(error_code);
                console.error('API Error Code:', error_code);
                console.error('API Error Message:', error_message);

                // Throw a structured error object
                throw new Error(
                    `${error_message}`
                );
            } else {
                // Handle network errors
                console.error('Network issue or no response from server.');
                throw new Error('Network issue or no response from server.');
            }
        } else {
            // Handle other unexpected errors
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};

export default verifyFaceApi;
