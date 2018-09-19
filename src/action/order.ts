import { Dispatch } from 'redux';
import { 
  RECEIVE_ORDER_LIST,
  RECEIVE_ORDER_DETAIL,
  CHANGE_ORDER_TOKEN,
  CHANGE_ORDER_DETAIL,
  CHANGE_ORDER_DISHES,
  CHANGE_ORDER_PEOPLE_NUMBER,
  CHANGE_ORDER_TABLE_NUMBER,
} from './constants';
import { ConsoleUtil } from '../common/request';
import OrderService from '../service/order';
import Base from './base';
import { Stores } from '../store/index';

/**
 * @param terminal_cd 
 * @param is_pos 
 * @param mchnt_cd 
 * @param term_trans_trc 终端流水号
 * @param oper_id 操作员号
 * @param term_datetime 终端交易时间
 * @param stdtrnsamt 交易金额
 * @param discount 总优惠金额
 * @param packing_price 
 * @param pay_no 
 * @param pay_ty 
 * @param totalnum 
 * @param order_detail 
 * @param table_no 
 * @param people_num 
 * @param table_name 
 * @param meal_fee 餐位费
 * @param account_paid 已支付费用
 *
 * @export
 * @interface SendOrderParams
 */
export interface SendOrderParams {
  terminal_cd: string;
  is_pos: string;
  mchnt_cd: string;
  term_trans_trc: string;
  oper_id: string;
  term_datetime: string;
  stdtrnsamt: string;
  discount: string;
  packing_price: string;
  pay_no: string;
  pay_ty: string;
  totalnum: string;
  order_detail: string;
  table_no?: string;
  people_num?: string;
  table_name?: string;
  meal_fee?: string;
  account_paid?: string;
}

export interface OrderQueryParams {
  order_no?: string;
  mchnt_cd: string;
  table_no?: string;
  begindate?: string;
  enddate?: string;
  trnsflag?: string;
  currentPage: string;
  pageSize: string;
}
export interface UpdateOrderDetailParam {
  order_no: string;
  ispos: string;
  terminal_cd: string;
  mchnt_cd: string;
  term_trans_trc: string;
  oper_id: string;
  term_datetime: string;
  stdtrnsamt: string;
  discount: string;
  packing_price: string;
  pay_ty: string;
  totalnum: string;
  table_no: string;
  people_num: string;
  table_name: string;
  meal_fee: string;
  account_paid: string;
}

export interface CloseOrderParams {
  order_no: string;
  mchnt_cd?: string;
  ispos: '1' | '2';
}

export interface OrderDetailSearchParams {
  mchnt_cd: string;
  order_no: string;
}

export interface ChangeOrderDetailParams { 
  changeType: CHANGE_ORDER_DISHES | CHANGE_ORDER_PEOPLE_NUMBER | CHANGE_ORDER_TABLE_NUMBER; 
  changeDetail: any;
}

export interface ReceiveOrderList {
  type: RECEIVE_ORDER_LIST;
  payload: any;
}

export interface ReceiveOrderDetail {
  type: RECEIVE_ORDER_DETAIL;
  payload: any;
}

export interface ChangeOrderToken {
  type: CHANGE_ORDER_TOKEN;
  payload: any;
}

export interface ChangeOrderDetail {
  type: CHANGE_ORDER_DETAIL;
  payload: any;
}

export type OrderActions = 
  ReceiveOrderList 
  | ReceiveOrderDetail 
  | ChangeOrderToken
  | ChangeOrderDetail;

class OrderController extends Base {

  /**
   * @todo 上报订单信息
   *
   * @static
   * @memberof OrderController
   */
  static sendOrder = (params: SendOrderParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('sendOrder');

    const result = await OrderService.sendOrder(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 更新订单详情
   *
   * @static
   * @memberof OrderController
   */
  static updateOrderDetail = (params: UpdateOrderDetailParam) => async (dispatch: Dispatch) => {
    ConsoleUtil('updateOrderDetail');

    const result = await OrderService.updateOrderDetail(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 更新订单信息
   *
   * @static
   * @memberof OrderController
   */
  static updateOrder = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('updateOrder');

    const result = await OrderService.updateOrder(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 订单确认
   *
   * @static
   * @memberof OrderController
   */
  static orderConfirm = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('orderConfirm');

    const result = await OrderService.orderConfirm(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 取消订单
   *
   * @static
   * @memberof OrderController
   */
  static cancelOrder = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('cancelOrder');

    const result = await OrderService.cancelOrder(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 关闭订单
   *
   * @static
   * @memberof OrderController
   */
  static closeOrder = (params: CloseOrderParams) => async (dispatch: Dispatch, state: () => Stores) => {
    ConsoleUtil('closeOrder');
    const { sign: { userinfo } } = await state();

    const orderParam: CloseOrderParams = {
      ...params,
      mchnt_cd: params.mchnt_cd || userinfo.mchnt_cd,
    };
    
    const result = await OrderService.closeOrder(orderParam);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 查询订单 模糊
   *
   * @static
   * @memberof OrderController
   */
  static searchOrder = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('searchOrder');

    const result = await OrderService.searchOrder(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 订单列表查询
   *
   * @static
   * @memberof OrderController
   */
  static orderQuery = (params: OrderQueryParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('orderQuery');

    const result = await OrderService.orderQuery(params);
    if (result.code === '10000') {
      dispatch({
        type: RECEIVE_ORDER_LIST,
        payload: {
          orders: result.biz_content.data
        }
      });
    } else {
      console.log(result);
      Base.toastFail('请求订单失败');
    }
  }

  /**
   * @todo 订单详情查询 精确
   *
   * @static
   * @memberof OrderController
   */
  static orderDetailSearch = (params: OrderDetailSearchParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('orderDetailSearch');

    const result = await OrderService.orderDetailSearch(params);
    if (result.code === '10000') {
      dispatch({
        type: RECEIVE_ORDER_DETAIL,
        payload: {
          order: result.biz_content
        }
      });
    } else {
      console.log(result);
      Base.toastFail('查询订单详情失败');
    }
  }

  /**
   * @todo 显示订单修改状态
   * @param { token } 要修改成的状态
   *
   * @static
   * @memberof OrderController
   */
  static changeOrderToken = (token: boolean) => async (dispatch: Dispatch) => {
    ConsoleUtil('changeOrderToken');

    dispatch({
      type: CHANGE_ORDER_TOKEN,
      payload: {
        token: token
      }
    });
  }

  /**
   * @todo 修改订单详情
   * @param { ChangeOrderDetailParams: { chagneType: string; changeDetail: any } } 
   *
   * @static
   * @memberof OrderController
   */
  static changeOrderDetail = (params: ChangeOrderDetailParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('changeOrderDetail');

    dispatch({
      type: CHANGE_ORDER_DETAIL,
      payload: { params },
    });
  }
}

export default OrderController;