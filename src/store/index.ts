/**
 * created by Ghan 9.3
 * 
 * redux Store
 */

import { combineReducers } from 'redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './index';
import status, { Status } from './status';
import sign, { Sign } from './sign';
import menu, { Menu } from './menu';
import order, { Order } from './order';
export interface Stores {
  status: Status;
  sign: Sign;
  menu: Menu;
  order: Order;
}

export default combineReducers({
  status,
  sign,
  menu,
  order,
});

const configureStore = () => {

  const store = process.env.NODE_ENV === 'production'
    ? createStore(
      rootReducer,
      compose(
        applyMiddleware(thunk)
      )
    )
    : createStore(
      rootReducer,
      compose(
        applyMiddleware(thunk, createLogger)
      )
    );
  return store;
};

export { configureStore };
