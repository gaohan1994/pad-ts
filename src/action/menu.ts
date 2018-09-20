
import { Dispatch } from 'redux';
import { 
  RECEIVE_MENU_TP,
  RECEIVE_ALL_MENU,
} from './constants';
import { ConsoleUtil } from '../common/request';
import MenuService from '../service/menu';
import { Stores } from '../store/index';
import Base from './base';
export interface GetMenuByIdParam {
  mchntCd: string;
  menutpId: string;
  num?: number; // 不传则返回全部记录
  serial?: number; // 不传则返回全部记录
}

export interface ChangeInventoryParam {
  total: number;
  data: {product_id: string; inventory: number}[];
}

export interface EditPriceAndInventoryParam {
  product_id: string;
  menutp_id: string;
  price: string;
  inventory: string;
}

export interface ReceiveMenuTp {
  type: RECEIVE_MENU_TP;
  payload: any;
}

export interface ReceiveAllMenu {
  type: RECEIVE_ALL_MENU;
  payload: any;
}

export type MenuActions = ReceiveMenuTp | ReceiveAllMenu;

class MenuController extends Base {
  /**
   * @todo 获取所有menuTp
   * @param { mchnt_cd 商户id }
   *
   * @static
   * @memberof MenuController
   */
  static getMenuTp = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getMenuTp');

    const params = { mchnt_cd };
    const result = await MenuService.getMenuTp(params);
    console.log('result: ', result);

    /**
     * @param { result 把 result 中 menutp_num = 0 的项删除 }
     */
    if (result.code === '10000') {

      const filterMenutp: any[] = [];

      result.biz_content.data.forEach((tp: any) => {
        if (tp.menutp_num > 0) {
          filterMenutp.push(tp);
        }
      });

      dispatch({
        type: RECEIVE_MENU_TP,
        payload: { menutp: filterMenutp }
      });
    } else {
      console.log(result);
      Base.toastFail('请求出错', 2);
    }
  }

  /**
   * @todo 删除菜单类别
   * @param menutp_id 菜单ID
   * 
   * 1.传入商户号和要删除的菜单号
   * 2.请求所有菜单类别
   * 3.如果要删除的菜单号内还有菜品则不允许删除
   * @static
   * @memberof MenuController
   */
  static deleteMenuTp = (menutp_id: string) => async (dispatch: Dispatch, state: () => Stores) => {
    ConsoleUtil('deleteMenuTp');

    const { menu: { menutp } } = await state();
    const params = { menutp_id };
    const index = menutp.findIndex(menu => menu.menutp_id === menutp_id);

    if (index !== -1) {
      if (menutp[index].menutp_name === 0) {
        const result = await MenuService.deleteMenuTp(params);
        if (result.code === '10000') {
          console.log(result);
          Base.toastInfo('删除成功', 2);
        } else {
          console.log(result);
          Base.toastFail('删除失败');
        }
      } else {
        Base.toastFail('该菜单下还有菜品');
      }
    } else {
      Base.toastFail('删除失败');
    }
  }

  /**
   * @todo 获取单品菜单类型
   * @param mchntCd 商户号
   *
   * @static
   * @memberof MenuController
   */
  static getSingleMenuTp = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getSingleMenuTp');

    const parmas = { mchnt_cd };
    const result = await MenuService.getSingleMenuTp(parmas);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 获取单品菜单类型
   * @interface GetMenuByIdParam 
   *
   * @static
   * @memberof MenuController
   */
  static getMenuById = (params: GetMenuByIdParam) => async (dispatch: Dispatch) => {
    ConsoleUtil('getMenuById');

    const result = await MenuService.getMenuById(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 修改库存
   * @type ChangeInventoryParam
   *
   * @static
   * @memberof MenuController
   */
  static changeInventory = (params: ChangeInventoryParam) => async (dispatch: Dispatch) => {
    ConsoleUtil('changeInventory');

    const result = await MenuService.changeInventory(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 编辑价格和库存
   * @type EditPriceAndInventoryParam
   *
   * @static
   * @memberof MenuController
   */
  static editPriceAndInventory = (params: EditPriceAndInventoryParam) => async (dispatch: Dispatch) => {
    ConsoleUtil('editPriceAndInventory');

    const result = await MenuService.editPriceAndInventory(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 获取促销信息
   * @param mchnt_cd string
   *
   * @static
   * @memberof MenuController
   */
  static getPromotion = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getPromotion');

    const params = { mchnt_cd };
    const result = await MenuService.getPromotion(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 获取所有信息 新
   * @param mchnt_cd string
   *
   * @static
   * @memberof MenuController
   */
  static getAllSingleMenuNew = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getPromotion');

    const params = { mchnt_cd };

    const result = await MenuService.getAllSingleMenuNew(params);
    if (result.code === '10000') {
      console.log(result);
      dispatch({
        type: RECEIVE_ALL_MENU,
        payload: {
          menu: result.biz_content.data
        }
      });
    } else {
      console.log(result);
      Base.toastFail('请求菜单错误');
    }
  }
  
}

export default MenuController;