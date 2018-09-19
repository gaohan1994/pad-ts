import Base from './base';
import { RECEIVE_TABLE_INFO } from './constants';
import TableService from '../service/table';
import { Dispatch } from 'redux';

export interface ReceiveTableInfo {
  type: RECEIVE_TABLE_INFO;
  payload: any;
}

export type TableActions = ReceiveTableInfo;
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
      dispatch({
        type: RECEIVE_TABLE_INFO,
        payload: { tableinfo: result.biz_content.data }
      });
    } else {
      console.log('result: ', result);
      Base.toastFail('请求桌号信息失败');
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