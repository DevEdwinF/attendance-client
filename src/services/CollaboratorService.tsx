import axios, { AxiosResponse } from "axios";
import { Api } from '../config/Api'
import Swal from "sweetalert2";
import { HeaderPost } from "./Header";

const endPoint = '/api/collaborator'
const baseUrl = Api.url + endPoint;


export const CollaboratorService = {
  getAllCollaborators: async () => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all`,  HeaderPost);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  getCollaboratorSchedule: async(document: any) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/find/${document}`,  HeaderPost)
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  }
};
