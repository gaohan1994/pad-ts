import Base from './base';
import { Dispatch } from 'redux';
import { 
  CHANGE_SIGN_LOADING,
  RECEIVE_USERINFO,
} from './constants';
import { ConsoleUtil } from '../common/request';
import SignService from '../service/sign';
// import StatusController from './status';
export interface RegisterParams {
  user_id: string;
  passwd: string;
  user_name: string;
  id_card: string;
  mobile: string;
  mchnt_name: string;
  mchnt_addr: string;
  district: string;
  detailed_address: string;
  license: string;
  terminal_sn: string;
  shop_type: string;
  version: string;
  level_id: string;
}

export interface UserLoginPosParams {
  user_id: string;
  passwd: string;
  version: string;
  terminal_sn: string;
}

export interface ChangeSignLogin {
  type: CHANGE_SIGN_LOADING;
  loading: boolean;
}

export interface ReceiveUserinfo {
  type: RECEIVE_USERINFO;
  payload: {
    userinfo: any;
  };
}

export type SignActions = ChangeSignLogin | ReceiveUserinfo;
class Sign {

  /**
   * @todo 清空登录数据 跳转到登录页面，打开showLogin
   *
   * @static
   * @memberof Sign
   */
  static webLogout = () => async (dispatch: Dispatch) => {
    ConsoleUtil('webLogout', 'sign');
    
    /**
     * @param {RECEIVE_USERINFO} 先清空userinfo
     */
    dispatch({
      type: RECEIVE_USERINFO,
      payload: { userinfo: {} },
    });

    /**
     * @param {showLoginPage} 显示登录页面
     */
    // StatusController.showLoginPage(dispatch);
  }

  static webLogin = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('webLogin', 'login');
    const result = await SignService.webLogin(params);

    if (result.code === '10000') {
      /**
       * @param {result.biz_content} 登录成功返回数据
       */
      dispatch({
        type: RECEIVE_USERINFO,
        payload: { userinfo: result.biz_content },
      });
    } else {
      Base.toastFail(`${result.msg || '登录失败~'}`);
    }
  }

  /**
   * @todo 注册 
   *
   * @static
   * @memberof Sign
   */
  static doRegisterHandle = (params: RegisterParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('doRegisterHandle');

    dispatch({
      type: CHANGE_SIGN_LOADING,
      loading: true,
    });
  }

  /**
   * @todo 校验用户名是否唯一
   *
   * @static
   * @memberof Sign
   */
  static checkUserIdUnique = (user_id: string) => async (dispatch: Dispatch): Promise<any> => {
    ConsoleUtil('checkUserIdUnique');

    const param = { user_id };

    const result = await SignService.checkUserIdUnique(param);
    if (result.code === '10000') {
      return { success: true };
    } else {
      return { ...result };
    }
  }

  /**
   * @todo 获取用户信息
   * @param mchnt_cd 商户ID
   * 
   * @static
   * @memberof Sign
   */
  static getUserinfo = (mchnt_cd: string) => async (dispatch: Dispatch): Promise<void> => {
    ConsoleUtil('getUserinfo');

    const param = { mchnt_cd };

    const result = await SignService.getUserInfo(param);
    if (result.code === '10000') {
      dispatch({
        type: RECEIVE_USERINFO,
        payload: {
          userinfo: result.biz_content
        }
      });
    } else {
      console.log(result);
      Base.toastFail('请求用户信息失败');
    }
  }

  /**
   * @todo 用户登录
   * 
   * @static
   * @memberof Sign
   */
  static userLoginPos = (params: UserLoginPosParams) => async (dispatch: Dispatch): Promise<void> => {
    ConsoleUtil('userLoginPos');

    const result = await SignService.userLoginPos(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
      Base.toastFail('登录失败');
    }
  }
}

export default Sign;