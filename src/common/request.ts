import moment from 'moment';
import { checkStatus, ConstructErrorResponse } from './exception';
import history from '../history';
import config from '../common/config';
import Base from '../action/base';

/**
 * 加密处理
 */
export const getDefaultConfig = (body: any) => {
    return {
        ...body,
        timestamp: moment().format('YYYY-MM-DD HH:MM:SS'),
        mac: '111',
        session_id: '111',
    };
};

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
 *  'POST',
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
): any => {
    url = config.FETCH_ENTRY;
    // url = config.INSIDE_FETCH_ENTRY;
    console.log('fetch url: ', url);
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

    const httpMethod = (argByType.string || config.DEFAULT_FETCH_METHOD).toUpperCase();
    const params = argByType.object || {};
    let options: RequestInit = {

        /* 默认method */
        method: httpMethod,

        /* 默认headers */
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            // 'Accept': 'text/html',
            // 'Content-Type': 'application/x-www-form-urlencoded', /* 默认格式 */
            // 'credentials': 'include',
        }
    };

    /* 处理body */
    if (options.method) {
        if (options.method.toUpperCase() === 'POST') {
            options.body = params
            ? JSON.stringify(getDefaultConfig(params)) 
            : '';
        }
    }
    
    ConsoleUtil(options, '请求报文');

    try {
        return fetch(url, options)
        .then(checkStatus)
        .then((response: any) => response.json())
        .then((responseJson: any) => {
          ConsoleUtil(responseJson, '响应报文');
          try {
            if (callback) {
                callback(responseJson);
            }
            return responseJson;
          } catch (error) {
            Base.toastFail(error.msg || '网络异常');
            ConsoleUtil(error, '错误信息');
            errorCallback(error);
            return error;
          }
        })
        .catch((err: any) => {
            Base.toastFail('网络异常');
            errorCallback(err);
        })
        .catch((e: ConstructErrorResponse) => {
            if (e.status === 401) {
                history.push('/exception/401');
                return;
            }
            if (e.status === 403) {
                history.push('/exception/403');
                return;
            }
            if (e.status <= 504 && e.status >= 500) {
                history.push('/exception/500');
                return;
            }
            if (e.status >= 404 && e.status < 422) {
                history.push('/exception/404');
                return;
            }
        });
    } catch (error) {
        console.log('error: ', error);
        Base.toastFail('网络异常');
        return error;
    }
};

const payRequest = (
    url: string,
    ...args: Array<any>
): any => {
    url = config.WX_PAY_FETCH_ENTTRY;
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

    const httpMethod = (argByType.string || config.DEFAULT_FETCH_METHOD).toUpperCase();
    const params = argByType.object || {};
    let options: RequestInit = {

        /* 默认method */
        method: httpMethod,

        /* 默认headers */
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Accept': 'text/html',
        }
    };

    /* 处理body */
    if (options.method) {
        if (options.method.toUpperCase() === 'POST') {
            options.body = params
            ? JSON.stringify(getDefaultConfig(params)) 
            : '';
        }
    }
    try {
        return fetch(url, options)
        .then(checkStatus)
        .then((response: any) => response.json())
        .then((responseJson: any) => {
          ConsoleUtil(responseJson, '响应报文');
          try {
            if (callback) {
                callback(responseJson);
            }
            return responseJson;
          } catch (error) {
            Base.toastFail('系统异常');
            ConsoleUtil(error, '错误信息');
            errorCallback(error);
            return error;
          }
        })
        .catch((err: any) => {
            Base.toastFail('网络异常');
            errorCallback(err);
        })
        .catch((e: ConstructErrorResponse) => {
            if (e.status === 401) {
                history.push('/exception/401');
                return;
            }
            if (e.status === 403) {
                history.push('/exception/403');
                return;
            }
            if (e.status <= 504 && e.status >= 500) {
                history.push('/exception/500');
                return;
            }
            if (e.status >= 404 && e.status < 422) {
                history.push('/exception/404');
                return;
            }
        });
    } catch (error) {
        console.log('error: ', error);
        Base.toastFail('网络异常');
        return error;
    }
};
export { ConsoleUtil, payRequest };

export default request;