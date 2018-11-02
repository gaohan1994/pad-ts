import { 
  CHANGE_DOCUMENT_TITLE, 
  CHANGE_LOADING, 
  CHANGE_TABLE_MODAL_STATUS,
  CHANGE_LOGIN_STATUS,
  CHANGE_SEARCH_STATUS,
  CHANGE_PAY_STATUS,
  CHANGE_PEOPLE_MODAL_STATUS,
} from '../action/constants';
import { StatusAtions } from '../action/status';
import { Stores } from './index';
import config from '../common/config';
import { merge } from 'lodash';

export type Status = {
    show: boolean;
    title: string;
    loading: boolean;
    changeTableModalStatus: boolean;
    changePeopleModalStatus: boolean;
    showLogin: boolean;
    showSearch: boolean;
    showPay: boolean;
};

export const initState = {
    show: false,
    title: config.DEFAULT_DOCUMENT_TITLE,
    loading: false,
    changeTableModalStatus: false,
    changePeopleModalStatus: false,
    showLogin: false,
    showSearch: false,
    showPay: false,
};

/**
 * status 仓库
 *
 * @export
 * @param {Status} [state=initState]
 * @param {*} action
 * @returns {Status}
 */
export default function status ( state: Status = initState,  action: StatusAtions ): Status {
  switch (action.type) {

    case CHANGE_DOCUMENT_TITLE:
      const { title } = action;
      state.title = title;
      return merge({}, state, {});

    case CHANGE_LOADING:
      const { loading } = action;
      state.loading = loading;
      return merge({}, state, {});

    case CHANGE_TABLE_MODAL_STATUS:
      const { payload: { changeTableModalStatus } } = action;
      return {
        ...state,
        changeTableModalStatus,
      };

    case CHANGE_LOGIN_STATUS:
      const { payload: { showLogin } } = action;
      return {
        ...state,
        showLogin,
      };
    
    case CHANGE_SEARCH_STATUS:
      const { payload: { showSearch } } = action;
      return {
        ...state,
        showSearch,
      };

    case CHANGE_PAY_STATUS:
      const { payload: { showPay } } = action;
      return {
        ...state,
        showPay,
      };

    case CHANGE_PEOPLE_MODAL_STATUS:
      const { payload: { changePeopleModalStatus } } = action;
      return {
        ...state,
        changePeopleModalStatus
      };
    
    default: return state;
  }
}

export const getStatus = (store: Stores) => store.status.show;

export const getDocumentTitle = (store: Stores) => store.status.title;

export const GetLoading = (state: Stores) => state.status.loading;

export const GetChangeTableModalStatus = (state: Stores) => state.status.changeTableModalStatus;

export const GetShowLogin = (state: Stores) => state.status.showLogin;

export const GetSearchStatus = (state: Stores) => state.status.showSearch;

export const GetShowPay = (state: Stores) => state.status.showPay;

export const GetChangePeopleModalStatus = (state: Stores) => state.status.changePeopleModalStatus;