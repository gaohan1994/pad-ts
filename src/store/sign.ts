import { 
  CHANGE_SIGN_LOADING,
  RECEIVE_USERINFO,
} from '../action/constants';
import { SignActions } from '../action/sign';
import { Stores } from './index';

export type Sign = {
  loading: boolean;
  userinfo: any;
  mchntInfo: any;
};

export const initState = {
  loading: false,
  userinfo: {},
  mchntInfo: {},
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

    default: return state;
  }
}

export const GetUserinfo = (store: Stores) => store.sign.userinfo;

export const GetMchntInfo = (store: Stores) => store.sign.mchntInfo;