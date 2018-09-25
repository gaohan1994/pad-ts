/**
 * @todo card reducer created by ghan 9.25
 */
import {
  UPDATE_CART,
} from '../action/constants';
import { Stores } from './index';

export type Cart = {
  list: any[];
};

export const initState = {
  list: [],
};

export default function cart (state: Cart = initState, action: any): Cart {
  switch (action.type) {
    case UPDATE_CART:
      const { payload: { list } } = action;
      return {
        ...state,
        list,
      };

    default: return state;
  }
}

export const GetList = (state: Stores) => state.cart.list;