import axios from "axios";
import { Api } from "config/Api";
import { CollaboratorDto } from "dto/Collaborator.dto";

const endPoint = "/api/filter"
const baseUrl = Api.url + endPoint

export const FilterService = {
    FilterCollaborator:async (collaborator: CollaboratorDto) => {
        try {
            const response = await axios.get(`${baseUrl}/collaborator?firstName=${collaborator.document}&${collaborator.f_name}
                                                        &${collaborator.l_name}&${collaborator.email}&${collaborator.bmail}&${collaborator.position}&${collaborator.leader}
                                                        &${collaborator.headquarters}&${collaborator.subprocess}
            `)
        } catch (error) {
            
        }
    }

}
