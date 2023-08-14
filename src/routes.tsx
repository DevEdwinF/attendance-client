import { Icon } from '@chakra-ui/react';
import { MdPerson, MdOutlineCalendarMonth, MdOutlineDashboard, MdOutlinePeopleOutline} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';
import Collaborators from 'views/admin/Collaborators';
import UserManage from 'views/admin/usersManage';

const routes = [
	{
		name: 'Dashboard',
		layout: '/admin',
		path: '/default',
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
		icon: <Icon as={MdOutlinePeopleOutline} width='20px' height='20px' color='inherit' />,
		path: '/collaborators',
		component: Collaborators
	},
	{
		name: 'Usuarios',
		layout: '/admin',
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		path: '/users',
		component: UserManage
	},

];

export default routes;
