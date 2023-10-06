import { Schedule } from "./Schedule.dto";

export interface CollaboratorDto{
    document: string;
    f_name: string;
    l_name: string;
    email: string;
    bmail: string;
    position: string;
    leader: string;
    headquarters: string;
    subprocess: string;
    id_collaborator?: number,
    date: string;
    state: string;
    id: string; 
    fk_collaborator_id: string; 
    schedules: Schedule[];
}
