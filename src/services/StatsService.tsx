import axios from "axios";
import { HeaderPost } from "./Header";

const baseUrl = 'http://localhost:8080/api/stats'

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