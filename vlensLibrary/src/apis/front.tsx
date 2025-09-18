import API from './api';
import { sdkConfig } from '../appConfig';
import { checkIfThereIsError } from './ApiError';

const verifyIdFrontApi = async (transactionId: string, imageBase64: string) => {

	var url = ""

	if (!sdkConfig.env.accessToken) {
		url = sdkConfig.env.apiBaseUrl + '/v1/ocr/id/front';
	} else {
		url = sdkConfig.env.apiBaseUrl + '/api/DigitalIdentity/verify/id/front';
	}

	console.log('url:', { url });

	const requestBody = {
		transaction_id: transactionId,
		image: imageBase64,
		getExtractedData: true,
	};

	console.log('Request Body:', requestBody);

	const response = await API.post(url, requestBody);
	console.log('Response:', response.data);

	const { errorCode, errorMessage } = checkIfThereIsError(response);
	if (errorCode != -1) {
		console.error('API Error:', errorCode, errorMessage);
		throw { errorCode, errorMessage };
	}

	const { isVerificationProcessCompleted, isDigitalIdentityVerified } = response.data?.data || {};

	console.log('Verification Completed:', isVerificationProcessCompleted);
	console.log('Digital Identity Verified:', isDigitalIdentityVerified);

	return response.data?.data;
};

export default verifyIdFrontApi;
