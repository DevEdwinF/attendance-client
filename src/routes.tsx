import { Icon } from '@chakra-ui/react';
import { MdLock, MdPerson, MdOutlineCalendarMonth, MdOutlineDashboard, MdOutlinePeopleOutline } from 'react-icons/md';
import jwtDecode from 'jwt-decode';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';
import Collaborators from 'views/admin/Collaborators';
import UserManage from 'views/admin/usersManage';
import Novedades from 'views/admin/novedades';
import { getUserRoleFromToken } from 'util/AuthTokenDecode';

const token = localStorage.getItem('token');
const userRole = getUserRoleFromToken(token);

const allRoutes = [
	{
		name: 'Dashboard',
		layout: '/admin',
		path: '/dashboard',
		allowedRoles: [1, 2, 3, 4, 5, 6, 7],
		icon: <Icon as={MdOutlineDashboard} width='20px' height='20px' color='inherit' />,
		component: MainDashboard
	},
	{
		name: 'Asistencia',
		layout: '/admin',
		icon: <Icon as={MdOutlineCalendarMonth} width='20px' height='20px' color='inherit' />,
		allowedRoles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
		path: '/data-tables',
		component: DataTables
	},
	{
		name: 'Colaboradores',
		layout: '/admin',
		allowedRoles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
		icon: <Icon as={MdOutlinePeopleOutline} width='20px' height='20px' color='inherit' />,
		path: '/collaborators',
		component: Collaborators
	},
	{
		name: 'Usuarios',
		layout: '/admin',
		allowedRoles: [1, 2, 3, 4, 5, 6],
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		path: '/users',
		component: UserManage
	},
{
		name: 'Nómina',
		layout: '/admin',
		allowedRoles: [1, 2, 7],
		icon: <Icon as={MdLock} width='20px' height='20px' color='red' />,
		path: '/novedades',
		component: Novedades
	},
];

const routes = allRoutes.filter(route => {
	if (userRole === null) {
		return route.allowedRoles?.includes(1);
	}
	return route.allowedRoles?.includes(userRole) ?? false;
});
export default routes;
