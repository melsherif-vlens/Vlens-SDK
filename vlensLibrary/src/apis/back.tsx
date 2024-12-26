import axios, { AxiosError } from 'axios';
import { sdkConfig } from '../appConfig';
import { getApiError } from './ApiError';

interface ApiErrorResponse {
    error_code: number;
    error_message: string;
    data: any | null;
}
const verifyIdBackApi = async (accessToken: string, apiKey: string, tenancyName: string, transactionId: string, imageBase64: string) => {
    const url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/id/back';

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
        // Handle API errors
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            // Handle API response errors
            if (axiosError.response) {
                const { error_code } = axiosError.response.data || {};

                console.log('API Error Code:', error_code);
                const error_message = getApiError(error_code);
                console.log('API Error Message:', error_message);

                // Throw a structured error object
                throw new Error(
                    `${error_message}`
                );
            } else {
                // Handle network errors
                console.log('Network issue or no response from server.');
                throw new Error('Network issue or no response from server.');
            }
        } else {
            // Handle other unexpected errors
            console.log('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};

export default verifyIdBackApi;
