import Base from './base';
import { Dispatch } from 'redux';
import { 
  CHANGE_SIGN_LOADING,
  RECEIVE_USERINFO,
} from './constants';
import { ConsoleUtil } from '../common/request';
import SignService from '../service/sign';
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
   * @todo 注册 
   *
   * @static
   * @memberof Sign
   */
  static doRegisterHandle = (params: RegisterParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('doRegisterHandle');
    //  const result = await SignService.registerUser(params);
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