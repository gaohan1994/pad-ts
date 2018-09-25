
import { 
  RECEIVE_MENU_TP,
  RECEIVE_ALL_MENU,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
  SET_SELECTED_MENUTPID,
} from '../action/constants';
import { MenuActions } from '../action/menu';
import { BusinessActions } from '../action/business';
import { Stores } from './index';
// import config from '../common/config';
// import { merge } from 'lodash';

export type Menu = {
  menutp: any[];
  menu: any[];
  menuList: any;
  selectedMenu: any;
};

export const initState = {
  menutp: [],
  menu: [],
  menuList: {},
  selectedMenu: {},
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
  action: MenuActions | BusinessActions,
): Menu {
  switch (action.type) {

    case RECEIVE_MENU_TP:
      const { payload } = action;
      const { menutp } = payload;

      return {
        ...state,
        menutp,
      };

    case RECEIVE_ALL_MENU:
      const { payload: { menu } } = action;
      
      return {
        ...state,
        menu,
      };
    
    case RECEIVE_STORE_LISTVIEW_DATASOURCE:
      const { payload: { menuList } } = action;

      return {
        ...state,
        menuList,
      };

    case SET_SELECTED_MENUTPID:
      const { payload : { selectedMenu } } = action;
      return {
        ...state,
        selectedMenu: selectedMenu,
      };

    default: return state;
  }
}

export const GetMenutp = (store: Stores) => store.menu.menutp;

export const GetMenu = (store: Stores) => store.menu.menu;

export const GetMenuList = (store: Stores) => store.menu.menuList;

export const GetSelectedMenu = (store: Stores) => store.menu.selectedMenu;