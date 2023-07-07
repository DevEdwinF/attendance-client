import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://localhost:8080/api/attendance';

export const AttendanceService = {
  validate: async (document: number) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/validate/${document}`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error desconocido'
      });
      console.log(error);
      throw new Error("Error al validar");
    }
  },
  register: async (data: { document: number; state: string; location:string; photo: string }) => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register`, data);
      console.log(data)
  
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton: 'swal-button-ok'
        }
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message
      });
      console.log(error);
    }
  },
  
  getAllAttendance: async () => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  }
};
