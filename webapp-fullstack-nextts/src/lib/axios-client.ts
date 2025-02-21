import axios from 'axios'
export const AxiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})