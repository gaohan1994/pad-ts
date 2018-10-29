import { Dispatch } from 'redux';
import {
  CHANGE_STATUS_SHOW,
  CHANGE_DOCUMENT_TITLE,
  CHANGE_LOADING,
  CHANGE_TABLE_MODAL_STATUS,
  CHANGE_LOGIN_STATUS,
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

export type StatusAtions = 
  ChangeStatus | 
  ChangeDocumentTitle | 
  ChangeLoading |
  ChangeTableModalStatus |
  ChagneLoginStatus; 

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
