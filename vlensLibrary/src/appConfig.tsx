import type { SdkConfig } from './types/SdkConfig';

export const sdkConfig: SdkConfig = {
    env: {
        apiBaseUrl: 'https://api.vlenseg.com',
    },
    i18n: {
        locales: ['en', 'ar'],
        defaultLocale: 'en',
    },
    colors: {
        light: {
            accent: '#FFC107',
            primary: '#2196F3',
            secondary: '#FF4081',
            background: '#FFFFFF',
            dark: '#000000',
            light: '#FFFFFF',
        },
        dark: {
            accent: '#FFC107',
            primary: '#2196F3',
            secondary: '#FF4081',
            background: '#000000',
            dark: '#FFFFFF',
            light: '#000000',
        },
    },
};