import axios from "axios";
import { Api } from "config/Api";

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
};