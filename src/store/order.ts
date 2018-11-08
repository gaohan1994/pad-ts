import { 
  RECEIVE_ORDER_LIST,
  RECEIVE_ORDER_DETAIL,
  CHAGNE_ORDER_LOADING,
  RECEIVE_CALLED_NUMBER,
  RECEIVE_PAY_ORDER,
} from '../action/constants';
import { OrderActions } from '../action/order';
import { Stores } from './index';
import { merge } from 'lodash';

export type Order = {
  orders: any[];
  order: any;
  loading: boolean;
  calledNumber: string;
  payOrder: any;
};

export const initState = {
  orders: [],
  order: {},
  loading: false,
  calledNumber: '',
  payOrder: {},
};

/**
 * @todo order 仓库
 *
 * @export
 * @param {Order} [state=initState]
 * @param {OrderActions} action
 * @returns {Order}
 */
export default function order ( 
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

    /**
     * @param { trnsflag | -1: 交易失败, 0: 交易初始化, 1: 交易成功, 2: 交易撤销, 3: 交易退单, }
     */
    // state.orders = state.orders.concat(orders);
    state.orders = orders;
    return merge({}, state, {});

    /**
     * @todo
     * @param { order 原数据 } 
     */
  case RECEIVE_ORDER_DETAIL:
    const { payload: { order } } = action;

    return {
      ...state,
      order,
    };

  case CHAGNE_ORDER_LOADING:
    const { payload: { loading } } = action;
    return {
      ...state,
      loading: loading
    };

  case RECEIVE_CALLED_NUMBER:
    const { payload: { calledNumber } } = action;
    return {
      ...state,
      calledNumber,
    };

  case RECEIVE_PAY_ORDER:
    const { payload: { payOrder } } = action;
    return {
      ...state,
      payOrder,
    };
  default: return state;
  }
}

export const GetOrders = (store: Stores) => store.order.orders;

export const GetOrder = (store: Stores) => store.order.order;

export const GetOrderLoading = (store: Stores) => store.order.loading;

export const GetCalledNumber = (store: Stores) => store.order.calledNumber;

export const GetPayOrder = (store: Stores) => store.order.payOrder;