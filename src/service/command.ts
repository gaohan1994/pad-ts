
/**
 * @todo -------- 命令管理模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';

class CommandService {

  /**
   * @todo 添加命令
   *
   * @static
   * @memberof CommandService
   */
  static addCommandInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'command.add_command_Info',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo  根据target获取命令
   *
   * @static
   * @memberof CommandService
   */
  static getCommandInfByTarget = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'command.get_commandInf_by_target',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default CommandService;