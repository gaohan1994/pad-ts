import { Dispatch } from 'redux';
import {
  CHANGE_STATUS_SHOW,
  CHANGE_DOCUMENT_TITLE,
  CHANGE_LOADING,
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

export type StatusAtions = ChangeStatus | ChangeDocumentTitle | ChangeLoading;

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
}

export default new Status();
