import numeral from 'numeral';
import { merge } from 'lodash';
/**
 * created by Ghan 9.3
 * @todo 设置常用的配置信息并根据环境变量导出
 */

/**
 * @param FETCH_ENTRY -- 统一访问入口
 */
export type InterfaceConfig = {
  FETCH_ENTRY: string;
} & DefaultCommonConfig;

/**
 * @todo 配置不会因为环境改变的数据项
 *
 * @param { DEFAULT_DOCUMENT_TITLE } string 默认head title
 * 
 * @param { DEFAULT_FETCH_METHOD } string 默认请求method defalut post
 * 
 * @param { DEFAULT_BALL_SPEED } number 购物车小球默认速度 220
 * 
 * @param { DEFAUL_MCHNT_CD } string 测试用 mchnt_cd
 * 
 * @export
 * @interface DefaultCommonConfig
 */
export interface DefaultCommonConfig {
  DEFAULT_DOCUMENT_TITLE: string;
  DEFAULT_FETCH_METHOD: 'POST' | 'GET' | 'post' | 'get';
  DEFAULT_BALL_SPEED: number;
  DEFAULT_PAGE_SIZE: number;
  DEFAUL_MCHNT_CD: string;
}

const defaultCommonConfig: DefaultCommonConfig = {
  DEFAULT_DOCUMENT_TITLE: '慧美食点餐',
  DEFAULT_FETCH_METHOD: 'POST',
  DEFAULT_BALL_SPEED: 220,
  DEFAULT_PAGE_SIZE: 20,
  DEFAUL_MCHNT_CD: '60000000217',
};

// 测试环境 http://202.101.149.132:7680/BKMS1
const devConfig: InterfaceConfig = {
  ...defaultCommonConfig,
  FETCH_ENTRY: 'http://202.101.149.132:7680/BKMS1/GateWayAction.do',
};

const proConfig: InterfaceConfig = {
  ...defaultCommonConfig,
  FETCH_ENTRY: '//prod/GateWayAction.do',
};

interface ProcessChoiceFilterFunc<T> {
  (arg1: T, arg2: T): T;
}

const processChoiceFilter: ProcessChoiceFilterFunc<InterfaceConfig> = (devConfig, proConfig) => {
  if (process.env.NODE_ENV === 'production') {
    return proConfig;
  } else {
    return devConfig;
  }
};

/**
 * connect 需要用到的merge工具
 * @param stateProps 
 * @param dispatchProps 
 * @param ownProps 
 */
const mergeProps = (stateProps: Object, dispatchProps: Object, ownProps: Object) => 
    Object.assign({}, ownProps, stateProps, dispatchProps);

const formatOrderTime = (time: string): string => {
  if (!time || typeof (time) !== 'string' || time.length !== 14) {
    return '非法时间格式';
  }
  // console.log(time.length);
  const year = time.substr(0, 4);
  // console.log('year', year);
  const month = time.substr(4, 2);
  // console.log('month', month);
  const day = time.substr(6, 2);
  // console.log('day', day);
  const hour = time.substr(8, 2);
  // console.log('hour: ', hour);
  const min = time.substr(10, 2);
  // console.log('min : ', min);
  const sec = time.substr(12, 2);
  // console.log('sec : ', sec);

  const formatDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

  return formatDate;
};

const isArrayFn = (value: any) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
};

/**
 * @todo 返回餐位费
 * @param { params 获取餐位费类型和餐位费返回计算好的餐位费 }
 */
const getMealFee = (params: any): any => {

  const fee = numeral(params.fee).value();
  const fee_type = numeral(params.fee_type).value();
  const people_num = numeral(params.people_num).value();
  let total = 0;
  params.data.forEach((item: any) => {
    total += numeral(item.num).value() * numeral(item.price).value();
  });
  let meal_fee = 0;

  switch (fee_type) {
    case 0:
      // 无餐位费
      break;
    case 1:
      // 定额
      meal_fee = fee;
      break;
    case 2:
      // 百分比
      meal_fee = total * fee;
      break;
    case 3:
      // 人头
      meal_fee = people_num * fee;
      break;
    default:

      break;
  }

  total = total + meal_fee;

  return {
    meal_fee,
    total,
  };
};

/**
 * @todo 传入一个订单返回一个计算好金钱的订单
 * @param { order 传入订单根据订单的餐位费打包费和菜品金额计算出订单的total和stdtrnsamt }
 */
const countTotal = (param: any): any => {
  const order = merge({}, param, {});
  const { total, meal_fee } = getMealFee(order);
  order.meal_fee = meal_fee;
  order.total = total;
  order.stdtrnsamt = numeral(total).format('0.00');
  return order;
};

export { 
  devConfig, 
  proConfig,
  mergeProps,
  formatOrderTime,
  isArrayFn,
  getMealFee,
  countTotal,
};

export default processChoiceFilter(devConfig, proConfig);