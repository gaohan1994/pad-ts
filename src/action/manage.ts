import { Dispatch } from 'redux';
import { ConsoleUtil } from '../common/request';
import ManageService from '../service/manage';

class ManageController {

  /**
   * @todo 获取终端列表
   *
   * @param mchnt_cd 商户号
   * @static
   * @memberof ManageController
   */
  static getTermlist = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getTermlist');

    const params = { mchnt_cd };
    const result = await ManageService.getTermlist(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 绑定新终端
   *
   * @static
   * @memberof ManageController
   */
  static bindTerm = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('bindTerm');

    const result = await ManageService.bindTerm(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 编辑终端信息
   *
   * @static
   * @memberof ManageController
   */
  static editTerm = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('editTerm');
    
    const result = await ManageService.editTerm(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo  删除终端信息
   *
   * @static
   * @memberof ManageController
   */
  static deleteTerm = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('deleteTerm');
    
    const result = await ManageService.deleteTerm(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo  终端参数下载
   *
   * @static
   * @memberof ManageController
   */
  static termParamsDownload = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('termParamsDownload');
    
    const result = await ManageService.paramsDownload(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo  编辑 新增 参数
   *
   * @static
   * @memberof ManageController
   */
  static termEditParams = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('termEditParams');
    
    const result = await ManageService.editParams(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo  获取参数
   *
   * @static
   * @memberof ManageController
   */
  static termGetParam = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('termGetParam');
    
    const result = await ManageService.getParam(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }

  /**
   * @todo 删除参数
   *
   * @static
   * @memberof ManageController
   */
  static termDeleteParam = (params: any) => async (dispatch: Dispatch) => {
    ConsoleUtil('termDeleteParam');
    
    const result = await ManageService.deleteParam(params);
    if (result.code === '10000') {
      console.log('result', result);
    } else {
      console.log('result: ', result);
    }
  }
}

export default ManageController;