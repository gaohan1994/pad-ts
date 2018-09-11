import { Dispatch } from 'redux';
// import { CHANGE_SIGN_LOADING } from './constants';
import { ConsoleUtil } from '../common/request';
import OrderService from '../service/order';

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

class CommmandController {

  /**
   * @todo 上报订单信息
   *
   * @static
   * @memberof CommmandController
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
   * @memberof CommmandController
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
}

export default CommmandController;