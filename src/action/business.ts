import MenuService from '../service/menu';
import history from '../history';
import { 
  SAVE_CHOICE_TABLEINFO, 
  SAVE_CHOICE_PEOPLE,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
  SET_SELECTED_MENUTPID,
  CHANGE_TABLE_AREA,
  RECEIVE_SELECTED_TABLE,
  RECEIVE_ALL_DISHES,
} from './constants';
import config, { Navigate } from '../common/config';
import CartController, { SetCurrentCartParam } from './cart';
import { Dispatch } from 'redux';
import numeral from 'numeral';
import { Stores } from '../store';
import Base from './base';
import { GetUserinfo } from '../store/sign';
import OrderService from '../service/order';
import StatusController from './status';
import OrderController from './order';

export interface SaveChoiceTableinfo {
  type: SAVE_CHOICE_TABLEINFO;
  payload: any;
}

export interface SaveChoicePeople {
  type: SAVE_CHOICE_PEOPLE;
  payload: any;
}

export interface ReceiveStoreListViewDataSource {
  type: RECEIVE_STORE_LISTVIEW_DATASOURCE;
  payload: any;
}

export interface SetSelectedMenu {
  type: SET_SELECTED_MENUTPID;
  payload: any;
}

export interface ChangeTableArea {
  type: CHANGE_TABLE_AREA;
  payload: any;
}

export interface ReceiveSelectedTable {
  type: RECEIVE_SELECTED_TABLE;
  payload: any;
}

export interface ReceiveAllDishes {
  type: RECEIVE_ALL_DISHES;
  payload: any;
}

export type BusinessActions = 
  SaveChoiceTableinfo |
  SaveChoicePeople |
  ReceiveStoreListViewDataSource |
  SetSelectedMenu |
  ChangeTableArea | 
  ReceiveSelectedTable |
  ReceiveAllDishes;

class Business {

  /**
   * ----- Menus Business -----
   * @todo 切换堂食 外卖 订单
   * @param {this.setSelectedTable} 先重置选中桌子
   * @param {setCurrentCart} 重置 currentCart 至外卖ID，table页面手动处理不显示外卖ID的购物车
   */
  public changeModuleHandle = (type: string) => async (dispatch: Dispatch, state: () => Stores) => {
    const { mchnt_cd } = GetUserinfo(await state());
    let route: string = '';

    await this.setSelectedTable({
      dispatch,
      table: { table_no: config.TAKEAWAYCARTID },
    });

    /**
     * @param {recoverPayOrder} 切换模块的时候重置 payOrder
     * @param {setCurrentDish} 重置currentDish
     */
    await OrderController.recoverPayOrder(dispatch);
    await StatusController.hidePay(dispatch);
    await CartController.setCurrentDish({dispatch, currentDish: {}});

    switch (type) {
      case 'meal':
        route = `/table/${mchnt_cd}`;
        break;
      
      /**
       * @param { store 是外卖 1.先重置 currentCartId 2.跳转到 外卖页面 }
       */
      case 'store':
        const param: SetCurrentCartParam = { dispatch, currentCartId: config.TAKEAWAYCARTID };
        await CartController.setCurrentCart(param);
        route = `/store/${mchnt_cd}`;
        break;
      case 'order':
        route = `/orderlist`;
        break;
      default:
        break;
    }
    Navigate.navto(route);
  }

  /**
   * @todo 保存用户选择的桌号到 redux 
   * @param { table 保存到redux的table信息 保存之后跳转到people }
   *
   * @memberof Business
   */
  public saveChoiceTable = (table: any) => async (dispatch: Dispatch) => {
    await dispatch({
      type: SAVE_CHOICE_TABLEINFO,
      payload: {
        table,
      }
    });

    history.push('/people');
  }

  /**
   * @todo 保存用户选择人数
   * @param { people 用户选择的人数 }
   *
   * @memberof Business
   */
  public saveChoicePeople = (people: any) => async (dispatch: Dispatch, state: () => Stores) => {
    const { mchnt_cd } = GetUserinfo(await state());
    await dispatch({
      type: SAVE_CHOICE_PEOPLE,
      payload: {
        people,
      }
    });

    Navigate.navto(`/store/${mchnt_cd}`);
  }

