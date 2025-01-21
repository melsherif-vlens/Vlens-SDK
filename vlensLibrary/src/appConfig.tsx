import { defaultApiErrors } from './apis/ApiError';
import type { SdkConfig } from './types/SdkConfig';

export const sdkConfig: SdkConfig = {
    transactionId: '',
    isLivenessOnly: false,
    isNationalIdOnly: false,
    env: {
        apiBaseUrl: 'https://api.vlenseg.com',
        accessToken: '',
        refreshToken: '',
        apiKey: '',
        tenancyName: '',
    },
    defaultLocale: 'en',
    colors: {
        accent: '#4E5A78',
        primary: '#397374',
        secondary: '#67593508',
        background: '#FEFEFE',
        dark: '#000000',
        light: '#FFFFFF',
    },
    errorMessages: defaultApiErrors,
    onSuccess: () => { },
    onFaild: (error: string) => { console.error(`onFaild callback no implemented - error is ${error}`); },
};