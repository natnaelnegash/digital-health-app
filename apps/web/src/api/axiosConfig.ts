import axios from "axios";
import { store } from "../app/store";

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api'
})

apiClient.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state.auth.token

        if(token) {
            config.headers.Authorization = `Bearer: ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient