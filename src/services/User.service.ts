import axios, { AxiosResponse } from "axios";
import { Api } from "config/Api"
import { UserCreate } from "views/admin/usersManage/components/CreateUserComponent"
import { HeaderPost } from "./Header";


const endPoint = '/api/user'
const baseUrl = Api.url + endPoint

export interface FilterUser {
    document?: string
    f_name?: string
    l_name?: string
    email?: string
    role_name?: string
}


export const UserService = {
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
                return 'Error al crear el usuario';
            }
        }
    },
    getUserAll: async (page: number, limit: number, filter: FilterUser) => {
        try {
            const url = new URL(`${baseUrl}/all`);

            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());


            if (filter) {
                if (filter.document) {
                    url.searchParams.append('document', filter.document);
                }
                if (filter.f_name) {
                    url.searchParams.append('f_name', filter.f_name);
                }
                if (filter.l_name) {
                    url.searchParams.append('l_name', filter.l_name);
                }
                if (filter.role_name) {
                    url.searchParams.append('role_name', filter.role_name);
                }
            }

            const response = await axios.get(url.toString(), HeaderPost);
            return response.data;
        } catch (error) {
            throw error
        }
    },
    getUserById: async (id: any) => {
        try {
            const response: AxiosResponse = await axios.get(`${baseUrl}/${id}`, HeaderPost);
            return response.data;
        } catch (error) {
            throw error
        }
    },
    updateUser: async (data: any) => {
        try {
            const response: AxiosResponse = await axios.patch(`${baseUrl}/update`, data);
            return response.data.message;
        } catch (error) {
            throw error
        }
    },
    deleteUser: async (document: string) => {
        try {
            const response: AxiosResponse = await axios.delete(`${baseUrl}/delete/${document}`);
            return response.data.message;
        } catch (error) {
            throw error
        }
    }
}