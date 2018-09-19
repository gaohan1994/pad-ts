/**
 * created by Ghan 9.13
 */
import * as React from 'react';
import {
  Tabs,
  ListView,
  WingBlank,
  Button,
} from 'antd-mobile';
import styles from './style.less';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps, formatOrderTime } from '../../common/config';
import OrderController, { OrderQueryParams, CloseOrderParams } from '../../action/order';
import { Stores } from '../../store/index';
import numeral from 'numeral';
import Base from '../../action/base';
import {
  GetOrders,
  GetUnpaid,
} from '../../store/order';
import history from '../../history';

let currentPage: number = 1;

interface OrderListProps {
  orderQuery: (parmas: OrderQueryParams) => void;
  closeOrder: (params: CloseOrderParams) => void;
  paid: any;
  unpaid: any;
  orders: any;
}

interface OrderListState {
  unpaidDataSource: any;
  ordersDataSource: any;
}

const MyBody = (props: any) => {
  return (
    <div className={styles.listBody}>
      {props.children}
    </div>
  );
};

class OrderList extends React.Component<OrderListProps, OrderListState> {

  constructor (props: OrderListProps) {
    super(props);
    this.state = {
      unpaidDataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2,
      }),
      ordersDataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2,
      }),
    };

    this.onPayOrder = this.onPayOrder.bind(this);
    this.onNavHandle = this.onNavHandle.bind(this);
  }

  componentWillReceiveProps(nextProps: any) {
    const { unpaid, orders } = nextProps;

    if (unpaid && unpaid !== this.props.unpaid) {
      this.setState({
        unpaidDataSource: this.state.unpaidDataSource.cloneWithRows(unpaid)
      });
    }

    if (orders && orders !== this.props.orders) {
      this.setState({
        ordersDataSource: this.state.ordersDataSource.cloneWithRows(orders)
      });
    }
  }

  componentDidMount() {
    this.fetchOrderList();
  }

  /**
   * @todo 跳转函数
   * @param { route 要跳转的地址 } string
   *
   * @memberof OrderList
   */
  public onNavHandle = (route: string) => {
    history.push(`${route}`);
  }

  /**
   * @todo 支付订单
   *
   * @memberof OrderList
   */
  public onPayOrder = (order: any, e: Event) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    Base.alert('支付订单');
  }

  /**
   * @todo 关闭订单
   *
   * @memberof OrderList
   */
  public onCloseOrder = (order: any, e: Event) => {
    console.log('order: ', order);

    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const params: CloseOrderParams = {
      order_no: order.order_no,
      ispos: '2',
    };

    Base.alert('确认关闭订单？', [
      { text: '取消' },
      {
        text: '删除',
        onPress: () => {
          console.log('delete');
          this.closeOrder(params);
        }
      }
    ]);
  }

  /**
   * @todo 关闭订单
   *
   * @memberof OrderList
   */
  public closeOrder = (params: CloseOrderParams): void => {
    const { closeOrder } = this.props;
    closeOrder(params);
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
      currentPage: `${currentPage++}`,
      pageSize: `${config.DEFAULT_PAGE_SIZE}`,
    };
    orderQuery(params);
  }

  public render() {

    const tabs = [
      { title: '未付款' },
      { title: '全部订单' },
    ];

    return (
      <div>
        <Tabs
          tabs={tabs}
          initialPage={0}
          tabBarUnderlineStyle={{ backgroundColor: '#f7bf41', borderColor: '#f7bf41' }}
          tabBarActiveTextColor="#f7bf41"
          tabBarTextStyle={{ fontSize: '17px' }}
        >
          <WingBlank>
            <ListView
              dataSource={this.state.unpaidDataSource}
              renderRow={this.renderRow}
              renderBodyComponent={() => <MyBody />}
              pageSize={8}
              style={{
                height: `${document.documentElement.clientHeight - 50}px`,
                overflow: 'auto',
              }}
              scrollRenderAheadDistance={100}
            />
          </WingBlank>
          <WingBlank>
            <ListView
              dataSource={this.state.ordersDataSource}
              renderRow={this.renderRow}
              renderBodyComponent={() => <MyBody />}
              pageSize={8}
              style={{
                height: `${document.documentElement.clientHeight - 50}px`,
                overflow: 'auto',
              }}
              scrollRenderAheadDistance={100}
            />
          </WingBlank>
        </Tabs>
      </div>
    );
  }

  private renderRow = (item: any) => {
    const trnsflag = numeral(item.trnsflag).value();
    return (
      <div 
        key={item.order_no}
        className={styles.row}
        onClick={this.onNavHandle.bind(this, `/order/${item.order_no}`)}
      >
        <div className={styles.rowHeader}>
          <div>{item.tableName}</div>
          <div>
            {trnsflag === 0
            ? '未支付'
            : trnsflag === 1
              ? '已支付'
              : trnsflag === 4
                ? '已关闭'
                : ''}
          </div>
        </div>
        <div className={styles.rowContent}>
          {
            item.stdtrnsamt ? (
              <div>金额：￥{numeral(item.stdtrnsamt).format('0.00')}</div>
            ) : ''
          }
          {
            item.order_no ? (
              <div>订单号：{item.order_no}</div>
            ) : ''
          }
          {
            item.datetime ? (
              <div>时间：{formatOrderTime(item.datetime)}</div>
            ) : ''
          }
        </div>
        {
          trnsflag === 0 ? (
            <div className={styles.rowFooter}>
              <Button type="ghost" size="small" style={{marginRight: '10px'}} onClick={this.onCloseOrder.bind(this, item)}>关闭订单</Button>
              <Button type="primary" size="small" onClick={this.onPayOrder.bind(this, item)}>立即支付</Button>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  orders: GetOrders(state),
  unpaid: GetUnpaid(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  orderQuery: bindActionCreators(OrderController.orderQuery, dispatch),
  closeOrder: bindActionCreators(OrderController.closeOrder, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderList);
