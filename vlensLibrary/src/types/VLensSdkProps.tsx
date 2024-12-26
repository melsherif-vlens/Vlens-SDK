export interface VLensSdkProps {
    accessToken: string;
    telencyName: string;
    apiKey: string;
    transactionId: string;
    isLivenessOnly: boolean;
    locale: string;
    onSuccess: () => void;
    onFaild: (error: string) => void;
}
