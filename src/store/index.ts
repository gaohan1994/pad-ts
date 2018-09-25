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
import status, { Status, initState as statusState } from './status';
import sign, { Sign, initState as signState } from './sign';
import menu, { Menu, initState as menuState } from './menu';
import order, { Order, initState as orderState } from './order';
import table, { Table, initState as tableState } from './table';
import business, { Business, initState as businessState } from './business';
import cart, { Cart, initState as cartState } from './cart';
export interface Stores {
  status: Status;
  sign: Sign;
  menu: Menu;
  order: Order;
  table: Table;
  business: Business;
  cart: Cart;
}

export const StoreState = {
  status: statusState,
  sign: signState,
  menu: menuState,
  order: orderState,
  table: tableState,
  business: businessState,
  cart: cartState,
};

export default combineReducers({
  status,
  sign,
  menu,
  order,
  table,
  business,
  cart,
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
