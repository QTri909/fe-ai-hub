import axios from 'axios';
import { axiosConfig } from '@/core/config';

export const httpClient = axios.create(axiosConfig);
export default httpClient;
