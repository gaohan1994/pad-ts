import { RECEIVE_MENU_TP } from '../action/constants';
import { MenuActions } from '../action/menu';
import { Stores } from './index';
// import config from '../common/config';
// import { merge } from 'lodash';

export type Menu = {
  menutp: any[];
};

export const initState = {
  menutp: []
};

/**
 * menu 仓库 
 *
 * @export
 * @param {Menu} [state=initState]
 * @param {MenuActions} action
 * @returns {Menu}
 */
export default function menu ( 
  state: Menu = initState,
  action: MenuActions,
): Menu {
  switch (action.type) {

    case RECEIVE_MENU_TP:
      const { payload } = action;
      const { menutp } = payload;

      return {
        ...state,
        menutp,
      };

    default: return state;
  }
}

export const menutp = (store: Stores) => store.menu.menutp;