  /**
   * @todo store 页面请求数据函数
   * @param { mchnt_cd 商户号 }
   * @param { 第一步请求menutp 第二步请求所有菜品 第三部整合成 ListViewDataSource }
   * @memberof Business
   */
  public fetchStoreData = (mchnt_cd: string) => async (dispatch: Dispatch, state: () => Stores) => {
    const { menu: { menutp } } = await state();
    const param = { mchnt_cd, num: '0', serial: '0' };
    const menuResult = await MenuService.getAllSingleMenuNew(param);

    /**
     * @param {dishes} 全部菜品存入，search 用
     */
    dispatch({
      type: RECEIVE_ALL_DISHES,
      payload: { dishes: menuResult.biz_content.data }
    });
    if (menuResult.code === '10000') {
      const menu = menuResult.biz_content.data;
      const menuList: {} = {};

      /**
       * @param { tp 每一个菜单 先把数据做成 => { 'id': [] } }
       */
      menutp.forEach((tp: any) => {
        if (tp.menutp_id) {
          menuList[tp.menutp_id] = [];
        }
      });
      /**
       * @param { item 每一个菜品 把数据做成 => { 'id': [ {}, {}, {} ] } }
       */
      menu.forEach((item: any) => {
        menuList[item.menutp_id].push(item);
      });
      
      const selectedMenu = { menutp_id: menutp[0].menutp_id };
      dispatch({
        type: SET_SELECTED_MENUTPID,
        payload: { selectedMenu },
      });
      
      dispatch({
        type: RECEIVE_STORE_LISTVIEW_DATASOURCE,
        payload: { menuList }
      });
      
    } else {
      Base.toastFail('请求数据出错');
    }
  }

  /**
   * @todo 设置选中菜单
   * @param { menutpId string 选中的 menutpid }
   *
   * @memberof Business
   */
  public setSelectedMenutp = (menutp_id: any) => async (dispatch: Dispatch) => {
    const selectedMenu = { menutp_id };
    dispatch({
      type: SET_SELECTED_MENUTPID,
      payload: { selectedMenu }
    });
  }

  /**
   * 
   * ----- Table Module -----
   * 
   * @todo 切换桌子区域
   * @param { 1.切换区域 }
   * @param { 2.this.setSelectedTable 切换区域重置 selected Table }
   * @param { 3.请求对应区域所有桌子的订单状态 | 必查因为订单状态可能改变 }
   *
   * @memberof Business
   */
  public changeTableArea = (area: any) => async (dispatch: Dispatch) => {
    const { area_id } = area;

    await this.setSelectedTable({
      dispatch,
      table: {},
    });

    dispatch({
      type: CHANGE_TABLE_AREA,
      payload: { selectedAreaId: area_id },
    });
  }

  /**
   * @todo 点击桌子触发 action
   * @param { table 根据 table status 进行不同的处理 }
   *
   * @memberof Business
   */
  public tableClickHandle = (table: any) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);

    const { mchnt_cd } = GetUserinfo(await state());

    const tableParam = {
      mchnt_cd,
      table_no: table.table_no
    };
    /** 
     * @param {1.先请求该桌子的订单信息}
     * @param {2.根据是否存在订单，如果存在订单把订单数据加到table信息中并存入redux，如果不存在只存入table信息}
     * @param {3.选择到对应table_no的cart list 在setSelectedTable中完成}
     */ 
    const result = await OrderService.orderQueryByTable(tableParam);

    StatusController.hideLoading(dispatch);
    
    if (result.code === '10000') {
      let param: any = { dispatch, table };

      if (numeral(result.biz_content.table_status).value() === 1) {
        param = {
          ...param,
          table: {
            ...table,
            tableOrder: result.biz_content
          }
        };    
        this.setSelectedTable(param); // step 2
      } else if (numeral(result.biz_content.table_status).value() === 0) {    
        this.setSelectedTable(param); // step 2
      } else {
        Base.toastFail('请联系管理员查看该桌子信息');
      }
    } else {
      Base.toastFail('请求接口错误');
    }
  }

  /**
   * @todo 1.设置选中 table  2.设置选中 cart 
   * @param { param: { dispatch, table: any } }
   *
   * @memberof Business
   */
  public setSelectedTable = async (param: any) => {
    const { dispatch, table } = param;

    dispatch({
      type: RECEIVE_SELECTED_TABLE,
      payload: { selectedTable: table },
    });

    const setCurrentCartParam: SetCurrentCartParam = {
      dispatch,
      currentCartId: table.table_no,
    };
    CartController.setCurrentCart(setCurrentCartParam); // step 3
  }

  /**
   * ----- Table Module Over -----
   */
}

export default new Business();