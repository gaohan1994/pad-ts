/**
 * @todo -------- 订单管理模块 --------
 * 
 * created by Ghan 9.7
 */
import request, { payRequest } from '../common/request';

class OrderService {

  static checkOrderStatus = async (params: any): Promise<any> => {
    return payRequest(
      '',
      'post',
      {
        method: 'order.query_pay',
        biz_content: {
          ...params
        }
      }
    );
  }

  /**
   * @param 获取支付链接
   */
  static payOrder = async (params: any): Promise<any> => {
    return payRequest(
      '',
      'post',
      {
        method: 'order.pay',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 获取取餐号
   *
   * @static
   * @memberof MenuService
   */
  static getCalledNumber = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.get_called_num',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 下单接口 v2
   *
   * @static
   * @memberof MenuService
   */
  static sendOrderV2 = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.send_order_v2',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 加退菜
   *
   * @static
   * @memberof MenuService
   */
  static manageMenu = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.add_menu',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 通过桌号查询订单信息
   *
   * @static
   * @memberof OrderService
   */
  static orderQueryByTable = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_query_by_table',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 上报订单信息
   *
   * @static
   * @memberof OrderService
   */
  static sendOrder = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.send_order',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 更新订单及详情信息
   *
   * @static
   * @memberof OrderService
   */
  static updateOrderDetail = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_and_detail_update',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 更新订单信息
   *
   * @static
   * @memberof OrderService
   */
  static updateOrder = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_update',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 订单交易结果
   *
   * @static
   * @memberof OrderService
   */
  static orderConfirm = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_confirm',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 取消订单
   *
   * @static
   * @memberof OrderService
   */
  static cancelOrder = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_cancel',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 关闭订单
   *
   * @static
   * @memberof OrderService
   */
  static closeOrder = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_close',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 订单查询(模糊匹配)
   *
   * @static
   * @memberof OrderService
   */
  static searchOrder = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_search',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 订单列表查询
   *
   * @static
   * @memberof OrderService
   */
  static orderQuery = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_query_v2',
        biz_content: {
          ...params,
        }
      }
    );
  }

  /**
   * @todo 订单详情查询(精确)
   *
   * @static
   * @memberof OrderService
   */
  static orderDetailSearch = async (params: any): Promise<any> => {
    return request(
      '',
      'post',
      {
        method: 'trade.order_detail_search',
        biz_content: {
          ...params,
        }
      }
    );
  }
  
}

export default OrderService;