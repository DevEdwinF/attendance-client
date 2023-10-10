import axios from "axios";
import { Api } from "config/Api";
import { CollaboratorDto } from "dto/Collaborator.dto";

const endPoint = "/api/filter";
const baseUrl = Api.url + endPoint;

export const FilterService = {
  FilterCollaborator: async (
    filter : {document: string,
    headquarters: string,
    subprocess: string,
    position: string,
    leader: string,
    date: string} 
  ) => {
    try {
      const params = new URLSearchParams();
        params.append("document", filter.document);
        params.append("headquarters", filter.headquarters);
        params.append("subprocess", filter.subprocess);
        params.append("position", filter.position);
        params.append("leader", filter.leader);
        params.append("date", filter.date);
        
      const response = await axios.get(`${baseUrl}/collaborator?${params.toString()}`);
      return response.data;
    } catch (error) {
      return error;
    }
}
}