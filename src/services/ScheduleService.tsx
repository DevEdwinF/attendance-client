import axios from 'axios';
import { Collaborator, Schedule } from '../views/admin/Collaborators/components/CollaboratorsTable';
import Swal from 'sweetalert2';

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
        console.log(schedules)
        try {
            const response = await axios.post(`${baseUrl}/assign`, filteredSchedules);
            showSuccessAlert()
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

const showSuccessAlert = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Horario actualizado correctamente',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'swal-button-ok'
      }
    });
  };

export default ScheduleService;
