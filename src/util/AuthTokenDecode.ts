import jwtDecode from 'jwt-decode';
import { AttendanceService } from 'services/Attendance.service';
import { CollaboratorService } from 'services/Collaborator.service';
import { AllPermisions } from './RolesArray';
import { CustomPermisions } from './RolesArray';

export interface User {
    rol: number;
}

export const getUserRoleFromToken = (token: string | null): number | null => {
    if (token) {
        const tokenObj = jwtDecode(token);
        return (tokenObj as User).rol;
    }
    return null;
};


export const getServiceByUserRole = (role: number | null) => {
    switch (role) {
        case AllPermisions.find((r) => r === role):
            return AttendanceService.getAllAttendance; 
        case CustomPermisions.find((r) => r === role):
            return AttendanceService.getAllAttendanceForLeader;
        default:
            return null; 
    }
};

export const getServiceByUserRoleLateTable = (role: number | null) => {
    switch (role) {
        case AllPermisions.find((r) => r === role):
            return AttendanceService.getAllAttendanceForLate; 
        case CustomPermisions.find((r) => r === role):
            return AttendanceService.getAttendanceForLeaderToLate;
        default:
            return null; 
    }
}

export const getCollaboratorByUserRole = (role: number | null) => {
    switch (role) {
        case AllPermisions.find((r) => r === role):
            return CollaboratorService.getAllCollaborators; 
        case CustomPermisions.find((r) => r === role):
            return CollaboratorService.getCollaboratorForLeader;
        default:
            return null; 
    }
}