import numeral from 'numeral';
import { merge } from 'lodash';
import { Dispatch } from 'redux';
import { Stores } from '../store/index';
import { UPDATE_CART } from './constants';

/**
 * 返回 属性的 id 组合 和属性本身
 * @param { attrs 属性数组 }
 */
const AttrParamHepler = (attrs: any[]): any => {
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
export const CheckAttrItemAlreadyInCart = (item: any, list: any[], attrs?: any[]): boolean => {
  const productIdToken = list.findIndex(l => l.product_id === item.product_id);
  if (productIdToken === -1) {
    return false;
  } else if (!!attrs) {
    /**
     * @param { 判断如果传上来的属性都能在该条数据中找到那么才是存在于cart中 }
     */
    const currentListItem = merge({}, list[productIdToken]);

    const { id } = AttrParamHepler(attrs);

    const attrToken = currentListItem.number.findIndex((n: any) => n.id === id);

    if (attrToken === -1) {
      // 不存在
      return false;
    } else {
      // 存在
      return true;
    }
    
  } else {
    return true;
  }
};

class CartController {

  /**
   * @todo 加入新条目到购物车
   * @param { param: { data: data, attrs: [] } }
   *
   * @memberof CartController
   */
  public putItemToCart = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    /**
     * @param { data 数据条目 }
     * @param { attrs 如果有attrs 说明是规格商品如果没有那么是默认或者称斤 }
     * @param { list 购物车中的条目 } 
     * 
     * -- 1.判断是否是规格商品 -- 
     * @param { 规格 先判断是否已经有了，如果没有 push 进去一份 }
     * 
     * -- 2.判断是否是称斤商品 --
     * 
     * -- 3.默认商品 --
     */
    const { data, attrs } = param;
    const { cart: { list } } = await state();

    if (attrs) {

      // const checkToken = CheckAttrItemAlreadyInCart(data, list, attrs);
      // console.log('checkToken:', checkToken);

      const attrParam = {
        ...AttrParamHepler(attrs),
        number: 1,
      };

      const token = list.findIndex(l => l.product_id === data.product_id);
      if (token === -1) {
        data.number = [attrParam];
        list.push(data);
      } else {
        list[token].number.push(attrParam);
      }

      dispatch({
        type: UPDATE_CART,
        payload: { list: merge([], list) }
      });
    } else if (numeral(data.is_weight).value() === 1) {
      // 称斤
    } else {
      // 默认
      data.number = 1;
    }

  }

  /**
   * @todo 添加数量
   *
   * @memberof CartController
   */
  public addItem = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    console.log('addItem');
    const { } = await state();
    //
  }

  /**
   * @todo 减少数量
   *
   * @memberof CartController
   */
  public reducItem = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    const { } = await state();
    //
  }

  /**
   * @todo 从购物车删除 
   *
   * @memberof CartController
   */
  public deleteItem = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    const { } = await state();
    //
  }
}

export default new CartController();