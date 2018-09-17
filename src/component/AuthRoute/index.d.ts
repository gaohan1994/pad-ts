import React from 'react';
import { RouteProps } from 'react-router-dom';

export interface AuthRouteProps extends RouteProps {
  redirectPath?: string;
}

export default class AuthRoute extends React.Component<AuthRouteProps, {}> {}

export function RequireAuthComponent (Component: any) : any;