import { CHANGE_DOCUMENT_TITLE, CHANGE_LOADING } from '../action/constants';
import { StatusAtions } from '../action/status';
import { Stores } from './index';
import config from '../common/config';
import { merge } from 'lodash';

export type Status = {
    show: boolean;
    title: string;
    loading: boolean;
};

export const initState = {
    show: false,
    title: config.DEFAULT_DOCUMENT_TITLE,
    loading: false,
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
    default: return state;
  }
}

export const getStatus = (store: Stores) => store.status.show;

export const getDocumentTitle = (store: Stores) => store.status.title;

export const GetLoading = (state: Stores) => state.status.loading;