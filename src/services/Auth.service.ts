import axios from "axios";
import { Api } from "config/Api";
import { HeaderPost } from "./Header";

const endPoint = '/auth'
const baseUrl = Api.url + endPoint;

export const AuthService = {
    login: async (data: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${baseUrl}/login`, data);
            const token = response.data.token;

            localStorage.setItem('token', token);

            return token;
        } catch (error: any) {
            throw new Error(error.response.data.message);
        }
    },
    validateToken: async()=>{
        try {
            const response = await axios.get(`${baseUrl}/validate-token`, HeaderPost);
            return response.data;
        } catch (error: any) {
            console.log(error.response)
            throw new Error(error.response.data.message);
        }
    },
    getUserInfo:async () => {
        try {
            const response = await axios.get(`${baseUrl}/user-info`, HeaderPost)
            return response.data
        } catch (error) {
            throw new Error ("Usuario no encontrado")
        }
    },
    logout: async() => {
        localStorage.removeItem('token');
    }
};