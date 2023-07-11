import axios from 'axios';
import { Collaborator, Schedule } from '../views/admin/Collaborators/components/CollaboratorsTable';

const baseUrl = 'http://localhost:8080/api/schedule';

export const ScheduleService = {
    getAllSchedule: async () => {
        try {
            const response = await axios.get(`${baseUrl}/all`);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    assignSchedule: async (schedules: Schedule[]) => {
        const filteredSchedules = schedules.filter(
            schedule => schedule.arrival_time !== '' || schedule.departure_time !== ''
        );
        try {
            const response = await axios.post(`${baseUrl}/assign`, filteredSchedules);
            return response;
        } catch (error) {
            throw error
        }
    },
    deleteSchedule: async (id: number) => {
        try {
            const response = await axios.delete(`${baseUrl}/delete/${id}`);
            return response;
        } catch (error) {
            throw error
        }
    }
};

export default ScheduleService;
