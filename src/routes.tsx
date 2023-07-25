import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart, MdContactSupport, MdDone, MdOutlineCalendarMonth, MdAccountCircle} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import DataTables from 'views/admin/dataTables';
import Collaborators from 'views/admin/Collaborators';




const routes = [
	{
		name: 'Panel de control',
		layout: '/admin',
		path: '/default',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
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
		name: 'Collaborators',
		layout: '/admin',
		icon: <Icon as={MdAccountCircle} width='20px' height='20px' color='inherit' />,
		path: '/collaborators',
		component: Collaborators
	},

];

export default routes;
