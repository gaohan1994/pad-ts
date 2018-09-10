import { Dispatch } from 'redux';
// import { CHANGE_SIGN_LOADING } from './constants';
import { ConsoleUtil } from '../common/request';
import MenuService from '../service/menu';

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

class MenuController {
  /**
   * @todo 获取所有menuTp
   *
   * @static
   * @memberof MenuController
   */
  static getMenuTp = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('getMenuTp');
    const result = await MenuService.getMenuTp(params);

    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 删除菜单类别
   * @param menuTpId 菜单ID
   *
   * @static
   * @memberof MenuController
   */
  static deleteMenuTp = (menuTpId: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('deleteMenuTp');

    const result = await MenuService.deleteMenuTp(menuTpId);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 获取单品菜单类型
   * @param mchntCd 商户号
   *
   * @static
   * @memberof MenuController
   */
  static getSingleMenuTp = (mchntCd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getSingleMenuTp');

    const result = await MenuService.getSingleMenuTp(mchntCd);
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

    const result = await MenuService.getPromotion(mchnt_cd);
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

    const result = await MenuService.getAllSingleMenuNew(mchnt_cd);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }
  
}

export default MenuController;