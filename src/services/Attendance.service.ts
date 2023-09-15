import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { HeaderPost } from "./Header";
import { Api } from "config/Api";

const endPoint = '/api/attendance';
const baseUrl = Api.url + endPoint;
  
export const AttendanceService = {
  validate: async (document: any) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/validate/${document}`);
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Todos los campos son obligatorios, verifica que la cámar esté encendida'
      });
      console.log(error);
      throw new Error("Error al validar");
    }
  },
  register: async (data: FormData) => {
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccessAlert();
      return response.data;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message,
      });
      throw new Error("Verifica si el documento está escrito correctamente");
    }
  },
  getAllAttendance: async () => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all`,  HeaderPost);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  getAllAttendanceForLeader: async () => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/leader/all`,  HeaderPost);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  saveTranslated: async (document: any) =>{
    try {
      const response: AxiosResponse = await axios.post(`${baseUrl}/register/translated`, document,  HeaderPost);
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
  },
  getAllTranslated: async() => {
    try {
      const response = await axios.get(`${baseUrl}/all/translated`, HeaderPost)
      return response.data
      
    } catch (error) {
      throw error
    }
  },
  getAttendanceForLeaderToLate:async () => {
    try {
      const response = await axios.get(`${baseUrl}/leader/late/all`, HeaderPost)
      return response.data
    } catch (error) {
      throw error
    }
  },
  getAllAttendanceForLate: async () =>{
    try {
      const response = await axios.get(`${baseUrl}/late/all`, HeaderPost)
      return response.data
    } catch (error) {
      throw error
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
