import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes';
import { AuthService } from 'services/Auth.service';

export default function Dashboard(props: { [x: string]: any }) {
	const [loading, setLoading] = useState(true);
	const [validToken, setValidToken] = useState(false);
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const { onOpen } = useDisclosure();
	const { ...rest } = props;

	useEffect(() => {
		const fetchData = async () => {
			try {
				await AuthService.validateToken();
				setValidToken(true);
			} catch (error) {
				setValidToken(false);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	if (loading) {
		return <div>Cargando...</div>;
	}

	if (!validToken) {
		return <Redirect to="/" />;
	}

	const getRoute = () => {
		return window.location.pathname !== '/admin';
	};

	const getActiveRoute = (routes: RoutesType[]): string => {
		let activeRoute = '';
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeRoute;
	};

	const getActiveNavbar = (routes: RoutesType[]): boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].secondary;
			}
		}
		return activeNavbar;
	};

	const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeNavbar;
	};

	const getRoutes = (routes: RoutesType[]): any => {
		return routes.map((route: RoutesType, key: any) => {
			if (route.layout === '/admin') {
				return <Route path={route.layout + route.path} component={route.component} key={key} />;
			} else {
				return null;
			}
		});
	};

	// document.documentElement.dir = 'ltr';

	return (
		<Box>
			<SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
				<Sidebar routes={routes} display="none" {...rest} />
				<Box
					float="right"
					minHeight="100vh"
					height="100%"
					overflow="auto"
					position="relative"
					maxHeight="100%"
					w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
					transitionDuration=".2s, .2s, .35s"
					transitionProperty="top, bottom, width"
					transitionTimingFunction="linear, linear, ease"
				>
					<Portal>
						<Box>
							<Navbar
								onOpen={onOpen}
								logoText={'Smart'}
								brandText={getActiveRoute(routes)}
								secondary={getActiveNavbar(routes)}
								message={getActiveNavbarText(routes)}
								fixed={fixed}
								{...rest}
							/>
						</Box>
					</Portal>

					{getRoute() ? (
						<Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
							<Switch>
								{getRoutes(routes)}
							</Switch>
						</Box>
					) : null}
					<Box>
						<Footer />
					</Box>
				</Box>
			</SidebarContext.Provider>
		</Box>
	);
}
