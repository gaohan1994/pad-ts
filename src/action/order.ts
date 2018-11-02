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
  RECEIVE_CALLED_NUMBER,
  UPDATE_CART,
  RECEIVE_PAY_ORDER,
} from './constants';
import { ConsoleUtil } from '../common/request';
import OrderService from '../service/order';
import Base from './base';
import { Stores } from '../store/index';
import { GetUserinfo, GetOperatorInfo } from '../store/sign';
import config, { randomString, isArrayFn, Navigate } from '../common/config';
import { GetCurrentCartList } from '../store/cart';
import StatusController from './status';
import BusinessController from './business';
import CartController from './cart';
import { merge } from 'lodash';
import { GetSelecetedTable } from '../store/table';
import { GetCalledNumber } from '../store/order';

export interface CheckOrderStatusReturn {
  success: boolean;
  status?: string;
}
export interface CheckOrderStatusParams {
  mchnt_cd: string;
  order_no: string;
}
export interface PayOrderParam {
  order: any;
  callback: (param: PayOrderReturn) => void;
}
export interface SendOrderV2Params {
  needPay: boolean;
}
export interface ManageMenuParams extends SendOrderV2Params {
  type: 'add' | 'retire';
  order: any;
  data: any;
  table: any;
  currentCartId: string;
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

export interface PayOrderReturn {
  success: boolean;
  url?: string;
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

export interface ReceiveCalledNumber {
  type: RECEIVE_CALLED_NUMBER;
  payload: any;
}

export interface ReceivePayOrder {
  type: RECEIVE_PAY_ORDER;
  payload: any;
}

export type OrderActions = 
  ReceiveOrderList 
  | ReceiveOrderDetail 
  | ChangeOrderToken
  | ChangeOrderDetail
  | ChangeOrderLoading
  | ReceiveCalledNumber
  | ReceivePayOrder;

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
      num: `${item.num || item.number}`,
      subtotal: numeral(numeral(item.price).value() * numeral(item.num || item.number).value()).format('0.00'),
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
        num: `${productAttr.number}`,
        subtotal: numeral(
          (
            numeral(item.price).value() + 
            numeral(productAttr.attrs[0] && productAttr.attrs[0].attrPrice).value() +
            numeral(productAttr.attrs[1] && productAttr.attrs[1].attrPrice).value()
          ) * numeral(productAttr.number).value()
         ).format('0.00'), 
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

interface GetMealAndTrueTotalMoneyParam {
  table: any; 
  products: any[];
}

interface GetMealAndTrueTotalMoneyReturn {
  pureTotal: string;
  meal_fee: string;
  total: string;
  totalNumber: string;
}

/**
 * @param {table} 选中的桌子
 * @param {products} 标准化数据
 */
export const GetMealAndTrueTotalMoney = (param: GetMealAndTrueTotalMoneyParam ): GetMealAndTrueTotalMoneyReturn => {
  const { table, products } = param;
  
  /**
   * @param {feeType} 餐位费类型 0: 无，1: 定额, 2: 百分比, 3:人头
   * @param {fee} 餐位费
   */
  const { table_no, feeType, fee, people } = table;

  /**
   * @param {pureTotal} 未计算餐位费之前的菜品总额
   * @param {currentMealFee} 重新计算的餐位费
   * @param {currentTotal} 重新计算的总价
   * @param {totalNumber} 菜品的总数
   */
  let pureTotal: number = 0;
  let currentMealFee: number = 0;
  let currentTotal: number = 0;
  let totalNumber: number = products.length;

  products.forEach((dish: any) => { 
    pureTotal += numeral(dish.subtotal).value();
  });

  if (table_no === config.TAKEAWAYCARTID) {
    /**
     * @param {table_no === config.TAKEAWAYCARTID} 外卖不计算餐位费
     */
    return {
      pureTotal: numeral(pureTotal).format('0.00'),
      meal_fee: numeral(currentMealFee).format('0.00'), 
      total: numeral(pureTotal).format('0.00'),
      totalNumber: numeral(totalNumber).format('0'),
    };
  } else {
    /**
     * @param {table_no !== config.TAKEAWAYCARTID} 非外卖计算餐位费
     */
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
        currentMealFee = people * fee;
        break;
      default:
        break;
    }
    currentTotal = currentMealFee + pureTotal;
    
    return {
      pureTotal: numeral(pureTotal).format('0.00'),
      meal_fee: numeral(currentMealFee).format('0.00'), 
      total: numeral(currentTotal).format('0.00'),
      totalNumber: numeral(totalNumber).format('0'),
    };
  }
};

class OrderController extends Base {

