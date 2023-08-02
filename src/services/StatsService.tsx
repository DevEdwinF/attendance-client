import axios from "axios";
import { HeaderPost } from "./Header";
import { Api } from "config/Api";

const endPoint = '/stats';
const baseUrl = Api.url + endPoint;

export const StatService = {
    getAllStats: async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`, HeaderPost);
            console.log(response)
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    getAllStatsToday: async () => {
        try {
            const response = await axios.get(`${baseUrl}/day/all`, HeaderPost);
            console.log(response)
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    }
}