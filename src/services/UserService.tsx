import axios, { AxiosResponse } from "axios";
import { Api } from "config/Api"

const endPoint = '/api/user'
const baseUrl = Api.url + endPoint

export const UserService ={
    create: async(data: any) => {
        try {
            const response: AxiosResponse = await axios.post(`${baseUrl}/create`);
            return response.data.message;
        } catch (error) {
            throw error
        }
    },
    getUserAll: async() => {
        try {
            const response: AxiosResponse = await axios.get(`${baseUrl}/all`);
            return response.data;
        } catch (error) {
            throw error
        }
    },
    getUserById: async(id: any) => {
        try {
            const response: AxiosResponse = await axios.get(`${baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            throw error
        }
    },
    updateUser: async(data: any) => {
        try {
            const response: AxiosResponse = await axios.patch(`${baseUrl}/update`, data);
            return response.data.message;
        } catch (error) {
            throw error
        }
    },
    deleteUser: async(id: any) => {
        try {
            const response: AxiosResponse = await axios.delete(`${baseUrl}/delete/${id}`);
            return response.data.message;
        } catch (error) {
            throw error
        }
    }
}