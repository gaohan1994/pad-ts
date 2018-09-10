import { CHANGE_SIGN_LOADING } from '../action/constants';
import { SignActions } from '../action/sign';
// import { Stores } from './index';
// import config from '../common/config';
// import { merge } from 'lodash';

export type Sign = {
  loading: boolean;
};

export const initState = {
  loading: false,
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

    default: return state;
  }
}