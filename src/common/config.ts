/**
 * created by Ghan 9.3
 * @todo 设置常用的配置信息并根据环境变量导出
 */

import { merge } from 'lodash';

export type InterfaceConfig = {
  
} & DefaultCommonConfig;

/**
 * @todo 配置不会因为环境改变的数据项
 *
 * @export
 * @interface DefaultCommonConfig
 */
export interface DefaultCommonConfig {
  DEFAULT_DOCUMENT_TITLE: string;
}

const defaultCommonConfig: DefaultCommonConfig = {
  DEFAULT_DOCUMENT_TITLE: '慧美食点餐',
};

const devConfig: InterfaceConfig = {
  ...defaultCommonConfig,
};

const proConfig: InterfaceConfig = {
  ...defaultCommonConfig,
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
const mergeProps = (stateProps: Object, dispatchProps: Object, ownProps: Object, ...rest: Array<any>) => {
  return merge({}, ownProps, stateProps, dispatchProps, rest);
};

export { 
  devConfig, 
  proConfig,
  mergeProps,
};

export default processChoiceFilter(devConfig, proConfig);