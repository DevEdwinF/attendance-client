import axios from "axios"
import { Api } from "config/Api";

const endPoint = '/api/roles';
const baseUrl = Api.url + endPoint;

export const RolesService = {
    getAllRoles: async() => {
        try {
            const response = await axios.get(`${baseUrl}/all`)
            return response.data
        } catch (error) {
            throw error
        }
    }
}