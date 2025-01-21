import API from "./api";
import { sdkConfig } from "../appConfig";
import { handleApiError } from "./ApiError";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });

    failedQueue = [];
};

const getRefreshToken = async (refreshToken: string) => {
    
    const url = sdkConfig.env.apiBaseUrl + '/api/credentials/RefreshToken';

    console.log('url:', { url});

    const requestBody = {
        refreshToken: refreshToken
    };

    console.log('Request Body:', requestBody);

    try {

        const response = await API.post(url, requestBody);
        console.log('Response:', response.data);
        
        // Extracting relevant data from the response
        const { refreshToken, accessToken } = response.data?.data || {};

        console.log('RefreshToken:', refreshToken);
        console.log('AccessToken:', accessToken);

        return { accessToken: accessToken, refreshToken: refreshToken };

    } catch (error) {
        throw handleApiError(error);
       
    }
};

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshTokenValue = sdkConfig.env.refreshToken;
                const accessTokenValue = sdkConfig.env.accessToken;

                if (!refreshTokenValue || !accessTokenValue) throw new Error('No refresh token available');

                const response = await getRefreshToken(refreshTokenValue);

                const { accessToken } = response;


                API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return API(originalRequest);

            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
                
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);