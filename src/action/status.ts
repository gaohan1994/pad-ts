import { Dispatch } from 'redux';
import {
  CHANGE_STATUS_SHOW,
  CHANGE_DOCUMENT_TITLE,
  CHANGE_LOADING,
  CHANGE_TABLE_MODAL_STATUS,
  CHANGE_LOGIN_STATUS,
  CHANGE_SEARCH_STATUS,
  CHANGE_PAY_STATUS,
  CHANGE_PEOPLE_MODAL_STATUS,
} from './constants';

export interface ChangeStatus {
  type: CHANGE_STATUS_SHOW;
  show: boolean;
}

export interface ChangeDocumentTitle {
  type: CHANGE_DOCUMENT_TITLE;
  title: string;
}

export interface ChangeLoading {
  type: CHANGE_LOADING;
  loading: boolean;
}

export interface ChangeTableModalStatus {
  type: CHANGE_TABLE_MODAL_STATUS;
  payload: any;
}

export interface ChagneLoginStatus {
  type: CHANGE_LOGIN_STATUS;
  payload: any;
}

export interface ShowSearch {
  type: CHANGE_SEARCH_STATUS;
  payload: any;
}

export interface HideSearch {
  type: CHANGE_SEARCH_STATUS;
  payload: any;
}

export interface ShowPay {
  type: CHANGE_PAY_STATUS;
  payload: any;
}

export interface HidePay {
  type: CHANGE_PAY_STATUS;
  payload: any;
}

export interface ChangePeopleModalStatus {
  type: CHANGE_PEOPLE_MODAL_STATUS;
  payload: any;
}

export type StatusAtions = 
  ChangeStatus | 
  ChangeDocumentTitle | 
  ChangeLoading |
  ChangeTableModalStatus |
  ChagneLoginStatus |
  ShowSearch |
  HideSearch |
  ShowPay |
  HidePay | 
  ChangePeopleModalStatus; 

export const changeStatus = () => (dispatch: Dispatch) => {
  dispatch({
    type: CHANGE_STATUS_SHOW,
    show: true,
  });
};

export const changeDocumentTitle = (title: string) => (dispatch: Dispatch) => {
  dispatch({
    type: CHANGE_DOCUMENT_TITLE,
    title: title
  });
};

class Status {

  public changePeopleModalHandle = (params: any) => {
    const { changePeopleModalStatus, dispatch } = params;
    dispatch({
      type: CHANGE_PEOPLE_MODAL_STATUS,
      payload: { changePeopleModalStatus }
    });
  }

  /**
   * @todo 显示 pay page
   *
   * @memberof Status
   */
  public showPay = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_PAY_STATUS,
      payload: { showPay: true }
    });
  }

  /**
   * @todo 隐藏 pay page
   *
   * @memberof Status
   */
  public hidePay = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_PAY_STATUS,
      payload: { showPay: false }
    });
  }

  /**
   * @todo show global search
   *
   * @memberof Status
   */
  public showSearch = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_SEARCH_STATUS,
      payload: { showSearch: true }
    });
  }

  /**
   * @todo hide global search
   *
   * @memberof Status
   */
  public hideSearch = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_SEARCH_STATUS,
      payload: { showSearch: false }
    });
  }

  /**
   * @todo show global loading
   *
   * @memberof Status
   */
  public showLoading = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_LOADING,
      loading: true,
    });
  }

  /**
   * @todo hide global loading
   *
   * @memberof Status
   */
  public hideLoading = async (dispatch: Dispatch) => {
    dispatch({
      type: CHANGE_LOADING,
      loading: false,
    });
  }

  public changeTableModalStatus = (param: any) => async (dispatch: Dispatch) => {
    const { changeTableModalStatus } = param;

    dispatch({
      type: CHANGE_TABLE_MODAL_STATUS,
      payload: { changeTableModalStatus }
    });
  }

  /**
   * @todo 修改login 页面状态
   *
   * @memberof Status
   */
  public changeLoginStatus = async (param: any) => {
    const { dispatch, showLogin } = param;

    dispatch({
      type: CHANGE_LOGIN_STATUS,
      payload: { showLogin }
    });
  }

  public hideLoginPage = (dispatch: Dispatch) => {
    this.changeLoginStatus({ dispatch, showLogin: false });
  }

  public showLoginPage = (dispatch: Dispatch) => {
    this.changeLoginStatus({ dispatch, showLogin: true });
  }
}

export default new Status();
