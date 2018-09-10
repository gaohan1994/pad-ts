/**
 * @todo -------- 用户登录注册模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';
import { RegisterParams } from '../action/sign';

class SignService {

  /**
   * @todo 注册用户
   * 
   * @static
   * @memberof SignService
   */
  static registerUser = async (params: RegisterParams): Promise<any> => {
    return request(
      '', 
      'post', 
      {
        method: 'user.regist',
        biz_content: {
          ...params,
        }
      }
    );
  }
  
  /**
   * @todo 校验账号是否唯一
   *
   * @static
   * @memberof SignService
   */
  static checkUserIdUnique = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'user.id_unique',
        biz_content: {
          ...params
        }
      }
    );
  }

  /**
   * @todo POS端用户登录
   *
   * @static
   * @memberof SignService
   */
  static userLoginPos = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'user.login',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 手机端用户登录
   *
   * @static
   * @memberof SignService
   */
  static userLoginMobile = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'user.mobile_login',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取用户信息
   *
   * @static
   * @memberof SignService
   */
  static getUserInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'user.get_userinfo',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default SignService;