import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://localhost:8080/api/collaborator';

export const CollaboratorService = {
  getAllCollaborators: async () => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  },
  getCollaboratorSchedule: async(document: any) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/find/${document}`)
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la asistencia');
    }
  }
};
