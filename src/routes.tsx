import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdPerson, MdHome, MdLock, MdOutlineShoppingCart, MdContactSupport, MdDone
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Collaborators from 'views/admin/Collaborators';
import RTL from 'views/admin/rtl';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

//Attendance Imports

import  Attendance  from 'views/attendance/register';
import ScheduleManage from 'components/scheduleManage/ScheduleManage';

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
		icon: <Icon as={MdDone} width='20px' height='20px' color='inherit' />,
		path: '/data-tables',
		component: DataTables
	},
	{
		name: 'Collaborators',
		layout: '/admin',
		icon: <Icon as={MdDone} width='20px' height='20px' color='inherit' />,
		path: '/collaborators',
		component: Collaborators
	},

];

export default routes;
