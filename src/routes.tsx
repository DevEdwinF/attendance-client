import { Icon } from '@chakra-ui/react';
import { MdPerson, MdOutlineCalendarMonth, MdOutlineDashboard, MdOutlinePeopleOutline } from 'react-icons/md';
import jwtDecode from 'jwt-decode';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';
import Collaborators from 'views/admin/Collaborators';
import UserManage from 'views/admin/usersManage';

interface User {
  rol: number; // Change this to the actual property name used in the token
}

// Obtener token
const token = localStorage.getItem('token');
console.log("este es el token:", token)

let userRole: number | null = null; // Initialize to a default value

if (token) {
  // Decodificar token 
  const tokenObj = jwtDecode(token);
  console.log(token)

  // Obtener rol
  userRole = (tokenObj as User).rol;
}

const allRoutes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/dashboard',
    allowedRoles: [1, 3],
    icon: <Icon as={MdOutlineDashboard} width='20px' height='20px' color='inherit' />,
    component: MainDashboard
  },
  {
    name: 'Asistencia',
    layout: '/admin',
    icon: <Icon as={MdOutlineCalendarMonth} width='20px' height='20px' color='inherit' />,
    path: '/data-tables',
    component: DataTables
  },
  {
    name: 'Colaboradores',
    layout: '/admin',
    allowedRoles: [2],

    icon: <Icon as={MdOutlinePeopleOutline} width='20px' height='20px' color='inherit' />,
    path: '/collaborators',
    component: Collaborators
  },
  {
    name: 'Usuarios',
    layout: '/admin',
    allowedRoles: [2],
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    path: '/users',
    component: UserManage
  },
];

const routes = allRoutes.filter(route => {
	if (userRole === null) {
	  return (route.allowedRoles?.includes(1) || route.allowedRoles?.includes(3)) ?? false;
	}
  
	return route.allowedRoles?.includes(userRole) ?? false;
  });

export default routes;
