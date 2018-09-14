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
import * as CSSModules from 'react-css-modules';
import styles from './style.less';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps } from '../../common/config';
import OrderController, { OrderQueryParams } from '../../action/order';
import { Stores } from '../../store/index';
import numeral from 'numeral';
import { 
  GetPaid,
  GetUnpaid,
} from '../../store/order';

let currentPage: number = 1;

interface OrderListProps {
  orderQuery: (parmas: OrderQueryParams) => void;
  paid: any;
  unpaid: any;
}

const MyBody = (props: any) => {
  return (
    <div className={styles.listBody}>
      {props.children}
    </div>
  );
};

class OrderList extends React.Component<OrderListProps, {}> {

  state = {
    paidDataSource: new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    }),
    unpaidDataSource: new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    }),
  };

  componentWillReceiveProps(nextProps: any) {
    const { paid, unpaid } = nextProps;

    if (paid && paid !== this.props.paid) {
      this.setState({
        paidDataSource: this.state.paidDataSource.cloneWithRows(paid)
      });
    }

    if (unpaid && unpaid !== this.props.unpaid) {
      this.setState({
        unpaidDataSource: this.state.unpaidDataSource.cloneWithRows(unpaid)
      });
    }
  }

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
      mchnt_cd: '60000000217',
      currentPage: `${currentPage++}`,
      pageSize: `${config.DEFAULT_PAGE_SIZE}`,
    };
    orderQuery(params);
  }

  public render() {

    const tabs = [
      { title: '未付款' },
      { title: '已付款' },
    ];

    return (
      <div>
        <Tabs
          tabs={tabs}
          initialPage={1}
          // page={page}
          // onChange={this.onChangePageHandle}
          // onTabClick={this.onChangePageHandle}
          tabBarUnderlineStyle={{ backgroundColor: '#f7bf41', borderColor: '#f7bf41' }}
          tabBarActiveTextColor="#f7bf41"
          tabBarTextStyle={{ fontSize: '17px' }}
        >
          <WingBlank>
            <ListView
              dataSource={this.state.unpaidDataSource}
              renderRow={this.renderRow}
              renderBodyComponent={() => <MyBody />}
              // className="am-list"
              pageSize={8}
              style={{
                height: `${document.documentElement.clientHeight - 50}px`,
                overflow: 'auto',
              }}
              scrollRenderAheadDistance={100}
              // onEndReached={this.onEndReached}
              // onEndReachedThreshold={10}
            />
          </WingBlank>
          <WingBlank>
            <ListView
              dataSource={this.state.paidDataSource}
              renderRow={this.renderRow}
              renderBodyComponent={() => <MyBody />}
              // className="am-list"
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
        <div className={styles.rowFooter}>
          <Button type="primary" size="small">关闭订单</Button>
        </div>
        item
      </div>
    );
  }
}
const OrderListHoc = CSSModules(OrderList, styles);

const mapStateToProps = (state: Stores) => ({
  paid: GetPaid(state),
  unpaid: GetUnpaid(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  orderQuery: bindActionCreators(OrderController.orderQuery, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderListHoc);
