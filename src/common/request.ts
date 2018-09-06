/**
 * 打印工具如果是测试环境打印，生产环境不打印
 * @param message string 打印信息
 */
const ConsoleUtil = (message: any, title?: string): void => {
    if (process.env.NODE_ENV !== 'production') {
    
        if (title) {
            console.log(`---------------------- ${title} ----------------------`);
        }
        console.log(message);
        if (title) {
            console.log(`---------------------- ${title}结束 ----------------------`);
        }
    }
};

/**
 * 默认错误处理函数
 * @param error RequsetError
 */
const defaultErrorCallback: GenericCallbackT<RequsetError> = (error) => {

    if (error.message) {
        ConsoleUtil(error.message, '错误信息');
    }
    throw new Error(error.message || '请求错误');
};
  
/**
 * 回调函数类型
 * 
 * 接受类型 T 和数据类型是T的数据 arg 返回 void
 * @interface GenericCallbackFn
 */
export interface GenericCallbackFn {
    <T>(arg: T): void;
}

/**
 *  回调函数类型
 *
 * @interface GenericCallbackT
 * @template T
 */
export interface GenericCallbackT<T> {
    (arg: T): void;
}

export interface RequsetError {
    message?: string;
}

/**
 * 发起一个api请求
 * 
 * ------ Usaga ------
 * 
 * request('/me') // throw away the response
 * 
 * request('/me', function(r) { console.log(r) })
 * 
 * request('/me', 'post', function(r) { console.log(r) })
 * 
 * request('/me', { fields: 'email' }) // throw away the response
 * 
 * request(
 *  '/me',
 *  'post',
 *  { body: 'hi there' },
 *  function(r) {
 *     console.log(r)
 *  }
 * )
 * 
 * ------ over ------
 * 
 * @class CentermSDK
 */
const request = (
    url: string,
    ...args: Array<any>
) => {

    const argByType: any = {};

    const functions: Array<GenericCallbackFn> = [];

    let callback: GenericCallbackFn;
    
    let errorCallback: GenericCallbackT<RequsetError> = defaultErrorCallback;

    args.forEach(arg => {

        if (typeof arg === 'function') {
            /**
             * 如果是 function push 到 functions 中
             */

            functions.push(arg);
        } else {

            argByType[typeof arg] = arg;
        }
    });

    /**
     *  判断长度 第一个是 callback 第二个是 errorcallback
     */

    if (functions && functions.length > 0) {
        if (functions.length === 1) {
            callback = functions[0];
        } else if (functions.length === 2) {
            callback = functions[0];
            errorCallback = functions[1];
        }
    }

    const httpMethod = (argByType.string || 'get').toUpperCase();
    
    const params = argByType.object || {};

    let options: RequestInit = {

        /* 默认method */
        method: httpMethod,

        /* 默认headers */
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', /* 默认格式 */
            'credentials': 'include', /* 包含cookie */
        }
    };

    /* 处理body */
    if (options.method) {
        if (options.method.toUpperCase() === 'POST') {
            options.body = params
            ? JSON.stringify(params) 
            : '';
        }
    }
    
    ConsoleUtil(options, '请求报文');

    fetch(url, options)
    .then((response: any) => response.json())
    .then((responseJson: any) => {

      ConsoleUtil(responseJson, '响应报文');

      try {
          if (callback) {
              callback(responseJson);
          }
      } catch (error) {
        ConsoleUtil(error, '错误信息');

        errorCallback(error);
      }
    }).catch((err: any) => {
        errorCallback(err);
    });
};
export { ConsoleUtil };

export default request;