  static checkOrderStatus = async (params: CheckOrderStatusParams): Promise<CheckOrderStatusReturn> => {
    const result = await OrderService.checkOrderStatus(params);

    if (result.code === '10000') {
      return { success: true, status: result.biz_content.order_status };
    } else {
      return { success: false };
    }
  }

  /**
   * @todo 设置 payorder 但是没有 bind action 的函数
   *
   * @static
   * @memberof OrderController
   */
  static setPayOrderWidthoutBind = async (param: any) => {
    const { dispatch, order } = param;
    dispatch({
      type: RECEIVE_PAY_ORDER,
      payload: { payOrder: order }
    });
  }
  /**
   * @param 设置 pay order 
   */
  static setPayOrder = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    const { order } = param;
    dispatch({
      type: RECEIVE_PAY_ORDER,
      payload: { payOrder: order }
    });
  }

  /**
   * @param {recoverPayOrder} 清空准备支付的数据
   */
  static recoverPayOrder = (dispatch: Dispatch) => {
    // 
    dispatch({
      type: RECEIVE_PAY_ORDER,
      payload: { payOrder: {} }
    });
  }

  /**
   * @todo 获取支付链接 
   *
   * @static
   * @memberof OrderController
   */
  static payOrder = (param: PayOrderParam) => async (dispatch: Dispatch, state: () => Stores): Promise<any> => {
    StatusController.showLoading(dispatch);
    const { mchnt_cd } = GetUserinfo(await state());
    const { order, callback }: PayOrderParam = param;
    /**
     * @param {} 1.先访问order状态看看当前状态是否是未支付
     * @param {} 2.如果是未支付在支付
     */
    const checkParam: CheckOrderStatusParams = { mchnt_cd, order_no: order.order_no };
    const { success, status }: CheckOrderStatusReturn = await OrderController.checkOrderStatus(checkParam);

    if (success === true) {
      const formatStatus = numeral(status).value();
      if (formatStatus === 0) {
        /**
         * @param {formatStatus === 0} 未支付
         */
        const params = {
          mchnt_cd,
          order_no: order.order_no,
          amount: numeral(order.stdtrnsamt).format('0.00'),
          wechat_openid: config.DEV_WECHAT_OPENID,
        };
        
        const result = await OrderService.payOrder(params);
        if (result.code === '10000') {
          StatusController.hideLoading(dispatch);
          /**
           * @param {result.payUrl} 支付链接
           */
          callback({
            success: true,
            url: result.biz_content.payUrl
          });
        } else {
          Base.toastFail(result.msg || '请求支付失败');
          callback({ success: false });
        }
      } else if (formatStatus === 4) {
        StatusController.hideLoading(dispatch);
        /**
         * @param {formatStatus === 4} 已支付
         */
        Base.toastFail('订单已支付');
      } else {
        StatusController.hideLoading(dispatch);
        /**
         * @param {formatStatus} 其他支付状态
         */
        Base.toastFail('错误的订单状态');
      }
    } else {
      StatusController.hideLoading(dispatch);
      Base.toastFail('未查找到该订单的支付状态');
      Navigate.navto('/orderlist');
    }
  }

