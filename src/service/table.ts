/**
 * @todo -------- 台位信息管理模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';

class TableService {

  /**
   * @todo 获取商户的台位信息
   *
   * @static
   * @memberof TableService
   */
  static getTableInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'table.get_table_info',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 商户添加台位信息
   *
   * @static
   * @memberof TableService
   */
  static addTableInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'table.add_table_info',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 商户编辑台位信息
   *
   * @static
   * @memberof TableService
   */
  static editTableInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'table.edit_table_info',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 商户删除台位信息
   *
   * @static
   * @memberof TableService
   */
  static deleteTableInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'table.delete_table_info',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取商户台位类型信息
   *
   * @static
   * @memberof TableService
   */
  static getTableTypeInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'table.get_table_type_info',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default TableService;