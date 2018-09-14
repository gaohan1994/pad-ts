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
 * @param DEFAULT_DOCUMENT_TITLE -- 默认head title
 * 
 * @param DEFAULT_FETCH_METHOD -- 默认请求method defalut post
 * 
 * @param DEFAULT_BALL_SPEED -- 购物车小球默认速度 220
 * 
 * @export
 * @interface DefaultCommonConfig
 */
export interface DefaultCommonConfig {
  DEFAULT_DOCUMENT_TITLE: string;
  DEFAULT_FETCH_METHOD: 'POST' | 'GET' | 'post' | 'get';
  DEFAULT_BALL_SPEED: number;
  DEFAULT_PAGE_SIZE: number;
}

const defaultCommonConfig: DefaultCommonConfig = {
  DEFAULT_DOCUMENT_TITLE: '慧美食点餐',
  DEFAULT_FETCH_METHOD: 'POST',
  DEFAULT_BALL_SPEED: 220,
  DEFAULT_PAGE_SIZE: 20,
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

export { 
  devConfig, 
  proConfig,
  mergeProps,
  formatOrderTime,
  isArrayFn,
};

export default processChoiceFilter(devConfig, proConfig);