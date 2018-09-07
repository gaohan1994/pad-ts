/**
 * created by Ghan 2018.9.3
 * 
 * Centerm Error Class
 */
import { Toast } from 'antd-mobile';

const codeMessage = {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
};

/**
 * @todo 返回统一的 centerm 错误信息
 * @param body body 内的数据信息
 * @param message 错误信息
 * @param status 错误码
 * 
 * @export
 * @interface ConstructErrorResponse
 */
type ConstructErrorResponse = { 
    body: any;
    message: string;
    status: number;
};

// const REQUEST_ERROR = 'RequestError';
// const STATUS_CODE_ERROR = 'StatusCodeError';

class CentermError extends Error {
    private status?: number;
    private body?: any;

    constructor (error: any) {
        super();
        this.name = 'CentermError';
        this.status = error.status;
        this.body = error.body;
        this.message = error.message;
        this.stack = (new Error()).stack;

        console.log('status: ', this.status);
        console.log('body: ', this.body);
    }
}

class CentermRequsetError extends CentermError {

    constructor (respose: any) {
        const errorResponse: ConstructErrorResponse = constructErrorResponse(respose);
        super(errorResponse);
    }
}

/**
 * Error response 有一些stuctures是基于API或者错误的回调
 * 这个方法返回一个整理好数据的统一的 CentermRequestError object
 */
function constructErrorResponse (response: any): ConstructErrorResponse {

    const body = typeof response.body === 'string'
        ? JSON.parse(response.body)
        : response.body;
        
    const status = response.status;
    const message = body.error.message || codeMessage[status];

    return { body, message, status };
}

/**
 * 检查报文信息是否报错
 *
 * @param {*} response
 * @returns
 */
function checkStatus(response: any) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        console.log('error response: ', response);

        const errortext = codeMessage[response.status] || response.statusText;
        console.log('errortext: ', errortext);

        Toast.fail(`请求错误 ${response.status}: ${response.url}`, 2);
        const error = new CentermRequsetError(response);
        throw error;
    }
}

export { 
    checkStatus,
    ConstructErrorResponse,
};

export default CentermRequsetError;