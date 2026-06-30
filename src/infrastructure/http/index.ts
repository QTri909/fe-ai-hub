import { httpClient } from './client';
import { setupInterceptors } from './interceptors';

// Initialize Axios interceptors
setupInterceptors(httpClient);

export { httpClient } from './client';
export { setupInterceptors } from './interceptors';
