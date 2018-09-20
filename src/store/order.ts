import { 
  RECEIVE_ORDER_LIST,
  RECEIVE_ORDER_DETAIL,
  CHANGE_ORDER_TOKEN,
  CHANGE_ORDER_DETAIL,
  CHANGE_ORDER_DISHES,
  CHANGE_ORDER_PEOPLE_NUMBER,
  CHANGE_ORDER_TABLE_NUMBER,
} from '../action/constants';
import { OrderActions } from '../action/order';
import { Stores } from './index';
import { merge } from 'lodash';
import numeral from 'numeral';
import { countTotal } from '../common/config';

export type Order = {
  orders: any[];
  paid: any[];
  unpaid: any[];
  order: any;
  orderChange: any;
  changeToken: boolean;
};

export const initState = {
  orders: [],
  paid: [],
  unpaid: [],
  order: {},
  orderChange: {},
  changeToken: false,
};

/**
 * @todo order 仓库
 *
 * @export
 * @param {Order} [state=initState]
 * @param {OrderActions} action
 * @returns {Order}
 */
export default function menu ( 
  state: Order = initState,
  action: OrderActions,
): Order {

  switch (action.type) {
  /**
   * @todo 把数据拆分成已付款和未付款存入redux中
   */
  case RECEIVE_ORDER_LIST:
    const { payload } = action;
    const { orders } = payload;

    const paid: any[] = [];
    const unpaid: any[] = [];

    if (orders && orders.length > 0) {
      orders.forEach((item: any) => {
        /**
         * @param { trnsflag | -1: 交易失败, 0: 交易初始化, 1: 交易成功, 2: 交易撤销, 3: 交易退单, }
         */
        if (numeral(item.trnsflag).value() === 0) {
          unpaid.push(item);
        } else {
          paid.push(item);
        }
      });
    }

    state.orders = state.orders.concat(orders);
    state.paid = state.paid.concat(paid);
    state.unpaid = state.unpaid.concat(unpaid);

    return merge({}, state, {});

    /**
     * @todo
     * 1.把请求的数据保存两份到redux中
     * 2.把token初始化
     * 2.1刚进入页面的情况
     * 2.2更新订单之后的情况 应该都没有问题
     * @param { order 第一份原数据 } 
     * @param { orderChange 第二份可以改变的数据源 } 
     * @param { changeToken 显示的是原数据还是改变的订单数据 } 
     */
    case RECEIVE_ORDER_DETAIL:
    const { payload: { order } } = action;

    return {
      ...state,
      order,
      orderChange: merge({}, order, {}),
      changeToken: false,
    };
      
    /**
     * @todo 显示订单的状态
     * @param { 当 token 等于 false 的时候表示放弃修改复原 orderChange } 
     */
    case CHANGE_ORDER_TOKEN:
    const { order: recoveryOrder } = state;
    const { payload: { token } } = action;

    if (token === false) {
      return {
        ...state,
        changeToken: token,
        orderChange: merge({}, recoveryOrder, {}),
      };
    } else {
      return {
        ...state,
        changeToken: token,
      };
    }

    /**
     * @todo 修改订单
     * @param { params : { changeType, chagneDetail } }
     */
    case CHANGE_ORDER_DETAIL:
    const { payload: { params } } = action;
    console.log('params: ', params);

    const { changeType, changeDetail } = params;

    switch (changeType) {
      /**
       * @todo 修改菜品 退菜
       * @param { product_id 索引菜品 }
       * @param { is_weight 判断是否称斤 }
       * @param { first_attr second_attr 校验是否相同菜品的条件 }
       */
      case CHANGE_ORDER_DISHES:
        const { product_id, product_name, first_attr, second_attr } = changeDetail;
        const index: number = state.orderChange.data.findIndex((item: any) => {
          if (
            item.product_id === product_id
            && item.product_name === product_name
            && item.first_attr === first_attr
            && item.second_attr === second_attr
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (index !== -1) {
          state.orderChange.data[index].num -= 1;
        }

        break;
      /**
       * @todo 修改用餐人数
       * @param { people_num 要修改成的用餐人数，修改完成之后餐位费和总价随着变化 }
       */
      case CHANGE_ORDER_PEOPLE_NUMBER:
        const { people_num } = changeDetail;
        state.orderChange.people_num = people_num;
        break;
      /**
       * @todo 修改桌号
       * @param { table_no 要修改成的桌号，有需求是在修改之后选项就变色了，可能没有交互接口前端写死吗？ }
       * @param { 把桌子上的所有参数都覆盖一下因为餐位费之类的也会变 }
       */
      case CHANGE_ORDER_TABLE_NUMBER:
        const { 
          fee, 
          feeType,
          num,
          table_name,
          table_no,
        } = changeDetail;
        state.orderChange.fee = fee;
        state.orderChange.fee_type = feeType;
        state.orderChange.max_peopel_num = num;
        state.orderChange.table_name = table_name;
        state.orderChange.table_no = table_no;
        break;
      default: break;
    }

    /**
     * @param { countTotal 修改金钱, 最后一步 不管之前触发什么修改行为最后都触发修改总价和餐位费的行为 }
     */
    const newOrderChange: any = countTotal(state.orderChange);
    console.log('order: ', state.order.table_name);
    state.orderChange = newOrderChange;
    return merge({}, state, {});

    default: return state;
  }
}

export const GetOrders = (store: Stores) => store.order.orders;

export const GetPaid = (store: Stores) => store.order.paid;

export const GetUnpaid = (store: Stores) => store.order.unpaid;

export const GetOrder = (store: Stores) => store.order.order;

export const GetOrderChange = (store: Stores) => store.order.orderChange;

export const GetChangeToken = (store: Stores) => store.order.changeToken;