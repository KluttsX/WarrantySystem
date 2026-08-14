import axios from "axios";

const axiosClient = axios.create({
    // aqui va la url de la api
    baseURL: import.meta.env.VITE_API_URL,
    /////////////////////////////////////////
    headers: {
        "Content-Type": "application/json",
    }
});

export default axiosClient;