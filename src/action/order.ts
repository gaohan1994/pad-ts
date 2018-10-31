import moment from 'moment';
import numeral from 'numeral';
import { Dispatch } from 'redux';
import { 
  RECEIVE_ORDER_LIST,
  RECEIVE_ORDER_DETAIL,
  CHANGE_ORDER_TOKEN,
  CHANGE_ORDER_DETAIL,
  CHANGE_ORDER_DISHES,
  CHANGE_ORDER_PEOPLE_NUMBER,
  CHANGE_ORDER_TABLE_NUMBER,
  CHAGNE_ORDER_LOADING,
} from './constants';
import { ConsoleUtil } from '../common/request';
import OrderService from '../service/order';
import Base from './base';
import { Stores } from '../store/index';
import { GetUserinfo } from '../store/sign';
import { randomString, isArrayFn } from '../common/config';
import { GetCurrentCartList } from '../store/cart';
import StatusController from './status';
import BusinessController from './business';
import CartController from './cart';
import { merge } from 'lodash';

export interface ManageMenuParams {
  type: 'add' | 'retire';
  order: any;
  data: any;
  table: any;
}

export interface Product {
  product_id: string;
  product_name: string;
  price: string;
  first_attr: string;
  second_attr: string;
  num: number;
  is_add_dish?: string;
  ori_price?: number;
  subtotal?: number;
}
export interface SendOrderParams {

}

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
 * @interface SendOrderPayload
 */
export interface SendOrderPayload {
  terminal_cd: string;
  is_pos: string;
  mchnt_cd: string;
  term_trans_trc: string;
  oper_id: string;
  term_datetime: string;
  stdtrnsamt: string;
  discount: string;
  packing_price: string;
  pay_no?: string;
  pay_ty?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  totalnum: string;
  order_detail: any[];
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

export interface ChangeOrderLoading {
  type: CHAGNE_ORDER_LOADING;
  payload: any;
}

export type OrderActions = 
  ReceiveOrderList 
  | ReceiveOrderDetail 
  | ChangeOrderToken
  | ChangeOrderDetail
  | ChangeOrderLoading;

/**
 * @return { product: Product | products: Product[] }
 * @param { item: product }
 * @param {extendSupportFunction} 扩展函数
 */
export const ReturnStandardProduct = (
  item: any, 
  extendSupportFunction?: (param: any) => any,
): any => {
  
  if (isArrayFn(item.number) === false) {
    const product = {
      product_id: item.product_id,
      product_name: item.product_name,
      price: numeral(item.price).format('0.00'),
      first_attr: '',
      second_attr: '',
      num: item.num || item.number,
    };
    if (!extendSupportFunction) {
      return product;
    } else {
      return extendSupportFunction(product);
    }
  } else {
    const products = item.number.map((productAttr: any) => {
      const product = {
        product_id: item.product_id,
        product_name: item.product_name,
        price: numeral(item.price).format('0.00'),
        first_attr: productAttr.attrs[0] && productAttr.attrs[0].attrName,
        second_attr: productAttr.attrs[1] && productAttr.attrs[1].attrName,
        num: productAttr.number,
      };
      if (!extendSupportFunction) {
        return product;
      } else {
        return extendSupportFunction(product);
      }
    });

    return products;
  }
};

/**
 * @param 
 *
 * @export
 * @interface GetTotalParamsReturn
 */
export interface GetTotalParamsReturn {
  formatTotalNumber: number | string;
  formatTotalPrice: number | string;
}

export interface GetTotalParamsConfig {
  priceFormat: 'number' | 'string';
  numberFormat: 'number' | 'string';
}

/**
 * @todo 传入所有标准 products 返回对应数据
 * @param { products 所有标准化的数据 }
 * @param { config: GetTotalParamsConfig 配置选项 }
 * @return { totalNubmer: number, totalPrice: number }
 */
export const GetTotalParams = (
  products: Product[],
  config: GetTotalParamsConfig = {
    priceFormat: 'string',
    numberFormat: 'string',
  }
): GetTotalParamsReturn => {
  let totalNumber: number = 0;
  let totalPrice: number = 0;

  products.forEach((product: Product, index: number) => {
    const productNumber = numeral(product.num).value();
    const productPrice = numeral(product.price).value();
    totalNumber += productNumber;
    totalPrice += productNumber * productPrice;
  });

  const { priceFormat, numberFormat } = config;
  let formatTotalNumber: number | string = totalNumber;
  let formatTotalPrice: number | string = totalPrice;

  if (priceFormat === 'string') {
    formatTotalPrice = numeral(totalPrice).format('0.00');
  } else if (priceFormat === 'number') {
    formatTotalPrice = numeral(totalNumber).value();
  }

  if (numberFormat === 'string') {
    formatTotalNumber = String(totalNumber);
  } else if (numberFormat === 'number') {
    formatTotalNumber = numeral(totalNumber).value();
  }

  return { formatTotalNumber, formatTotalPrice };
};

export interface AnalysisStandardMoneyParam {
  table: any;
  order: any;
}
export interface AnalysisStandardMoneyReturn {
  meel_fee: string;
  total: string;
}

export const AnalysisStandardMoney = (params: AnalysisStandardMoneyParam): AnalysisStandardMoneyReturn => {
  const { table, order } = params;

  /**
   * @param {feeType} 餐位费类型 0: 无，1: 定额, 2: 百分比, 3:人头
   * @param {fee} 餐位费
   */
  const { feeType, fee } = table;
  /**
   * @param {people_num} 用餐人数
   * @param {data} 菜品
   */
  const { people_num, data } = order;

  /**
   * @param {pureTotal} 未计算餐位费之前的菜品总额
   * @param {currentMealFee} 重新计算的餐位费
   * @param {currentTotal} 重新计算的总价
   */
  let pureTotal: number = 0;
  let currentMealFee: number = 0;
  let currentTotal: number = 0;

  data.forEach((dish: any) => {
    pureTotal += dish.subtotal;
  });
  const type = numeral(feeType).value();
  switch (type) {
    case 0:
      break;
    case 1:
      // 定额
      currentMealFee = fee;
      break;
    case 2:
      // 百分比
      currentMealFee = pureTotal * fee;
      break;
    case 3:
      // 人头
      currentMealFee = people_num * fee;
      break;
    default:
      break;
  }
  currentTotal = currentMealFee + pureTotal;

  return { meel_fee: numeral(currentMealFee).format('0.00'), total: numeral(currentTotal).format('0.00') };
};

class OrderController extends Base {

