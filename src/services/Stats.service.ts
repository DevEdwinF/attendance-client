import axios from "axios";
import { HeaderPost } from "./Header";
import { Api } from "config/Api";

const endPoint = '/api/stats';
const baseUrl = Api.url + endPoint;

export const StatService = {
    getAllStats: async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`, HeaderPost);
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    getAllStatsToday: async () => {
        try {
            const response = await axios.get(`${baseUrl}/day/all`, HeaderPost);
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    CountLateAttendancesForDay: async ()=>{
        try {
            const response = await axios.get(`${baseUrl}/day/late`, HeaderPost);
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    countOnTimeAttendancesForDay: async ()=>{
        try {
            const response = await axios.get(`${baseUrl}/day/ontime`, HeaderPost);
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    },
    totalCollaboratorsActive: async () => {
        try {
            const response = await axios.get(`${baseUrl}/total-collaborators`, HeaderPost);
            return response.data.count
        }
        catch (error) {
            throw new Error('Error al obtener las estadísticas');
        }
    }
}