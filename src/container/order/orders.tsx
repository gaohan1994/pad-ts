import React, { Component } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
// import Menus from 'src/component/Menus';

// import styles from './style.less';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps } from '../../common/config';
import OrderController, { OrderQueryParams } from '../../action/order';
import { Stores } from '../../store/index';
import numeral from 'numeral';
// import Base from '../../action/base';
import {
  GetOrders,
  GetOrderLoading,
} from '../../store/order';
// import history from '../../history';

/**
 * @param { orderQuery: fetch order list function } 
 * @param { orders: orders in redux } 
 * @param { loading: fetch function loading status }
 *
 * @interface OrdersProps
 */
interface OrdersProps {
  orderQuery: (parmas: OrderQueryParams) => void;
  orders: any;
  loading: boolean;
}

interface OrdersState {
  currentPage: number;
}
/**
 * @param { currentPage: number 当前页码 }
 * @param { ORDERSPAGESIZE: number 每页数量 default as 20 }
 */
let currentPage: number = 1;
class OrderList extends Component<OrdersProps, OrdersState> {

  componentDidMount() {
    this.fetchOrderList();
  }

  /**
   * @todo 获取订单列表
   *
   * @memberof OrderList
   */
  public fetchOrderList = () => {
    const { orderQuery } = this.props;

    const params = {
      mchnt_cd: config.DEFAUL_MCHNT_CD,
      currentPage: `${currentPage}`,
      pageSize: `${config.DEFAULT_PAGE_SIZE}`,
    };
    orderQuery(params);
  }

  /**
   * @todo 当翻页等时间变化的时候的回调函数
   *
   * @memberof OrderList
   */
  public onChangeHandle = (...rest: any[]) => {
    console.log('rest: ', rest);
  }

  render() {
    const { orders, loading } = this.props;
    console.table(orders);

    const columns: ColumnProps<any>[] = [
      {
        title: '订单号',
        dataIndex: 'order_no',
      },
      {
        title: '交易时间',
        dataIndex: 'datetime',
      },
      {
        title: '合计金额',
        dataIndex: 'stdtrnsamt',
        render: (total: any) => ( <div>{numeral(total).format('0.00')}</div> ),
      },
      {
        title: '交易状态',
        dataIndex: 'trnsflag',
        render: (flag: any) => {
          /**
           * @param { trnsflag | -1: 交易失败, 0: 交易初始化, 1: 交易成功, 2: 交易撤销, 3: 交易退单, } 
           */
          const status = numeral(flag).value();
          switch (status) {
            case -1:
              return ( <div>交易失败</div> );
              case 0:
              return ( <div>交易初始化</div> );
              case 1:
              return ( <div>交易成功</div> );
              case 2:
              return ( <div>交易撤销</div> );
              case 3:
              return ( <div>交易退单</div> );
            default:
              return '';
          }
        }
      }
    ];

    return (
      <div>
        {/* <Menus /> */}
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="order_no"
          loading={loading}
          pagination={{ pageSize: 10 }}
          onChange={this.onChangeHandle}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  orders: GetOrders(state),
  loading: GetOrderLoading(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  orderQuery: bindActionCreators(OrderController.orderQuery, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderList);
