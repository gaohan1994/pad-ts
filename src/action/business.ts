import MenuService from '../service/menu';
import history from '../history';
import { 
  SAVE_CHOICE_TABLEINFO, 
  SAVE_CHOICE_PEOPLE,
  RECEIVE_STORE_LISTVIEW_DATASOURCE,
} from './constants';
import { Dispatch } from 'redux';
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

export type BusinessActions = SaveChoiceTableinfo | SaveChoicePeople | ReceiveStoreListViewDataSource;

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
    
    console.log('people: ', people);
    await dispatch({
      type: SAVE_CHOICE_PEOPLE,
      payload: {
        people,
      }
    });

    const { sign: { userinfo: { mchnt_cd } } } = await state();

    history.push(`/store/${mchnt_cd}`);
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

      console.log('menuList: ', menuList);

      dispatch({
        type: RECEIVE_STORE_LISTVIEW_DATASOURCE,
        payload: { menuList }
      });
      
    } else {
      Base.toastFail('请求数据出错');
    }
  }
}

export default new Business();