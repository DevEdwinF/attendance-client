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
	// {
	// 	name: 'NFT Marketplace',
	// 	layout: '/admin',
	// 	path: '/nft-marketplace',
	// 	icon: <Icon as={MdContactSupport
	// 	} width='20px' height='20px' color='inherit' />,
	// 	component: NFTMarketplace,
	// 	secondary: true
	// },
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
	// {
	// 	name: 'Horary',
	// 	layout: '/admin',
	// 	icon: <Icon as={MdDone} width='20px' height='20px' color='inherit' />,
	// 	path: '/horary',
	// 	component: ScheduleManage
	// },
	// {
	// 	name: 'Profile',
	// 	layout: '/admin',
	// 	path: '/profile',
	// 	icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
	// 	component: Profile
	// },
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered
	},
	{
		name: 'Attendance',
		layout: '/auth',
		path: '/attendance/register',
		icon: <Icon as={MdDone} width='20px' height='20px' color='inherit' />,
		component: Attendance
	},
	// {
	// 	name: 'RTL Admin',
	// 	layout: '/rtl',
	// 	path: '/rtl-default',
	// 	icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
	// 	component: RTL
	// }
];

export default routes;
