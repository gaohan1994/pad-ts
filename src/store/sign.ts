import config from '../common/config';
import { 
  CHANGE_SIGN_LOADING,
  RECEIVE_USERINFO,
  RECEIVE_OPERATORINFO,
} from '../action/constants';
import { SignActions } from '../action/sign';
import { Stores } from './index';

// 13101402833 abc123

export type Sign = {
  loading: boolean;
  userinfo: any;
  operatorInfo: any;
};

export const initState = {
  loading: false,
  userinfo: { 
    mchnt_cd: config.DEFAUL_MCHNT_CD,
  },
  operatorInfo: config.DEV_OPERA_INFO
};

/**
 * @todo sign 仓库
 *
 * @export
 * @param {Status} [state=initState]
 * @param {StatusAtions} action
 * @returns {Sign}
 */
export default function sign ( 
  state: Sign = initState,
  action: SignActions,
): Sign {
  switch (action.type) {

    case CHANGE_SIGN_LOADING:
      const { loading } = action;
      return {
        ...state,
        loading,
      };

    case RECEIVE_USERINFO:
      const { payload: { userinfo } } = action;
      return {
        ...state,
        userinfo
      };

    case RECEIVE_OPERATORINFO:
      const { payload: { operatorInfo } } = action;
      return {
        ...state,
        operatorInfo,
      };

    default: return state;
  }
}

export const GetUserinfo = (store: Stores) => store.sign.userinfo;

/**
 * @param {GetOperatorInfo} 获得 operatorInfo
 */
export const GetOperatorInfo = (store: Stores) => store.sign.operatorInfo;