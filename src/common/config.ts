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

export { 
  devConfig, 
  proConfig,
  mergeProps,
};

export default processChoiceFilter(devConfig, proConfig);