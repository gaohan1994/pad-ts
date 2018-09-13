import { 
  RECEIVE_ORDER_LIST,
  RECEIVE_ORDER_DETAIL,
} from '../action/constants';
import { OrderActions } from '../action/order';
import { Stores } from './index';
import { merge } from 'lodash';
import numeral from 'numeral';
// import config from '../common/config';

export type Order = {
  orders: any[];
  paid: any[];
  unpaid: any[];
  order: object;
};

export const initState = {
  orders: [],
  paid: [],
  unpaid: [],
  order: {},
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
           * order_status
           * trnsflag
           * -1 交易失败
           * 0 交易初始化
           * 1 交易成功
           * 2 交易撤销
           * 3 交易退单
           */
          if (numeral(item.trnsflag).value() === 1) {
            paid.push(item);
          } else {
            unpaid.push(item);
          }
        });
      }

      state.orders = state.orders.concat(orders);
      state.paid = state.paid.concat(paid);
      state.unpaid = state.unpaid.concat(unpaid);

      return merge({}, state, {});

    case RECEIVE_ORDER_DETAIL:
      const { payload: { order } } = action;

      return {
        ...state,
        order,
      };
      
    default: return state;
  }
}

export const GetPaid = (store: Stores) => store.order.paid;

export const GetUnpaid = (store: Stores) => store.order.unpaid;