import * as React from 'react';
import { RouteProps } from 'react-router-dom';

export type PlainStyle = { [key: string]: number };

export interface MapStylesFunc {
  (arg: PlainStyle): any;
}

export interface RouteTransitionProps {
  className?: string;

  wrapperComponent?: boolean | string | Element;

  atEnter?: object;

  atActive?: object;

  atLeave?: object;

  didLeave?: () => void;

  mapStyles?: MapStylesFunc;

  runOnMount?: boolean;
}

declare class AnimatedRoute<T extends RouteProps & RouteTransitionProps> extends React.Component<T, any> { }

declare class AnimatedSwitch<T extends RouteProps & RouteTransitionProps> extends React.Component<T, any> { }

declare class RouteTransition extends React.Component<RouteTransitionProps, {}> { }

export {
  AnimatedRoute,
  AnimatedSwitch,
  RouteTransition,
};