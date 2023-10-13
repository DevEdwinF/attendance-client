import { filter } from '@chakra-ui/system';
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { HeaderPost } from "./Header";
import { Api } from "config/Api";
import { FiltersAttendance } from 'views/attendance/components/AttendanceTable';
import { compareAsc, format } from 'date-fns'

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
      const url = new URL(`${baseUrl}/all`);

    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    if(filter){
      if(filter.date){
        url.searchParams.append('date', format(filter.date, `yyyy-MM-dd`) + "T00:00:00Z");
      }
      if(filter.document){
        url.searchParams.append('document', filter.document);
      }
      if(filter.f_name){
        url.searchParams.append('f_name', filter.f_name);
      }
      if(filter.l_name){
        url.searchParams.append('l_name', filter.l_name);
      }
      if(filter.position){
        url.searchParams.append('position', filter.position);
      }
      if(filter.subprocess){
        url.searchParams.append('subprocess', filter.subprocess);
      }
      if(filter.email){
        url.searchParams.append('email', filter.email);
      }
      if(filter.location){
        url.searchParams.append('location', filter.location);
      }
    }

   const response = await axios.get(url.toString(), HeaderPost);

    return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  getAllAttendanceForLeader: async (page: number, limit: number, filter: FiltersAttendance) => {
    try {
      const url = new URL(`${baseUrl}/leader/all`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      
      if(filter){
        if(filter.date){
          url.searchParams.append('date', format(filter.date, `yyyy-MM-dd`) + "T00:00:00Z");
        }
        if(filter.document){
          url.searchParams.append('document', filter.document);
        }
        if(filter.f_name){
          url.searchParams.append('f_name', filter.f_name);
        }
        if(filter.l_name){
          url.searchParams.append('l_name', filter.l_name);
        }
        if(filter.position){
          url.searchParams.append('position', filter.position);
        }
        if(filter.subprocess){
          url.searchParams.append('subprocess', filter.subprocess);
        }
        if(filter.email){
          url.searchParams.append('email', filter.email);
        }
        if(filter.location){
          url.searchParams.append('location', filter.location);
        }
      }
  
     const response = await axios.get(url.toString(), HeaderPost);
  
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
