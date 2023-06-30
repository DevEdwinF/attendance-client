import axios from "axios";

const baseUrl = 'http://localhost:8080/api/stats'

export const StatService = {
    getAllStats: async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`);
            console.log(response)
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    getAllStatsToday: async () => {
        try {
            const response = await axios.get(`${baseUrl}/day/all`);
            console.log(response)
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    }
}