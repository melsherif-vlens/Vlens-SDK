export interface VLensSdkProps {
    accessToken: string;
    telencyName: string;
    apiKey: string;
    transactionId: string;
    isLivenessOnly: boolean;
    onSuccess: () => void;
    onFaild: (error: string) => void;
}