  /**
   * @todo 下单接口 v2
   *
   * @static
   * @memberof OrderController
   */
  static sendOrderV2 = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);
    const store: Stores = state();
    const { mchnt_cd } = GetUserinfo(store);
    
    /**
     * @param {params} 通用数据
     */
    const params = {
      mchnt_cd,
      term_datetime: moment().format('YYYYMMDDHHMMSS'),
      stdtrnsamt: '',
      discount: '0.00',
      packing_price: '',
      meal_fee: '',
      change: '',
      total: '',
      total_num: '',
      order_detail: [],
    };

    /**
     * @param {IS_TAKE_OUT} 根据是否是外带传入下面的参数
     */

    console.log('params: ', params);
  }
 
  /**
   * @todo 加 / 减 减多少菜 num 设置成多少
   * @param {params} 加退菜格式的数据
   *
   * @static
   * @memberof OrderController
   */
  static manageMenu = (param: ManageMenuParams) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);

    const store: Stores = await state();
    const { mchnt_cd } = GetUserinfo(store);

    /**
     * @param {type} 加菜还是退菜
     * @param {order} 要修改的订单
     * @param {data} list 数据
     * @param {table} 选中的桌子
     */
    const { type, order, data, table } = param;

    /**
     * @param {data} 菜品数据 1.先标准化
     * @param {products} 标准化菜品
     */
    let products: any[] = [];

    /**
     * @param {extendSupportFunction} 扩展函数把数据补齐
     */
    const extendSupportFunction = (item: any) => {
      return {
        ...item,
        num: numeral(item.num).format('0'),
        is_add_dish: type === 'add' ? '1' : '0',
        subtotal: numeral(
          numeral(item.price).value() * numeral(item.num).value()
        ).format('0.00'),
      };
    };

    data.forEach((item: any) => {
      const StandardProduct = ReturnStandardProduct(item, extendSupportFunction);
      if (isArrayFn(StandardProduct) === false) {
        products.push(StandardProduct);
      } else if (isArrayFn(StandardProduct) === true) {
        products = products.concat(StandardProduct);
      }
    });

    /**
     * @param {formatTotalNumber} 标准化数据中的总条数
     * @param {formatTotalPrice} 标准化数据的总价
     */
    const { formatTotalNumber, formatTotalPrice } = GetTotalParams(products);

    /**
     * @param {table.feeType === 2} 按比例计算餐位费，当退菜的时候这部分的餐位费应该撤掉
     * @param {cutMealFee} number 应该砍掉的餐位费 或者是应该加上的餐位费
     */
    let cutMealFee: number = 0;
    if (table.feeType === 2) {
      cutMealFee = numeral(formatTotalPrice).value() * table.fee;
    }

    /**
     * @param {total} 新的总价
     */
    const total = type === 'add' ? numeral(
      numeral(order.stdtrnsamt).value() + numeral(formatTotalPrice).value() + cutMealFee,
    ).format('0.00') : numeral(
      numeral(order.stdtrnsamt).value() - numeral(formatTotalPrice).value() - cutMealFee,
    ).format('0.00');

    let params: any = {
      order_no: order.order_no,
      is_pos: 'false',
      mchnt_cd,
      total_num: formatTotalNumber,
      order_detail: products,
      discount: '0.00',
      stdtrnsamt: total,
      total: total,
    };

    /**
     * @TODO 处理餐位费
     * @param {table.feeType === 2} 当餐位费是按比例计算
     * @param {meal_fee} 如果有就添加没有就不传
     */
    if (order.meal_fee && table.feeType === 2) {
      params.meal_fee = type === 'add' 
        ? numeral(order.meal_fee + cutMealFee).format('0.00') 
        : numeral(order.meal_fee - cutMealFee).format('0.00');
    } else if (order.meal_fee) {
      params.meal_fee = numeral(order.meal_fee).format('0.00');
    }

    /**
     * @param {OrderService.manageMenu} result 1.先退菜
     * @param {BusinessController.setSelectedTable} 2.重新请求对应 order 接口并存入 redux
     * @param {Base.toastInfo} 3.toast显示成功
     */
    const result = await OrderService.manageMenu(params);

    if (result.code === '10000') {
      const orderParam = { mchnt_cd, table_no: `${table.table_no}` };
      
      const { code: orderCode, biz_content: orderBizContent }: any = await OrderService.orderQueryByTable(orderParam);

      if (orderCode === '10000') {
        /**
         * @param {1.hidelogin 2.toast 3.recovery cart}
         */
        StatusController.hideLoading(dispatch);
        Base.toastInfo(type === 'add' ? '下单成功~' : '退菜成功~');
        CartController.setCurrentDish({ dispatch, currentDish: {} });
        let newTable: any = merge({}, table);
        newTable.tableOrder = orderBizContent;
  
        let setTableParam: any = { dispatch, table: newTable };
        BusinessController.setSelectedTable(setTableParam);
      } else {
        StatusController.hideLoading(dispatch);
        Base.toastFail('请求订单信息失败!');
      }
    } else {
      StatusController.hideLoading(dispatch);
      Base.toastFail(type === 'add' ? '下单失败' : '退菜失败');
    }
  }

  /**
   * @todo 根据桌号查询订单信息
   *
   * @static
   * @memberof OrderController
   */
  static orderQueryByTable = (table_no: string) => async (dispatch: Dispatch, state: () => Stores) => {
    ConsoleUtil('orderQueryByTable', 'orderQueryByTable');

    const { mchnt_cd } = GetUserinfo(await state());

    const param = {
      mchnt_cd,
      table_no,
    };

    const result = await OrderService.orderQueryByTable(param);
    
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      Base.toastFail('请求接口出错');
    }
  }

  /**
   * @todo 上报订单信息
   *
   * @static
   * @memberof OrderController
   */
  static sendOrder = (params: SendOrderParams) => async (dispatch: Dispatch, state: () => Stores) => {
    ConsoleUtil('sendOrder');
    const Store = await state();
    const { list } = GetCurrentCartList(await state());
    const { mchnt_cd } = GetUserinfo(Store);

    let products: Product[] = [];
    
    list.forEach((item: any) => {
      const StandardProduct = ReturnStandardProduct(item);
      if (isArrayFn(StandardProduct) === false) {
        products.push(StandardProduct);
      } else if (isArrayFn(StandardProduct) === true) {
        products = products.concat(StandardProduct);
      }
    });

    const { formatTotalNumber, formatTotalPrice } = GetTotalParams(products);

    if (typeof formatTotalNumber === 'string' && typeof formatTotalPrice === 'string') {
      const payload: SendOrderPayload = {
        terminal_cd: 'TEST1',
        is_pos: '2',
        mchnt_cd,
        term_trans_trc: randomString(6),
        oper_id: '',
        term_datetime: moment().format('YYYYMMDDHHmmss'),
        stdtrnsamt: formatTotalPrice,
        discount: numeral(0).format('0.00'),
        packing_price: numeral(0).format('0.00'),
        totalnum: formatTotalNumber,
        order_detail: products,
      };
      console.log('payload: ', payload);
      const result = await OrderService.sendOrder(payload);
      if (result.code === '10000') {
        console.log(result);
      } else {
        console.log(result);
        Base.toastFail('下单失败!');
      }
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

    dispatch({
      type: CHAGNE_ORDER_LOADING,
      payload: { loading: true },
    });

    const result = await OrderService.orderQuery(params);
    if (result.code === '10000') {
      await dispatch({
        type: RECEIVE_ORDER_LIST,
        payload: {
          orders: result.biz_content.data
        }
      });

      dispatch({
        type: CHAGNE_ORDER_LOADING,
        payload: { loading: false },
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