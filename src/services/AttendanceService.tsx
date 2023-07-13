import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

// const baseUrl = 'http://10.0.6.104:8080/api/attendance';
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
      showSuccessAlert();
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message
      });
      console.log(error);
      throw new Error("Verifica si el documento está escrito correctamente");
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
  },
  saveTranslated: async (document: any) =>{
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register/translated`, document);
      console.log(response);
      showSuccessAlert();
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al registrar translado'
      });
      console.log(error);
      throw new Error('Error al obtener la asistencia');
    }
  }
};

const showSuccessAlert = () => {
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
};
