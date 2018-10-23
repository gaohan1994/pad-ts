import MenuService from '../service/menu';
import history from '../history';
import { 
  SAVE_CHOICE_TABLEINFO, 
  SAVE_CHOICE_PEOPLE,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
  SET_SELECTED_MENUTPID,
  CHANGE_TABLE_AREA,
  RECEIVE_SELECTED_TABLE,
} from './constants';
import { Dispatch } from 'redux';
import numeral from 'numeral';
import { Stores } from '../store';
import Base from './base';

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

export type BusinessActions = 
  SaveChoiceTableinfo |
  SaveChoicePeople |
  ReceiveStoreListViewDataSource |
  SetSelectedMenu |
  ChangeTableArea | 
  ReceiveSelectedTable;

class Business {

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
    const { table: { selectedTable } } = await state();
    if (typeof selectedTable.table_no === 'number') {
      await dispatch({
        type: SAVE_CHOICE_PEOPLE,
        payload: {
          people,
        }
      });
    } else {
      Base.toastFail('请先选择桌子');
    }
  }

  /**
   * @todo store 页面请求数据函数
   * @param { mchnt_cd 商户号 }
   * @param { 第一步请求menutp 第二步请求所有菜品 第三部整合成 ListViewDataSource }
   * @memberof Business
   */
  public fetchStoreData = (mchnt_cd: string) => async (dispatch: Dispatch, state: () => Stores) => {
    const { menu: { menutp } } = await state();
    const param = { mchnt_cd };
    const menuResult = await MenuService.getAllSingleMenuNew(param);

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
  public tableClickHandle = (table: any) => async (dispatch: Dispatch) => {
    const { status } = table;

    const param = { dispatch, table };
    await this.setSelectedTable(param);

    // 如果是1 说明有订单
    if (numeral(status).value() === 1) {
      console.log('table: ', table);
    } else {
      console.log('table: ', table);
    }
  }

  /**
   * @todo 设置选中 table 
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
  }

  /**
   * ----- Table Module Over -----
   */
}

export default new Business();