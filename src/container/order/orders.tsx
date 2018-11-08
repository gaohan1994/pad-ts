import React, { Component } from 'react';
import { Table, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import styles from './orders.less';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps, formatOrderTime } from '../../common/config';
import OrderController, { OrderQueryParams } from '../../action/order';
import { Stores } from '../../store/index';
import numeral from 'numeral';
import {
  GetOrders,
  GetOrderLoading,
} from '../../store/order';
import { GetUserinfo } from '../../store/sign';

const { Option } = Select;

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
  userinfo: any;
}

interface OrdersState {
  currentPage: number;
  consumptionType: string;
  orderType: string;
  paymentType: string;
}
/**
 * @param { currentPage: number 当前页码 }
 * @param { ORDERSPAGESIZE: number 每页数量 default as 20 }
 */
let currentPage: number = 1;
class OrderList extends Component<OrdersProps, OrdersState> {
  state = {
    currentPage: 1,
    consumptionType: '',
    orderType: '',
    paymentType: '',
  };
  componentDidMount() {
    this.fetchOrderList();
  }

  /**
   * @todo 获取订单列表
   *
   * @memberof OrderList
   */
  public fetchOrderList = () => {
    const { orderQuery, userinfo } = this.props;

    const params = {
      mchnt_cd: userinfo.mchnt_cd,
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
        className: styles.header,
      },
      {
        title: '交易时间',
        dataIndex: 'datetime',
        className: styles.header,
        render: (time) => (formatOrderTime(time)),
      },
      {
        title: '台位 / 牌号',
        dataIndex: 'tableName',
        className: styles.header,
      },
      // {
      //   title: '合计金额',
      //   dataIndex: 'stdtrnsamt',
      //   render: (total: any) => ( <div>{numeral(total).format('0.00')}</div> ),
      // },
      {
        title: '优惠立减',
        render: () => ( <div>0.00</div> ),
        className: styles.header,
      },
      // {
      //   title: '抹零金额',
      //   dataIndex: 'stdtrnsamt',
      //   render: (total: any) => ( <div>{numeral(total).format('0.00')}</div> ),
      // },
      {
        title: '实付金额',
        dataIndex: 'stdtrnsamt',
        className: styles.header,
        render: (total: any) => ( <div className={styles.activeText}>{numeral(total).format('0.00')}</div> ),
      },
      {
        title: '付款类型',
        className: styles.header,
        render: () => ( <div>没有该条数据</div> ),
      },
      {
        title: '交易状态',
        dataIndex: 'trnsflag',
        className: styles.header,
        render: (flag: any) => {
          /**
           * @param { trnsflag | -1: 交易失败, 0: 交易初始化, 1: 交易成功, 2: 交易撤销, 3: 交易退单, } 
           */
          const status = numeral(flag).value();
          switch (status) {
            case -1:
              return ( <div className={styles.activeText}>交易失败</div> );
              case 0:
              return ( <div className={styles.activeText}>未支付</div> );
              case 1:
              return ( <div className={styles.activeText}>交易成功</div> );
              case 2:
              return ( <div className={styles.activeText}>交易撤销</div> );
              case 3:
              return ( <div className={styles.activeText}>交易退单</div> );
            default:
              return '';
          }
        }
      }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <Select 
              className={styles.select} 
              defaultValue="all"
              style={{ width: 120 }}
            >
              <Option value="all">消费类型</Option>
              <Option value="weixin">微信</Option>
              <Option value="zhifubao">支付宝</Option>
            </Select>

            <Select className={styles.select} defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              <Option value="1">待支付</Option>
            </Select>

            <Select className={styles.select} defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部</Option>
            </Select>
          </div>
          <Table
            columns={columns} 
            dataSource={orders} 
            rowKey={order => order.order_no}
            loading={loading}
            pagination={{ pageSize: 10 }}
            onChange={this.onChangeHandle}
            size="middle"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  orders: GetOrders(state),
  loading: GetOrderLoading(state),
  userinfo: GetUserinfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  orderQuery: bindActionCreators(OrderController.orderQuery, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderList);
