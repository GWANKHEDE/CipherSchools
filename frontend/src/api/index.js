import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

import { ERROR_CODES } from '../utils/errorCodes';

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

        if (status === 500) {
            console.error(`${ERROR_CODES.INTERNAL_SERVER_ERROR}: ${message}`);
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export const fetchAssignments = () => api.get('/assignments');
export const fetchAssignmentById = (id) => api.get(`/assignments/${id}`);
export const executeQuery = (query) => api.post('/execute', { query });
export const getHint = (assignment, currentQuery) => api.post('/hint', { assignment, currentQuery });

export default api;
