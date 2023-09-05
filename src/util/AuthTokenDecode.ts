import jwtDecode from 'jwt-decode';
import { AttendanceService } from 'services/Attendance.service';
import { CollaboratorService } from 'services/Collaborator.service';
import { AllAttendanceRoles } from './RolesArray';
import { AllLeaderRoles } from './RolesArray';

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
        case AllAttendanceRoles.find((r) => r === role):
            return AttendanceService.getAllAttendance; 
        case AllLeaderRoles.find((r) => r === role):
            return AttendanceService.getAllAttendanceForLeader;
        default:
            return null; 
    }
};

export const getServiceByUserRoleLateTable = (role: number | null) => {
    switch (role) {
        case AllAttendanceRoles.find((r) => r === role):
            return AttendanceService.getAllAttendanceForLate; 
        case AllLeaderRoles.find((r) => r === role):
            return AttendanceService.getAttendanceForLeaderToLate;
        default:
            return null; 
    }
}