/**
 * created by Ghan 2018.9.3
 * 
 * Centerm Error Class
 */

// const REQUEST_ERROR = 'RequestError';
// const STATUS_CODE_ERROR = 'StatusCodeError';

class CentermError extends Error {

    constructor (error: any) {
        super();
        this.name = 'CentermError';
        this.message = error.message;
        this.stack = (new Error()).stack;
    }
}

class CentermRequsetError extends CentermError {

    // private method?: string;

    constructor (respose: any, method?: string) {
        const errorResponse = constructErrorResponse(respose);
        super(errorResponse);
        // this.method = method;
    }
}

/**
 * Error response 有一些stuctures是基于API或者错误的回调
 * 这个方法返回一个整理好数据的统一的 CentermRequestError object
 */
function constructErrorResponse (response: any) {
    let body;
    let message;
    let status;

    /**
     * batch request error contains code and body fields
     */
    const isBatchResponse = response.code && response.body;

    if (isBatchResponse) {
        // handle batch response
        body = typeof response.body === 'string'
            ? JSON.parse(response.body)
            : response.body;
            
        status = response.code;
        
        message = body.error.message;
    } else {
        // handle single response

        body = response.error ? response.error : response;

        message = body.message;

        status = response.code;
    }

    return { body, message, status };
}

export default CentermRequsetError;