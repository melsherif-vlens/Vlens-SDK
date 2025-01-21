import axios from 'axios';
import { sdkConfig } from '../appConfig';

const API = axios.create({
  baseURL: sdkConfig.env.apiBaseUrl,
  timeout: 10000, // Timeout in milliseconds
});


API.interceptors.request.use(
    async (config) => {
        
        config.headers['Authorization'] = `Bearer ${sdkConfig.env.accessToken}`;
        config.headers['ApiKey'] = sdkConfig.env.apiKey;
        config.headers['TenancyName'] = sdkConfig.env.tenancyName;

        return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default API;