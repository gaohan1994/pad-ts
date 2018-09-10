import { Dispatch } from 'redux';
import { CHANGE_SIGN_LOADING } from './constants';
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

export interface ChangeSignLogin {
  type: CHANGE_SIGN_LOADING;
  loading: boolean;
}

export type SignActions = ChangeSignLogin;
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
  static checkUserIdUnique = (userid: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('checkUserIdUnique');

    const result = await SignService.checkUserIdUnique(userid);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 获取用户信息
   * @param mchntCd 商户ID
   * 
   * @static
   * @memberof Sign
   */
  static getUserinfo = (mchntCd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getUserinfo');

    const result = await SignService.getUserInfo(mchntCd);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }
}

export default Sign;