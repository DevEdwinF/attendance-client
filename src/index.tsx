import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import  Attendance  from 'views/attendance/register/index';    
    
//core
import "primereact/resources/primereact.min.css";

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<HashRouter>
				<Switch>
					<Route path={`/`} component={Attendance}/>
					<Route path={`/admin`} component={AdminLayout} />
					<Redirect from='/' to='/admin' />
				</Switch>
			</HashRouter>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
