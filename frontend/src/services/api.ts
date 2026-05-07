import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api' 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// called before every request is made, here it attaches jwt token to every request
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    console.log('Token in interceptor:', token); // ← add this
    console.log('Request headers:', config.headers); // ← add this
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// handle responses, 401 login expired
api.interceptors.response.use(
    (response) => response, // when request successful
    (error) => {            // when request failed
        if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/login';
        }
        return Promise.reject(error); // every axios request returns a promise, reject so we pass this message to whoever called this api
    }
)

export default api;