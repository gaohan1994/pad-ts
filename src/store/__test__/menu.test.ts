import menu, {
  initState,
  // GetMenu,
  // GetMenuList,
  // GetMenutp,
  // GetSelectedMenu,
} from '../menu';
import { 
  RECEIVE_MENU_TP,
  RECEIVE_ALL_MENU,
  SET_SELECTED_MENUTPID,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
} from '../../action/constants';
// import { StoreState } from '../index';

describe('menu begin', () => {
  it('receive menu list', () => {
    const payload = {
      menutp: [{id: 1}]
    };
    expect(
      menu(initState, { type: RECEIVE_MENU_TP, payload, })
    ).toEqual({
      ...initState,
      menutp: [{id: 1}]
    });
  });

  it('receive all menu', () => {
    const payload = {
      menu: [{id: 2}]
    };

    expect(
      menu(initState, { type: RECEIVE_ALL_MENU, payload })
    ).toEqual({
      ...initState,
      menu: [{id: 2}]
    });
  });

  it('receive datasource ', () => {
    const payload = {
      menuList: [{id: 2}]
    };

    expect(
      menu(initState, { type: RECEIVE_STORE_LISTVIEW_DATASOURCE, payload })
    ).toEqual({
      ...initState,
      menuList: [{id: 2}]
    });
  });

  it('receive selected menu', () => {
    const payload = {
      selectedMenu: '123'
    };

    expect(
      menu(initState, { type: SET_SELECTED_MENUTPID, payload })
    ).toEqual({
      ...initState,
      selectedMenu: '123'
    });
  });
});