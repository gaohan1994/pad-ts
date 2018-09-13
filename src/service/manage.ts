/**
 * @todo -------- 终端管理模块 --------
 * 
 * created by Ghan 9.7
 */
import request from '../common/request';
class ManageService {

  /**
   * @todo 获取终端信息
   *
   * @static
   * @memberof ManageService
   */
  static getTermlist = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.get_termlist',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 新绑定终端
   *
   * @static
   * @memberof ManageService
   */
  static bindTerm = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.bind_term',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 编辑终端信息
   *
   * @static
   * @memberof ManageService
   */
  static editTerm = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.edit_term',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 删除终端信息
   *
   * @static
   * @memberof ManageService
   */
  static deleteTerm = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.delete_term',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 终端参数下载
   *
   * @static
   * @memberof ManageService
   */
  static paramsDownload = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.params_download',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 编辑（新增）参数
   *
   * @static
   * @memberof ManageService
   */
  static editParams = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.edit_param',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取参数
   *
   * @static
   * @memberof ManageService
   */
  static getParam = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.get_param',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 删除参数
   *
   * @static
   * @memberof ManageService
   */
  static deleteParam = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'manage.delete_param',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default ManageService;