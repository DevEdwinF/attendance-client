import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

const baseUrl = 'http://localhost:8080/api/collaborator';

export const CollaboratorService = {
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
