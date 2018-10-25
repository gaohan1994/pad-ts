import numeral from 'numeral';
import { merge } from 'lodash';
import { Dispatch } from 'redux';
import { Stores } from '../store/index';
import { GetCurrentCartList, GetCurrentCartListReturn } from '../store/cart';
import { UPDATE_CART, RECEIVE_CURRENT_CART_ID, RECEIVE_CURRENT_DISH } from './constants';
import Base from './base';

export interface UpdateCart {
  type: UPDATE_CART;
  payload: any;
}
export interface SetCurrentDish {
  type: RECEIVE_CURRENT_DISH;
  payload: any;
}

export interface SetCurrentCart {
  type: RECEIVE_CURRENT_CART_ID;
  payload: any;
}

export type CartActions = UpdateCart | SetCurrentCart | SetCurrentDish;

export interface CallbackParam {
  type: 'add' | 'reduce';
  param: {
    currentCartId?: string;
    list?: any[];
    currentCartItem?: any;
    attrToken?: any;
    attrs?: any;
  };
}

/**
 * @param {Dispatch}
 * @param {currentCartId}
 *
 * @export
 * @interface SetCurrentCartParam
 */
export interface SetCurrentCartParam {
  dispatch: Dispatch;
  currentCartId: string;
}

/**
 * @return { id 结合之后的 id } id
 * @return { attrs 传入的 attrs } attrs
 *
 * @export
 * @interface AttrParamHeplerReturn
 */
export interface AttrParamHeplerReturn {
  id: string;
  attrs: any[];
}

/**
 * @param { data 菜品数据 }
 * @param { attrs 如果是规格商品上传规格 }
 *
 * @export
 * @interface CartItemPayload
 */
export interface CartItemPayload {
  data: any;
  attrs?: any;
  callback?: (param?: CallbackParam) => void;
}

/**
 * @param { inCart: boolean 是否存在 cart 中 } inCart
 * @param { index: number 在 cart 中的位置 } index
 * @param { attrToken: any 如果是规格商品那么 返回 attrToken } attrToken
 *
 * @export
 * @interface CheckItemAlreadyInCartReturn
 */
export interface CheckItemAlreadyInCartReturn {
  inCart: boolean;
  index?: number;
  attrToken?: {
    attrIndex: number;
    attrId: string;
  };
}

/**
 * 返回 属性的 id 组合 和属性本身
 * @param { attrs 属性数组 }
 */
export const AttrParamHepler = (attrs: any[]): AttrParamHeplerReturn => {
  const ids = attrs.map((attr: any) => {
    return numeral(attr.attrId).value();
  });

  const id = ids.sort((a, b) => a - b).join('');

  return { id, attrs };
};

/**
 * @todo 校验商品是否存在购物车中
 * @param { item: 需要校验的商品; list: 购物车列表 }
 * @param { return boolean true: 存在购物车中 false: 不存在购物车中  }
 * 
 * 1.判断 product_id 是否存在
 * 2.如果有 product_id 
 *  如果有传 attrs 判断 attrs 是否都存在该 product_id 中
 */
export const CheckItemAlreadyInCart = (item: any, list: any[], attrs?: any[]): CheckItemAlreadyInCartReturn => {
  const productIdToken = list.findIndex(l => l.product_id === item.product_id);
  if (productIdToken === -1) {
    return { inCart: false, index: productIdToken };
  } else if (!!attrs) {
    /**
     * @param { 判断如果传上来的属性都能在该条数据中找到那么才是存在于cart中 }
     */
    const currentListItem = merge({}, list[productIdToken]);
    const { id } = AttrParamHepler(attrs);
    const attrToken = currentListItem.number.findIndex((n: any) => n.id === id);

    if (attrToken === -1) {
      // 不存在
      return { inCart: false, index: productIdToken };
    } else {
      // 存在
      return { inCart: true, index: productIdToken, attrToken: { attrIndex: attrToken, attrId: id } };
    }
  } else {
    // 存在
    return { inCart: true, index: productIdToken };
  }
};

class CartController {

  /**
   * @todo set current Cart id
   * 
   * @param { param: { dispatch: Dispatch, currentCartId: string } }
   *
   * @memberof CartController
   */
  public setCurrentCart = async (param: SetCurrentCartParam) => {
    const { dispatch, currentCartId } = param;

    dispatch({
      type: RECEIVE_CURRENT_CART_ID,
      payload: { currentCartId }
    });
  }

