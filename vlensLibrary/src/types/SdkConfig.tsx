export type SdkConfig = {
    env: {
        apiBaseUrl: string;
    };
    i18n: {
        locales: string[];
        defaultLocale: string;
    };
    colors: {
        light: {
            accent: string;
            primary: string;
            secondary: string;
            background: string;
            dark: string;
            light: string;
        };
        dark: {
            accent: string;
            primary: string;
            secondary: string;
            background: string;
            dark: string;
            light: string;
        };
    };
};
