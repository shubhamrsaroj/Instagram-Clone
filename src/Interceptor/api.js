import axios from "axios";


export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? "https://instagram-clone-df6g.onrender.com/api"
        : "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});


api.interceptors.response.use((res) => res, (error) => {

    if (error.response && error.response.status === 401) {

        localStorage.removeItem("token");

        window.location.href = "/login";
    }

    return Promise.reject(error);


})