// AuthRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface AuthRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default AuthRoute;
