import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Attendance from 'views/attendance/register/index';

//core
import "primereact/resources/primereact.min.css";
import AuthRoute from 'config/AuthRoute';

const isAuthenticated = () => {
	const token = localStorage.getItem('token');
	return token !== null;
};


ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Attendance} />
					<AuthRoute
						path="/admin"
						component={AdminLayout}
						isAuthenticated={isAuthenticated()}
					/>
				</Switch>
			</BrowserRouter>,
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);




