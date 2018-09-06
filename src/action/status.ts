import { Dispatch } from 'redux';
import {
  CHANGE_STATUS_SHOW,
  CHANGE_DOCUMENT_TITLE,
} from './constants';

export interface ChangeStatus {
  type: CHANGE_STATUS_SHOW;
  show: boolean;
}

export interface ChangeDocumentTitle {
  type: CHANGE_DOCUMENT_TITLE;
  title: string;
}

export type StatusAtions = ChangeStatus | ChangeDocumentTitle;

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