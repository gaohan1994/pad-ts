/**
 * @todo -------- 报表管理模块 --------
 * 
 * created by Ghan 9.7
 */

import request from '../common/request';

class ReportService {

  /**
   * @todo 历史菜单类型销量查询
   *
   * @static
   * @memberof ReportService
   */
  static getSalesHistory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'report.get_sales_history',
        biz_content: {
          ...params,
        }
      }
    );
  }
 
  /**
   * @todo 历史总销量查询
   *
   * @static
   * @memberof ReportService
   */
  static getTotalSalesHistory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'report.get_total_sales_history',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 历史营业额查询
   *
   * @static
   * @memberof ReportService
   */
  static getTurnoverHistory = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'report.get_turnover_history',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 当日营业额汇总
   *
   * @static
   * @memberof ReportService
   */
  static getCurrentTurnover = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.get_current_turnover',
        biz_content: {
          ...params,
        }
      }
    );
  }
}

export default ReportService;