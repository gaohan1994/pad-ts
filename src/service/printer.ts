/**
 * @todo -------- 打印机管理模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';

class PrinterService {

  /**
   * @todo 获取打印机与厨部的映射关系
   *
   * @static
   * @memberof PrinterService
   */
  static getPrinterInfo = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'printer.get_printer_Info',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default PrinterService;