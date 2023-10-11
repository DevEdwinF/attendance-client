import { filter } from '@chakra-ui/system';
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { HeaderPost } from "./Header";
import { Api } from "config/Api";
import { FiltersAttendance } from 'views/attendance/components/AttendanceTable';

const endPoint = '/api/attendance';
const baseUrl = Api.url + endPoint;

  
export const AttendanceService = {
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
  getAllAttendance: async (page: number, limit: number, filter: FiltersAttendance) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all?page=${page}&limit=${limit}
      ${filter.document && `&document=${filter.document}`}
      ${filter.f_name && `&f_name=${filter.f_name}`}
      ${filter.l_name && `&l_name=${filter.l_name}`}
      ${filter.bemail && `&bemail=${filter.bemail}`}
      ${filter.email && `&email=${filter.email}`}
      ${filter.location && `&location=${filter.location}`}
      ${filter.arrival && `&arrival=${filter.arrival}`}
      ${filter.departure && `&departure=${filter.departure}`}
      ${filter.leader && `&leader=${filter.leader}`}
      ${filter.position && `&position=${filter.position}`}
      ${filter.headquarters && `&headquarters=${filter.headquarters}`}
      ${filter.subprocess && `&subprocess=${filter.subprocess}`}
      `,  HeaderPost);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  getAllAttendanceForLeader: async (page: number, limit: number, filter: FiltersAttendance) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/leader/all?page=${page}&limit=${limit}
      ${filter.document && `&document=${filter.document}`}
      ${filter.f_name && `&f_name=${filter.f_name}`}
      ${filter.l_name && `&l_name=${filter.l_name}`}
      ${filter.bemail && `&bemail=${filter.bemail}`}
      ${filter.email && `&email=${filter.email}`}
      ${filter.location && `&location=${filter.location}`}
      ${filter.arrival && `&arrival=${filter.arrival}`}
      ${filter.departure && `&departure=${filter.departure}`}
      ${filter.leader && `&leader=${filter.leader}`}
      ${filter.position && `&position=${filter.position}`}
      ${filter.headquarters && `&headquarters=${filter.headquarters}`}
      ${filter.subprocess && `&subprocess=${filter.subprocess}`}
      ${filter.late && `&late=${filter.late}`}
      `,  HeaderPost);
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
