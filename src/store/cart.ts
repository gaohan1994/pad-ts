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

/**
 * @todo 寻找在 cart 中 product_id 相同的数据
 * @param { state: store }
 * @param { item: 数据 } 
 * @return { index: 在cart中的位置, data: 在cart中的数据 }
 */
export interface GetProductInCartReturn {
  index?: number;
  data?: any;
}

export const GetProductInCart = (state: Stores, item: any): GetProductInCartReturn => {
  const { list } = state.cart;
  const index = list.findIndex(i => i.product_id === item.product_id);

  if (index === -1) {
    return {};
  } else {
    return {
      index,
      data: list[index]
    };
  }
};