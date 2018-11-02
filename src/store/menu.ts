
import { 
  RECEIVE_MENU_TP,
  RECEIVE_ALL_MENU,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
  SET_SELECTED_MENUTPID,
  RECEIVE_SEARCH_MENU,
  RECEIVE_ALL_DISHES,
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
  searchMenu: any;
  dishes: any[];
};

export const initState = {
  menutp: [],
  menu: [],
  menuList: {},
  selectedMenu: {},
  searchMenu: [],
  dishes: [],
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

    case RECEIVE_SEARCH_MENU:
      const { payload: { searchMenu } } = action;
      return {
        ...state,
        searchMenu,
      };

    case RECEIVE_ALL_DISHES:
      const { payload: { dishes } } = action;
      return {
        ...state,
        dishes,
      };

    default: return state;
  }
}

export const GetMenutp = (store: Stores) => store.menu.menutp;

export const GetMenu = (store: Stores) => store.menu.menu;

export const GetMenuList = (store: Stores) => store.menu.menuList;

/**
 * @todo 获取选中的 menuList
 * @param store reducer
 */
export const GetSelectedMenuList = (store: Stores) => {
  const { 
    menu: {
      selectedMenu: { menutp_id },
      menuList,
    }
  } = store;

  if (menutp_id && menuList) {
    return menuList[menutp_id] || [];
  } else {
    return [];
  }
};

/**
 * @todo 获取选中的菜单
 * @param store reducer
 */
export const GetSelectedMenu = (store: Stores) => {
  const { 
    menu: { 
      selectedMenu: { menutp_id },
      menutp,
    },
  } = store;

  if (menutp_id && menutp) {
    const selectedMenu = menutp.find(m => m.menutp_id === menutp_id);
    return selectedMenu;
  } else {
    return {};
  }
};

export const GetSearchMenu = (store: Stores) => store.menu.searchMenu;

export const GetAllDishes = (store: Stores) => store.menu.dishes;