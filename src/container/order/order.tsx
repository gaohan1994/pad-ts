/**
 * created by Ghan 9.13
 */
import * as React from 'react';
/**
 * react-redux
 */
import { List, Modal, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { merge } from 'lodash';
import {
  CHANGE_ORDER_DISHES,
  CHANGE_ORDER_PEOPLE_NUMBER,
  CHANGE_ORDER_TABLE_NUMBER,
} from '../../action/constants';
import numeral from 'numeral';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps, formatOrderTime } from '../../common/config';
import OrderController, { OrderDetailSearchParams, ChangeOrderDetailParams } from '../../action/order';
import TableController from '../../action/table';
import { Stores } from '../../store/index';
import { GetUserinfo } from '../../store/sign';
import { GetOrder, GetChangeToken, GetOrderChange } from '../../store/order';
import { GetTableInfo } from '../../store/table';
import styles from './style.less';
import Base from '../../action/base';

const { Item } = List;
interface OrderProps {
  match: { params: { orderid: string } };
  userinfo: any;
  order: any;
  orderChange: any;
  changeToken: boolean;
  tableinfo: any[];
  orderDetailSearch: (params: OrderDetailSearchParams) => void;
  changeOrderToken: (token: boolean) => void;
  changeOrderDetail: (params: ChangeOrderDetailParams) => void;
  getTableInfo: (mchnt_cd: string) => void;
}

interface OrderPageState {
  tableModal: boolean;
  peopleModal: boolean;
}
class OrderPage extends React.Component<OrderProps, OrderPageState> {
  state = {
    tableModal: false,
    peopleModal: false,
  };

  componentDidMount() {
    this.fetchOrderData();
  }

  /**
   * @todo 初始化数据
   *
   * @memberof OrderPage
   */
  public fetchOrderData = () => {
    const {
      orderDetailSearch,
      userinfo,
      match: { params : { orderid } }
    } = this.props;

    const fetchParams = {
      order_no: orderid,
      mchnt_cd: userinfo.mchnt_cd,
    };

    orderDetailSearch(fetchParams);
  }

  /**
   * @todo 改变订单状态
   *
   * @memberof OrderPage
   */
  public changeOrderToken = (token: boolean) => {
    const { changeOrderToken } = this.props;
    changeOrderToken(token);
  }

  /**
   * @todo 修改订单状态
   *
   * @memberof OrderPage
   */
  public changeOrderDetail = (params: ChangeOrderDetailParams) => {
    const { changeOrderDetail } = this.props;
    changeOrderDetail(params);
  }

  /**
   * @todo 修改桌号
   *
   * @memberof OrderPage
   */
  public changeTableNumber = (table: any) => {
    if (numeral(table.status).value() === 1) {
      Base.toastFail('该桌子已经被占用');
    } else {
      const params: ChangeOrderDetailParams = {
        changeType: CHANGE_ORDER_TABLE_NUMBER,
        changeDetail: table,
      };
      this.changeOrderDetail(params);
      this.hideTableModal();
    }
  }

  /**
   * @todo 修改用餐人数 
   *
   * @param { option: { value } value: number 人数 }
   * @memberof OrderPage
   */
  public changePeopleNumer = (option: any) => {
    const { value } = option;
    const params: ChangeOrderDetailParams = {
      changeType: CHANGE_ORDER_PEOPLE_NUMBER,
      changeDetail: {
        people_num: value
      }
    };
    this.changeOrderDetail(params);
    this.hidePeopleModal();
  }

  /**
   * @todo 退菜
   *
   * @memberof OrderPage
   */
  public changeOrderDishes = (dish: any) => {
    console.log('dish: ', dish);

    const params: ChangeOrderDetailParams = {
      changeType: CHANGE_ORDER_DISHES,
      changeDetail: dish
    };
    /** 
     * @param { is_weight === 1 是称斤， 判断减去之后是非为空 } 
     */
    if (numeral(dish.is_weight).value() === 1) {
      //
    } else {
      this.changeOrderDetail(params); 
    }
  }

  /**
   * @todo 请求桌子占用情况
   *
   * @memberof OrderPage
   */
  public fetchTable = () => {
    const { getTableInfo, userinfo } = this.props;
    getTableInfo(userinfo.mchnt_cd);
  }
  
  public showTableModal = () => {
    this.fetchTable();
    this.setState({ tableModal: true });
  }
  
  public showPeopleModal = () => {
    this.setState({ peopleModal: true });
  }

  public hideTableModal = () => {
    this.setState({ tableModal: false });
  }
  
  public hidePeopleModal = () => {
    this.setState({ peopleModal: false });
  }
   