  /**
   * @todo 获取取餐号
   *
   * @static
   * @memberof OrderController
   */
  static getCalledNumber = () => async (dispatch: Dispatch, state: () => Stores) => {
    const { mchnt_cd } = GetUserinfo(await state());
    const params = {
      mchnt_cd,
      terminal_sn: config.DEFAULT_TERMINAL_SN
    };
    const result = await OrderService.getCalledNumber(params);

    if (result.code === '10000') {
      dispatch({
        type: RECEIVE_CALLED_NUMBER,
        payload: { calledNumber: result.biz_content.called_num },
      });
      console.log('result: ', result);
    } else {
      Base.toastFail('获取取餐号失败！');
    }
  }

  /**
   * @todo 下单接口 v2
   *
   * @static
   * @memberof OrderController
   */
  static sendOrderV2 = (params: SendOrderV2Params) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);
    const store: Stores = state();
    /**
     * @param {list} 购物车中的商品
     * @param {currentCartId} 当前的购物车的ID
     * @param {mchnt_cd} 商户号
     * @param {table} 当前选中的 table
     */
    const { list, currentCartId } = GetCurrentCartList(store);
    const { mchnt_cd } = GetUserinfo(store);
    const table = GetSelecetedTable(store);
    const { user_id } = GetOperatorInfo(store);

    /**
     * @param {extendSupportFunction} 扩展函数把数据补齐
     */
    const extendSupportFunction = (item: any) => {
      return {
        ...item,
        is_add_dish: '0'
      };
    };
    /**
     * @param {products} 标准数据
     */
    let products: any[] = [];
    list.forEach((item: any) => {
      const StandardProduct = ReturnStandardProduct(item, extendSupportFunction);
      if (isArrayFn(StandardProduct) === false) {
        products.push(StandardProduct);
      } else if (isArrayFn(StandardProduct) === true) {
        products = products.concat(StandardProduct);
      }
    });
    /**
     * @param {pureTotal}
     * @param {meal_fee} 餐位费 
     * @param {total} 计算餐位费之后的实际付款
     */
    const { meal_fee, total, totalNumber }: GetMealAndTrueTotalMoneyReturn = GetMealAndTrueTotalMoney({table, products});

    /**
     * @param {params} 通用数据
     */
    let payloadParam: any = {
      terminal_cd: config.DEFAULT_TERMINAL_CD,
      terminal_sn: config.DEFAULT_TERMINAL_SN,
      is_pos: 'false',
      mchnt_cd,
      term_datetime: moment().format('YYYYMMDDHHMMSS'),
      stdtrnsamt: total,
      discount: '0.00',
      meal_fee: meal_fee,
      total: total,
      total_num: totalNumber,
      order_detail: products,
      oper_id: user_id,
    };

    /**
     * @param {IS_TAKE_OUT} 根据是否是外带传入下面的参数
     * @param {called_num} 外卖号
     */
    if (currentCartId === config.TAKEAWAYCARTID) {
      const calledNumber = GetCalledNumber(store);
      payloadParam = {
        ...payloadParam,
        called_num: `${calledNumber}`,
        is_take_out: '1',
      };
    } else {
      payloadParam = {
        ...payloadParam,
        is_take_out: '0',
        table_no: `${table.table_no}`,
        people_num: `${table.people}`,
        table_name: `${table.table_name}`,
      };
    }
    const result = await OrderService.sendOrderV2(payloadParam);
    console.log('sendOrderV2 result: ', result);
    if (result.code === '10000') {
      /**
       * @todo 成功之后的处理
       * @param {1.判断是否是外带，如果是外带显示结账，如果不是外带根据外面传入的参数进行判断是否展示结账}
       */
      StatusController.hideLoading(dispatch);
      if (currentCartId === config.TAKEAWAYCARTID) {
        /**
         * --- 1.外带 ---
         * @param {} 1.清空购物车
         * @param {} 2.设置 selectedTable 
         * @param {} 2.整合数据显示结账页面
         */
        await dispatch({
          type: UPDATE_CART,
          payload: { id: currentCartId, list: [] }
        });

        const newOrder = {
          ...payloadParam,
          ...result.biz_content,
        };

        const newTable = {
          table_no: config.TAKEAWAYCARTID,
          tableOrder: {
            ...newOrder,
            data: newOrder.order_detail
          }
        };
        console.log('newTable: ', newTable);
        await BusinessController.setSelectedTable({
          dispatch,
          table: newTable,
        });

        console.log('newOrder: ', newOrder);
        StatusController.showPay(dispatch);
        OrderController.setPayOrderWidthoutBind({ order: newOrder, dispatch });
      } else {
        /**
         * --- 2.堂食 ---
         * @param {needPay} 根据传入的 needPay 决定是否需要显示支付
         */
        const { needPay } = params;

        if (needPay === true) {
          /**
           * @param {needPay === true} 需要显示支付
           * @param {} -1.请求菜单信息防止库存没了
           * @param {} -2.请求桌子信息因为有桌子可能被占用了
           * @param {} -3.请求所有订单信息因为有下单过了
           * @param {} 1.因为下单成功清空 currentCart 数据
           * @param {} 2.重置 selectedTable
           * @param {} 4.整合订单信息 显示支付
           */
          await dispatch({
            type: UPDATE_CART,
            payload: { id: currentCartId, list: [] }
          });

          const newOrder = {
            ...payloadParam,
            ...result.biz_content,
          };
          console.log('newOrder: ', newOrder);

          const newTable = {
            ...table,
            tableOrder: {
              ...newOrder,
              data: newOrder.order_detail
            }
          };
          console.log('newTable: ', newTable);
          await BusinessController.setSelectedTable({
            dispatch,
            table: newTable,
          });

          StatusController.showPay(dispatch);
          OrderController.setPayOrderWidthoutBind({ order: newOrder, dispatch });
        } else {
          /**
           * @param {needPay === false}
           * @todo 0.跳转到首页 因为跳转到首页了，所以不用请求其他数据
           * @param {} 1.因为下单成功清空 currentCart 数据
           * @param {} 2.重置 selectedTable
           * @param {} 3.跳转到首页
           */
          await dispatch({
            type: UPDATE_CART,
            payload: { id: currentCartId, list: [] }
          });
          await BusinessController.setSelectedTable({
            dispatch,
            table: { table_no: config.TAKEAWAYCARTID },
          });
          Navigate.navto(`/table/${mchnt_cd}`);
        }
      }
    } else {
      StatusController.hideLoading(dispatch);
      Base.toastFail(result.msg || '下单失败');
    }
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
    const { type, order, data, table, needPay, currentCartId } = param;

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
        is_add_dish: type === 'add' ? '1' : '0',
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
         * @param 下单成功
         * @param {} 1.隐藏loading toast
         * @param {} 2.存入 selectedTable
         * @param {} 3.如果是加菜 清理 购物车
         */
        StatusController.hideLoading(dispatch);
        Base.toastInfo(type === 'add' ? '下单成功~' : '退菜成功~');
        CartController.setCurrentDish({ dispatch, currentDish: {} });

        let newTable: any = merge({}, table);
        newTable.tableOrder = orderBizContent;

        let setTableParam: any = { dispatch, table: newTable };
        await BusinessController.setSelectedTable(setTableParam);
        
        if (type === 'add') {
          await dispatch({
            type: UPDATE_CART,
            payload: { id: currentCartId, list: [] }, 
          });
        }

        if (needPay === true) {
          /**
           * @param {needPay} 需要显示支付
           */
          console.log('orderBizContent: ', orderBizContent);

          StatusController.showPay(dispatch);
          OrderController.setPayOrderWidthoutBind({ order: orderBizContent, dispatch });
        } else if (type === 'add') {
          /**
           * @param {needPay} 不需要显示支付 但是是加菜成功则跳转到首页
           */
          Navigate.navto(`/table/${mchnt_cd}`);
        }
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