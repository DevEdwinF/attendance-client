import { filter } from '@chakra-ui/system';
import { Collaborator } from 'views/attendance/components/TranslatedTable';
import axios, { AxiosResponse } from "axios";
import { Api } from '../config/Api'
import Swal from "sweetalert2";
import { HeaderPost } from "./Header";

const endPoint = '/api/collaborator'
const baseUrl = Api.url + endPoint;

export interface Filters {
  document?: string,
  f_name?: string,
  l_name?: string,
  email?: string,
  bmail?: string,
  position?: string,
  state?: string,
  leader?: string,
  headquarters?: string,
  subprocess?: string

}



export const CollaboratorService = {
  getAllCollaborators: async (page: number, limit: number, filter: Filters) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all?page=${page}&limit=${limit}
      ${filter.document && `&document=${filter.document}`}
      ${filter.f_name && `&f_name=${filter.f_name}`}
      ${filter.l_name && `&l_name=${filter.l_name}`}
      ${filter.email && `&email=${filter.email}`}
      ${filter.bmail && `&bmail=${filter.bmail}`}
      ${filter.position && `&position=${filter.position}`}
      ${filter.state && `&state=${filter.state}`}
      ${filter.leader && `&leader=${filter.leader}`}
      ${filter.headquarters && `&headquarters=${filter.headquarters}`}
      ${filter.subprocess && `&subprocess=${filter.subprocess}`}
      `, HeaderPost);
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
  },
  getCollaboratorForLeader:async (
    page: number,
    limit: number,
    filter: Filters
  ) => {
    try {
      const response: AxiosResponse = await axios.get(`${baseUrl}/all/leader?page=${page}&limit=${limit}
      ${filter.document && `&document=${filter.document}`}
      ${filter.f_name && `&f_name=${filter.f_name}`}
      ${filter.l_name && `&l_name=${filter.l_name}`}
      ${filter.email && `&email=${filter.email}`}
      ${filter.bmail && `&bmail=${filter.bmail}`}
      ${filter.position && `&position=${filter.position}`}
      ${filter.state && `&state=${filter.state}`}
      ${filter.leader && `&leader=${filter.leader}`}
      ${filter.headquarters && `&headquarters=${filter.headquarters}`}
      ${filter.subprocess && `&subprocess=${filter.subprocess}`}  
    `, HeaderPost)
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error
    }
  }
};