  /**
   * @todo 要根据 changeToken 渲染
   */
  public render() {
    const { order, orderChange, changeToken } = this.props;

    const fee = changeToken === false 
    ? order.meal_fee 
    : orderChange.meal_fee;

    const total = changeToken === false 
    ? order.total 
    : orderChange.total;

    return (
      <div className={styles.container}>
        {this.renderTableModal()}
        {this.renderPeopleModal()}
        <div className={styles.box}>
          <div>订单号：{order.order_no}</div>
          <div>下单时间：{formatOrderTime(order.datetime)}</div>

          {
            changeToken === false ? (
              <div>桌号：{order.table_name}  用餐人数: {order.people_num}</div>
            ) : (
              <div>
                <div>桌号：{orderChange.table_name} <span onClick={() => this.showTableModal()}>修改桌号</span></div>
                <div>用餐人数: {orderChange.people_num} <span onClick={() => this.showPeopleModal()}>修改人数</span></div>
              </div>
            )
          }
          
          {
            changeToken === false ? (
              <List>
                {order.data && order.data.length > 0
                ? order.data.map((item: any, index: number) => {
                  return (
                    <Item key={`${item.product_id}${index}`}>
                      <div>
                        {`${item.product_name} 
                          | ${item.num} 
                            ${numeral(item.is_weight).value() === 1 ? '(斤)' : ''} 
                          | ${item.price}`}
                      </div>
                      {item.first_attr ? (
                        <div>{item.first_attr}</div>
                      ) : ''}
                      {item.second_attr ? (
                        <div>/{item.first_attr}</div>
                      ) : ''}
                    </Item>
                  );
                })
                : ''}
              </List>
            ) : (
              <List>
                {orderChange.data && orderChange.data.length > 0
                ? orderChange.data.map((item: any, index: number) => {

                  let canChangeToken: boolean = true;

                  if (orderChange.data.length === 1) {
                    const onlyDish = merge({}, orderChange.data[0], {});
                    if (numeral(onlyDish.is_weight).value() === 0) {
                      if (onlyDish.num === 1) {
                        canChangeToken = false;
                      }
                    }
                  } else if (item.num === 0) {
                    canChangeToken = false;
                  }

                  return (
                    <Item key={`${item.product_id}${index}`}>
                      <div>
                        {`${item.product_name} 
                        | ${item.num} 
                          ${numeral(item.is_weight).value() === 1 ? '(斤)' : ''} 
                        | ${item.price}`}
                      </div>

                      {
                        canChangeToken ? (
                          <div onClick={() => this.changeOrderDishes(item)}>能减</div>
                        ) : (
                          <div>不能减</div>
                        )
                      }
                      
                      {item.first_attr ? (
                        <div>{item.first_attr}</div>
                      ) : ''}
                      {item.second_attr ? (
                        <div>/{item.first_attr}</div>
                      ) : ''}
                    </Item>
                  );
                })
                : ''}
              </List>
            )
          }
          <div>餐位费：{fee}</div>
          <div>合计：{total}</div>
        </div>
        {
          changeToken === false ? (
            <div className={styles.footer}>
              <div onClick={() => this.changeOrderToken(true)}>修改订单</div>
              {/* <div>确认付款</div> */}
            </div>
          ) : (
            <div className={styles.footer}>
            <div onClick={() => this.changeOrderToken(false)}>取消</div>
            {/* <div>完成</div> */}
          </div>
          )
        }
      </div>
    );
  }
  
  /**
   * @todo 渲染桌号
   * @param { 如果 orderChange 中的 table_no 和 order 中的 table_no 不同说明修改过桌号显示 orderChange 的 }
   * @private
   * @memberof OrderPage
   */
  private renderTableModal = (): JSX.Element => {
    const { tableModal } = this.state;
    const { tableinfo, order, orderChange } = this.props;

    let changedTableNo = false;

    if (order.table_no !== orderChange.table_no) {
      changedTableNo = true;
    }

    return (
      <Modal
        transparent={true}
        visible={tableModal}
        className={styles.modal}
      >
        <div className={styles.close} onClick={() => this.hideTableModal()}>x</div>
        <div>请选择桌号</div>
        <div className={styles.content}>
          {
            tableinfo && tableinfo.length > 0
            ? tableinfo.map((area: any, index: number) => {
              return (
                <div key={index}>
                  <div>{area.area_name}</div>
                  <Flex
                    wrap="wrap"
                    align="start"
                    justify="between"
                  >
                    {area.tables && area.tables.length > 0
                    ? area.tables.map((table: any, j: number) => {
                      return (
                        <div 
                          key={j}
                          className={`
                            ${styles.button}
                            ${table.table_no !== orderChange.table_no
                              ? table.table_no === order.table_no
                                ? changedTableNo === true
                                  ? styles.normal
                                  : styles.active
                                : table.status === 1 ? styles.active : styles.normal
                              : styles.active}
                          `}
                          onClick={() => this.changeTableNumber(table)}
                        >
                          {table.table_name}
                        </div>
                      );
                    })
                    : ''}
                  </Flex>
                </div>
              );
            })
            : ''
          }
        </div>
        
      </Modal>
    );
  }
  
  private renderPeopleModal = (): JSX.Element => {
    const { peopleModal } = this.state;
    const { orderChange } = this.props;

    const peopleArray: any[] = [];

    for (let i = 1; i <= orderChange.max_peopel_num; i++) {
      peopleArray.push({
        value: i
      });
    }

    return (
      <Modal
        visible={peopleModal}
        transparent={true}
        className={styles.modal}
      >
        <div className={styles.close} onClick={() => this.hidePeopleModal()}>x</div>
        <div>请选择人数</div>
        <div className={styles.content}>
          <Flex
            wrap="wrap"
            align="start"
            justify="between"
          >
            {
              peopleArray
              ? peopleArray.map((option, i) => {
                return (
                  <div 
                    key={i}
                    className={`${styles.button}`}
                    onClick={() => this.changePeopleNumer(option)}
                  >
                    {`${option.value}人`}
                  </div>
                );
              })
              : ''
            }
          </Flex>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  userinfo: GetUserinfo(state),
  order: GetOrder(state),
  changeToken: GetChangeToken(state), 
  orderChange: GetOrderChange(state),
  tableinfo: GetTableInfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  orderDetailSearch: bindActionCreators(OrderController.orderDetailSearch, dispatch),
  changeOrderToken: bindActionCreators(OrderController.changeOrderToken, dispatch),
  changeOrderDetail: bindActionCreators(OrderController.changeOrderDetail, dispatch),
  getTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderPage);
