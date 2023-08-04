import axios, { AxiosResponse } from "axios";
import { Api } from "config/Api"
import {UserCreate} from "views/admin/usersManage/components/CreateUserComponent"


const endPoint = '/api/user'
const baseUrl = Api.url + endPoint


export const UserService ={
    create: async (newUser: UserCreate) => { 
        try {
          const { document, email, password, f_name, l_name, rol } = newUser;
          const response: AxiosResponse = await axios.post(`${baseUrl}/create`, {
            document,
            f_name,
            l_name,
            email,
            password,
            rol,
          }); 
          return response.data.message;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
            return error.response.data.message;
          } else {
            // If the error object doesn't have the expected structure, return a generic error message
            return 'Error al crear el usuario';
          }
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
    deleteUser: async(document: string) => {
        try {
            const response: AxiosResponse = await axios.delete(`${baseUrl}/delete/${document}`);
            return response.data.message;
        } catch (error) {
            throw error
        }
    }
}