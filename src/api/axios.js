import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,
});

httpClient.interceptors.response.use(
    function (response) {
        return response;
    }, 
    function (error) {
        if(error.response.status == 401){
            const auth = useAuthStore();
            auth.logout();
        }
        return Promise.reject(error);
  });

const get = async(url , options) => {
    if(options) {
        options.q = options.q ? options.q : "";
        url += `?page=${options.page}&limit=${options.rowsPerPage}&q=${options.q}` 
    }
    const headers = authHeader(url)
    return (await httpClient.get(url, { headers })).data
}

const getWithParams = async (url, params) => {
    const headers = authHeader(url);
    return (await httpClient.get(url, { headers, params })).data;
}

const post = async (url, body) => {
    const headers = authHeader(url)
    let data =  httpClient.post(url, body, { headers })
    return data;
}

const postForm = (url, formData) => {
    const headers = authHeader(url);
    return httpClient.postForm(url, formData, {
        headers: {
            // "Content-Type": "multipart/form-data",
            ...headers
        },
    });
}

const put = async (url, body) => {
    const headers = authHeader(url)
    let data = await httpClient.put(url, body, { headers })
    return data;
}

const putForm = (url, formData) => {
  const headers = authHeader(url);
    return httpClient.putForm(url, formData, { headers });
};

const _delete = async (url, body) => {
    const headers = authHeader(url)
    let data = await httpClient.delete(url, {data: body, headers})
    return data;
}

function authHeader(url) {
    const authStore  = useAuthStore();
    const isLoggedIn = !!authStore.token;
    if (isLoggedIn) {
        return { Authorization: `Bearer ${authStore.token}` };
    } else {
        return { };
    }
}

export default { get, getWithParams, post, postForm, put, putForm, _delete };

