import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
// import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
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

const App = () => {
	const [authenticated, setAuthenticated] = useState(false);


	useEffect(() => {
		const checkAuthentication = () => {
			const token = localStorage.getItem('token');
			setAuthenticated(token !== null);
		};

		checkAuthentication();
	}, []);

	return (
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<BrowserRouter>
					<Switch>
						<Route exact path="/">
							{authenticated ? <Redirect to="/admin/dashboard" /> : <Attendance />}
						</Route>

						<AuthRoute
							path="/admin"
							component={AdminLayout}
							isAuthenticated={authenticated}
						/>
					</Switch>
				</BrowserRouter>,
			</React.StrictMode>
		</ChakraProvider>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
