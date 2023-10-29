import axios from "axios"
import { Api } from "config/Api";
import { HeaderPost } from "./Header";

const endPoint = '/api/roles';
const baseUrl = Api.url + endPoint;

export const RolesService = {
    getAllRoles: async() => {
        try {
            const response = await axios.get(`${baseUrl}/all`, HeaderPost)
            return response.data
        } catch (error) {
            throw error
        }
    }
}