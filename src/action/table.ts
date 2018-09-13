import Base from './base';
import TableService from '../service/table';
import { Dispatch } from 'redux';

class TableController extends Base {

  /**
   * @todo 获取商户台位信息
   *
   * @static
   * @memberof TableController
   */
  static getTableInfo = (mchnt_cd: string) => async (dispatch: Dispatch) => {

    const params = { mchnt_cd };
    const result = await TableService.getTableInfo(params);
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 添加台位信息
   *
   * @static
   * @memberof TableController
   */
  static addTableInfo = (params: any) => async (dispatch: Dispatch) => {
    
    const result = await TableService.addTableInfo(params);
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 编辑台位信息
   *
   * @static
   * @memberof TableController
   */
  static editTableInfo = (params: any) => async (dispatch: Dispatch) => {

    const result = await TableService.editTableInfo(params);
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 删除台位信息
   *
   * @static
   * @memberof TableController
   */
  static deleteTableInfo = (params: any) => async (dispatch: Dispatch) => {

    const result = await TableService.deleteTableInfo(params);
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 获取商户台位类型信息
   *
   * @static
   * @memberof TableController
   */
  static getTableTypeInfo = (params: any) => async (dispatch: Dispatch) => {

    const result = await TableService.getTableTypeInfo(params);
    if (result.code === '10000') {
      console.log('result: ', result);
    } else {
      console.log('result: ', result);
    }
  }
}

export default TableController;