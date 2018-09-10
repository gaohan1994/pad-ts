import { Dispatch } from 'redux';
// import { CHANGE_SIGN_LOADING } from './constants';
import { ConsoleUtil } from '../common/request';
import CommmandService from '../service/command';

/**
 * @param func 功能名
 * @param user_id 
 * @param user_name 
 * @param time 
 * @param exc_time 赶超时间
 * @param target 目标
 * @param type 
 * @param timer 
 * @param source 来源
 * @param param 
 * @param status 
 * @param remarks
 * @export
 * @interface AddCommandInfoParams
 */
export interface AddCommandInfoParams {
  func: string;
  user_id: string;
  user_name: string;
  time: string;
  exc_time: string;
  target: string;
  type: string;
  timer: string;
  source: string;
  param: string;
  status: string;
  remarks: string;
}

class CommmandController {
  /**
   * @todo 添加命令
   *
   * @static
   * @memberof CommmandController
   */
  static addCommandInfo = (params: AddCommandInfoParams) => async (dispatch: Dispatch) => {
    ConsoleUtil('addCommandInfo');

    const result = await CommmandService.addCommandInfo(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }

  /**
   * @todo 根据target获取命令
   *
   * @static
   * @memberof CommmandController
   */
  static getCommandInfByTarget = (target: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getCommandInfByTarget');

    const result = await CommmandService.getCommandInfByTarget(target);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }
}

export default CommmandController;