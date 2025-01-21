export interface EnvironmentConfig{
    apiBaseUrl: string;
    accessToken: string;
    refreshToken: string;
    apiKey: string;
    tenancyName: string;
}

export interface ColorConfig {
    accent: string;
    primary: string;
    secondary: string;
    background: string;
    dark: string;
    light: string;
}

export interface I18nConfig {
    locales: string[];
    defaultLocale: string;
}

export interface ApiError {
    error_code: number;
    error_message_en: string;
    error_message_ar: string;
};


export type SdkConfig = {
    transactionId: string;
    isLivenessOnly: boolean;
    isNationalIdOnly: boolean;
    env: EnvironmentConfig;
    defaultLocale: string;
    colors: ColorConfig;
    errorMessages: ApiError[];
    onSuccess: () => void;
    onFaild: (error: string) => void;
};
