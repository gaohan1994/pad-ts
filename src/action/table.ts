import Base from './base';
import { RECEIVE_TABLE_INFO } from './constants';
import TableService from '../service/table';
import { Dispatch } from 'redux';
import Status from './status';
import { merge } from 'lodash';
import { Stores } from '../store';
import { GetSelecetedTable } from '../store/table';
import StatusController from './status';
import BusinessController from './business';
import { GetUserinfo } from '../store/sign';
import { AnalysisStandardMoney, AnalysisStandardMoneyReturn, AnalysisStandardMoneyParam } from './order';

export interface ReceiveTableInfo {
  type: RECEIVE_TABLE_INFO;
  payload: any;
}

export type TableActions = ReceiveTableInfo;

export interface ChangeTableParams {
  table: any; 
  searchTableCallback: (param?: any) => void;
}
class TableController extends Base {

  /**
   * @todo 换桌
   *
   * @param {currentTable} 准备换成的桌号
   * @param {}
   * 
   * @static
   * @memberof TableController
   */
  static changeTable = (param: ChangeTableParams) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);
    const stateData = await state();
    const { mchnt_cd } = GetUserinfo(stateData);
    /**
     * @param {currentTable} 要换成的新桌子的数据
     * @param {preTable} 之前桌子的数据
     * @param {searchTableCallback} 成功之后更新数据
     */
    const { table: currentTable, searchTableCallback } = param;
    const preTable = GetSelecetedTable(stateData);
    const { tableOrder } = preTable;

    const analysisParam: AnalysisStandardMoneyParam = { table: currentTable, order: tableOrder };
    const { total: currentTotal, meel_fee: currentMealFee }: AnalysisStandardMoneyReturn = AnalysisStandardMoney(analysisParam);

    if (tableOrder && tableOrder.table_no) {
      const { table_no: preTableNo, people_num } = tableOrder;

      const params = {
        mchnt_cd,
        order_no: String(tableOrder.order_no),
        pre_table_no: String(preTableNo),
        table_no: String(currentTable.table_no),
        meal_fee: currentMealFee,
        is_pos: 'false',
        total: currentTotal,
        stdtrnsamt: currentTotal,
        people_num: String(people_num),
      };
      const result = await TableService.changeTable(params);

      if (result.code === '10000') {
        StatusController.hideLoading(dispatch);
        /**
         * @param {换桌成功} 
         * @param {} 1.隐藏 Modal
         * @param {} 2.保存当前数据至 selectedTable
         */
        if (searchTableCallback) {
          searchTableCallback(currentTable);
        }
      } else {
        Base.toastFail('换桌失败!');
      }
    } else {
      Base.toastFail('原桌号没有订单');
    }
  }

  /**
   * @todo 换人数
   *
   * @static
   * @memberof TableController
   */
  static changePeople = (param: any) => async (dispatch: Dispatch, state: () => Stores) => {
    StatusController.showLoading(dispatch);
    const { people } = param;
    const store = await state();
    const { mchnt_cd } = GetUserinfo(store);
    const table = GetSelecetedTable(store);
    const { tableOrder } = table;

    if (tableOrder) {
      const params = {
        mchnt_cd,
        order_no: String(tableOrder.order_no),
        pre_table_no: String(tableOrder.table_no),
        table_no: String(tableOrder.table_no),
        meal_fee: String(tableOrder.meal_fee),
        is_pos: 'false',
        total: String(tableOrder.total),
        stdtrnsamt: String(tableOrder.total),
        people_num: String(people),
      }; 
      const result = await TableService.changeTable(params);

      if (result.code === '10000') {
        StatusController.hideLoading(dispatch);
        /**
         * @param {换人成功} 
         * @param {} 1.隐藏 Modal
         * @param {} 2.保存当前数据至 selectedTable
         */
        const hideParams = {
          changePeopleModalStatus: false,
          dispatch
        };
        StatusController.changePeopleModalHandle(hideParams);

        let newTable = merge({}, table);
        newTable.tableOrder.people_num = people;

        const changeParam = {
          dispatch,
          table: newTable
        };
        BusinessController.setSelectedTable(changeParam);
      } else {
        StatusController.hideLoading(dispatch);
        Base.toastFail('换桌失败!');
      }
    } else {
      Base.toastFail('请选择要修改的桌子');
    }
  }

  /**
   * @todo 获取商户台位信息
   *
   * @static
   * @memberof TableController
   */
  static getTableInfo = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    Status.showLoading(dispatch);
    const params = { mchnt_cd };
    const result = await TableService.getTableInfo(params);
    if (result.code === '10000') {
      Status.hideLoading(dispatch);
      dispatch({
        type: RECEIVE_TABLE_INFO,
        payload: { tableinfo: result.biz_content.data }
      });
    } else {
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