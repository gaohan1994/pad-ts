/**
 * @todo -------- 菜单管理模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';

class MenuService {

  /**
   * @todo 获取所有菜单类型
   *
   * @static
   * @memberof MenuService
   */
  static getMenuTp = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_menutp',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 删除菜单类别 --- 菜单下还有菜品，则不允许删除类别 ---
   *
   * @static
   * @memberof MenuService
   */
  static deleteMenuTp = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.delete_menutp',
        biz_content: {
          ...params,
        }
      }
    );
  }
  
  /**
   * @todo 获取单品菜单类型
   *
   * @static
   * @memberof MenuService
   */
  static getSingleMenuTp = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_single_menutp',
        biz_content: {
          ...params,
        }
      }
    );
  } 

  /**
   * @todo 获取单品详情（根据菜单类型）
   *
   * @static
   * @memberof MenuService
   */
  static getMenuById = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_menu',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 删除单品（批量）
   *
   * @static
   * @memberof MenuService
   */
  static deleteProduct = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.delete_product',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 更改商品库存（批量）
   *
   * @static
   * @memberof MenuService
   */
  static changeInventory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.change_inventory',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 修改商品价格及库存
   *
   * @static
   * @memberof MenuService
   */
  static editPriceAndInventory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.edit_price_inventory',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取促销信息
   *
   * @static
   * @memberof MenuService
   */
  static getPromotion = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_promotion',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取所有单品详情（离线）
   *
   * @static
   * @memberof MenuService
   */
  static getAllSingleMenu = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_all_single_menu',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取所有菜品属性类型(离线)
   *
   * @static
   * @memberof MenuService
   */
  static getAllProductAttrType = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_product_attr_type',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取所有菜品属性值(离线)
   *
   * @static
   * @memberof MenuService
   */
  static getAllProductAttrInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_product_attr_inf',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取所有商品库存
   *
   * @static
   * @memberof MenuService
   */
  static getAllInventory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_all_inventory',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 根据商品ID查询信息
   *
   * @static
   * @memberof MenuService
   */
  static getDataById = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_data_by_id',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取所有单品详情（新）（离线）
   *
   * @static
   * @memberof MenuService
   */
  static getAllSingleMenuNew = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'menu.get_all_single_menu_new',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default MenuService;