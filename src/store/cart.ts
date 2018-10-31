/**
 * @todo card reducer created by ghan 9.25
 */
import {
  UPDATE_CART,
  RECEIVE_CURRENT_CART_ID,
  RECEIVE_CURRENT_DISH,
} from '../action/constants';
import { Stores } from './index';
import config from '../common/config';
import { CartActions } from '../action/cart';

/**
 * @param { list: { [key]: {} } }
 * 
 */
export type Cart = {
  currentCartId: string;
  list: {
    [key: string]: any[];
  },
  currentDish: any;
};

export const initState = {
  currentCartId: config.TAKEAWAYCARTID,
  list: {
    [config.TAKEAWAYCARTID]: []
  },
  currentDish: {},
};
/**
 * @todo cart reducer 
 * 
 * @method UPDATE_CART 
 * payload { id: 唯一标示（如果是堂食则是 table_no 如果不是堂食那么就是外带 默认一个 cart_id） }
 *
 * @export
 * @param {Cart} [state=initState]
 * @param {*} action
 * @returns {Cart}
 */
export default function cart (state: Cart = initState, action: CartActions): Cart {
  switch (action.type) {

    case UPDATE_CART:
      const { payload: { id, list: updateList } } = action;
      return {
        ...state,
        list: { 
          ...state.list,
          [id]: updateList 
        },
      };

    case RECEIVE_CURRENT_CART_ID:
      const { payload: { currentCartId } } = action;
      /**
       * @param {currentCartId} string 当redux中不存在该currentCartId的list时，创建一个空的
       */
      if (currentCartId && !state.list[currentCartId]) {
        return {
          ...state,
          currentCartId,
          list: {
            ...state.list,
            [currentCartId]: []
          }
        };
      } else {
        return {
          ...state,
          currentCartId,
        };
      }
    
    case RECEIVE_CURRENT_DISH:
      const { payload: { currentDish } } = action;
      return {
        ...state,
        currentDish,
      };

    default: return state;
  }
}

export const GetList = (state: Stores) => state.cart.list;

export interface GetCurrentCartListReturn {
  currentCartId: string;
  list: any[];
}

/**
 * @todo 从所有 cart list 中找到当前的 cart list
 */
export const GetCurrentCartList = (state: Stores): GetCurrentCartListReturn => {
  const { cart: { currentCartId } } = state;
  return {
    currentCartId,
    list: state.cart.list[currentCartId],
  } || {};
};

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

export const GetProductInCart = (state: Stores, item: any, attrs?: any[]): GetProductInCartReturn => {
  const { list } = GetCurrentCartList(state);
  if (list && list.length > 0) {
    const index = list.findIndex(i => i.product_id === item.product_id);

    if (index === -1) {
      return {};
    } else {
      return {
        index,
        data: list[index]
      };
    }
  } else {
    return {};
  }
};

/**
 * @todo 获取当前选中菜品
 * @param {Stores} state
 */
export const GetCurrentDish = (state: Stores) => state.cart.currentDish;