  /**
   * @todo 加入条目到购物车
   * @param { param: { data: data, attrs: [] } }
   *
   * @memberof CartController
   */
  public addItem = (param: CartItemPayload) => async (dispatch: Dispatch, state: () => Stores) => {
    /**
     * @param { data 数据条目 }
     * @param { attrs 如果有attrs 说明是规格商品如果没有那么是默认或者称斤 }
     * @param { list 购物车中的条目 } 
     * 
     * -- 1.判断是否是规格商品 -- 
     * @param { 规格 先判断是否已经有了，如果没有 push 进去一份 }
     * 
     * -- 2.判断是否是称斤商品 --
     * @param { 称斤 weight 参数传递称斤的数据 }
     * 
     * -- 3.默认商品 --
     * @param { 除了 data 啥也没 }
     */
    const { data, attrs, callback } = param;
    // const { cart: { list } } = await state();
    const { list, currentCartId }: GetCurrentCartListReturn = GetCurrentCartList(await state());
    // console.log('GetCurrentCartList list: ', list);
    if (attrs) {
      /**
       * @param { inCart === false 购物车中不存在该商品 }
       * @param { inCart === true 购物车中存在该商品 }
       */
      const { inCart, index, attrToken }: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list, attrs);

      if (inCart === false && index === -1) {
        const attrParam = {
          ...AttrParamHepler(attrs),
          number: 1,
        };

        data.number = [attrParam];
        list.push(data);

        if (callback) {
          callback({ type: 'add', param: {list, currentCartId, currentCartItem: data, attrs, attrToken} });
        }
      } else if (inCart === false && typeof index === 'number' && index !== -1) {
        // 商品存在于购物车但是没有这个规格
        const attrParam = {
          ...AttrParamHepler(attrs),
          number: 1,
        };

        list[index].number.push(attrParam);

        if (callback) {
          callback({ type: 'add', param: {list, currentCartId, currentCartItem: data, attrs, attrToken} });
        }
      } else if (inCart === true) {
        if (typeof index === 'number' && attrToken) {
          const { attrIndex } = attrToken;
          list[index].number[attrIndex].number += 1;

          if (callback) {
            callback({ type: 'add', param: {list, currentCartId, currentCartItem: data, attrs, attrToken} });
          }
        } else {
          Base.toastFail('点餐失败~');
        }
      } else {
        Base.toastFail('点餐失败~');
      }

    } else if (numeral(data.is_weight).value() === 1) {
      // 称斤
    } else {
      // 默认
      const token: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list);

      if (token.inCart === false) {
        data.number = 1;
        list.push(data);
      } else if (token.inCart === true) {
        if (typeof token.index === 'number') {
          list[token.index].number += 1;
        } 
      }

      if (callback) {
        callback({ type: 'add', param: {list, currentCartId, currentCartItem: data} });
      }
    }

    dispatch({
      type: UPDATE_CART,
      payload: { id: currentCartId, list: merge([], list) }
    });
  }

  /**
   * @todo 减少条目数量 当数量为1的时候删除条目
   * @param { data 要修改的数据 } 
   * @param { list 购物车 }
   *
   * @memberof CartController
   */
  public reducItem = (param: CartItemPayload) => async (dispatch: Dispatch, state: () => Stores) => {
    const { data, attrs, callback } = param;
    const { list, currentCartId }: GetCurrentCartListReturn = GetCurrentCartList(await state());
    
    if (attrs) {
      const { inCart, index, attrToken }: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list, attrs);

      if (inCart === true && typeof index === 'number' && attrToken) {
        const { attrIndex } = attrToken;

        if (list[index].number[attrIndex].number === 1) {
          list[index].number.splice(attrIndex, 1);
        } else {
          list[index].number[attrIndex].number -= 1;
        }

        if (callback) {
          callback({ type: 'reduce', param: {list, currentCartId, currentCartItem: list[index], attrs, attrToken} });
        }
      } else {
        Base.toastFail('点餐出错了~');
      }
    } else if (data.weight === true) {
      //
    } else {
      const { inCart, index }: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list);

      if (inCart === true && typeof index === 'number') {
        // console.log('list[index]', list[index]);
        if (list[index].number === 1) {
          list.splice(index, 1);
        } else {
          list[index].number -= 1;
        }

        if (callback) {
          callback({ type: 'reduce', param: {list, currentCartId, currentCartItem: list[index]} });
        }
      } else {
        Base.toastFail('点餐出错了~');
      }
    }

    dispatch({
      type: UPDATE_CART,
      payload: { id: currentCartId, list: merge([], list) }
    });
  }

  /**
   * @todo 清空购物车
   *
   * @memberof CartController
   */
  public emptyCart = () => async (dispatch: Dispatch, state: () => Stores) => {
    const { currentCartId }: GetCurrentCartListReturn = GetCurrentCartList(await state());
    dispatch({
      type: UPDATE_CART,
      payload: { id: currentCartId, list: [] }
    });
  }

  /**
   * @todo 设置当前选中菜品
   * @param {1.切换功能的时候置空 }
   * @param {2.切换 }
   *
   * @memberof CartController
   */
  public setCurrentDish = async (param: any) => {
    const { dispatch, currentDish = {} } = param;

    dispatch({
      type: RECEIVE_CURRENT_DISH,
      payload: { currentDish },
    });
  }
}

export default new CartController();