/**
 * @todo created by Ghan
 * 
 * updated by Ghan 2018.10.22
 * 
 * @param { 新的table页面 }
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Modal, Pagination } from 'antd';
import TableController, { TableActions } from '../../action/table';
import BusinessController, { BusinessActions } from '../../action/business';
import { mergeProps, Navigate } from '../../common/config';
import { 
  GetTableInfo,
  GetSelectedArea, 
  GetSelectedAreaId, 
  GetSelecetedTable,
} from '../../store/table';
import { GetCurrentCartList } from '../../store/cart';
import { Stores } from '../../store';
import Layout from '../../component/basicLayout/Layout';
import styles from './table.less';
import LeftBar, { HeadersData, FootersData } from '../../component/LeftBar/LeftBar';
import { ContentsData } from '../../component/LeftBar/LeftBar';
import { GetUserinfo } from '../../store/sign';
import config from '../../common/config';
import { GetCartParams, GetCartParamsReturn } from '../../action/cart';
import numeral from 'numeral';
import Base from '../../action/base';
import StatusController, { StatusAtions } from '../../action/status';
import OrderController from '../../action/order';
import PayPage from '../pay/Pay';
import { GetShowPay } from '../../store/status';

const { Item } = Layout;

/**
 * @param {params} 传入订单和购物车，返回需要的详情 1.餐位费 2.合计
 */
export const GetOrderAndCartDetails = (params: any): any => {
  const { table, order, cart } = params;
  const orderTotal = order && order.total ? numeral(order.total).value() : 0;
  if (!table) {
    return {};
  } else {
    const { total }: GetCartParamsReturn = GetCartParams({ list: cart || [] });
    const cartTotal = numeral(total).value();
    if (table.table_no === config.TAKEAWAYCARTID) {
      return { meal_fee: '0.00', total: numeral(orderTotal + cartTotal).format('0.00') };
    } else if (table.feeType === 0) {
      /**
       * @param {table} 判断如果该桌号没有餐位费直接返回 0 元 feeType === 0
       */
      return { meal_fee: '0.00', total: numeral(orderTotal + cartTotal).format('0.00') };
    } else if (table.feeType === 1) {
      /**
       * @param {table.feeType === 1} 定额餐位费返回定额，订单单的总价加上购物车的总价(订单的总价已经包含了餐位费)
       */
      return { meal_fee: numeral(table.fee).format('0.00'), total: numeral(orderTotal + numeral(cartTotal).value()).format('0.00') };
    } else if (table.feeType === 2) {
      /**
       * @param {table.feeType === 2} 百分比，餐位费返回原来餐位费 待修改
       */
      return { meal_fee: numeral(table.fee).format('0.00'), total: numeral(orderTotal + numeral(cartTotal).value()).format('0.00') };
    } else if (table.feeType === 3) {
      /**
       * @param {table.feeType === 3} 按人头算，餐位费返回原来的，待修改
       */
      return { meal_fee: numeral(table.fee).format('0.00'), total: numeral(orderTotal + numeral(cartTotal).value()).format('0.00') };
    } else {
      return { };
    }
  }
};

/**
 * @param { tableClickHandle: 点击桌子的 action }
 * @param { fetchTableInfo: 请求桌子信息 }
 * @param { changeTableArea: 切换区域的 action }
 * @param { match: route 上的参数 }
 * @param { tableinfo: 所有 table 的数据 }
 * @param { selectedTableInfo: 选中的 area 的数据 }
 * @param { selectedAreaI: 选中的 area 的id }
 * @param { selectedTable: 选中的桌子 }
 * @param { currentCartId: 当前选中的 cart 购物车 }
 * @interface TableProps
 */
interface TableProps {
  tableClickHandle: (param: any) => void;
  fetchTableInfo: (id: string) => void;
  changeTableArea: (param: any) => void;
  saveChoicePeople: (param: any) => void;
  setPayOrder: (param: any) => void;
  match: { params: { id: string } };
  tableinfo: any;
  selectedAreaInfo: any;
  selectedAreaId: string;
  selectedTable: any;
  list: any[];
  userinfo: any;
  currentCartId: string;
  dispatch: Dispatch<StatusAtions>;
  showPay: boolean;
}

interface TableState {
  showModal: boolean;
  currentPage: number;
}

const TALBE_PAGE_SIZE: number = 4 * 5;

/**
 * @todo 改版之后的table页面
 *
 * @class Table
 * @extends {Component<TableProps, TableState>}
 */
class Table extends Component<TableProps, TableState> {
  state = {
    showModal: false,
    currentPage: 1,
  };
  /**
   * @param { 1.先请求桌号 }
   * @param { }
   *
   * @memberof Meal
   */
  componentDidMount = () => {
    this.fetchTable();
  }

  /**
   * @todo 查询桌子情况
   *
   * @memberof Table
   */
  public fetchTable = () => {
    const { fetchTableInfo, match: { params: { id } } } = this.props;
    fetchTableInfo(id);
  }

  /**
   * @todo area click handle
   * @param { area: Area; change Area }
   *
   * @memberof Table
   */
  public onAreaClickHandle = (area: any) => {
    const { changeTableArea } = this.props;
    this.onChangePageHandle(1);
    changeTableArea(area);
  }

  /**
   * @todo 修改当前页数
   *
   * @memberof Store
   */
  public onChangePageHandle = (page: number): void => {
    this.setState({ currentPage: page });
  }

  /**
   * @todo table click handle
   * @param { table: Table 1.fetch current table's order if table status === 1 }
   *
   * @memberof Table
   */
  public onTableClickHandle = async (table: any) => {
    const { tableClickHandle } = this.props;
    tableClickHandle(table);
  }

  /**
   * @todo 点击人数前去点餐
   *
   * @memberof Table
   */
  public saveChoicePeople = async (param: any) => {
    const { saveChoicePeople } = this.props;
    saveChoicePeople(param);
  }

  public onShowModal = () => {
    this.setState({ showModal: true });
  }

  public onHideModal = () => {
    this.setState({ showModal: false });
  }

  /**
   * @todo cancel modal handle
   *
   * @memberof Table
   */
  public onCancelHandle = () => {
    this.onHideModal();
  }

  /**
   * @param {} 堂食模块中，若存在已下单，且购物车有菜品
   * @param {} 1、在点菜页面，点击【结帐】，弹出提示框：内容“订单中有未下单菜品，是否直接下单并结帐”，两个按钮“是”、“否”。
   * @param {} 1.1 点击“是”，下单——》显示结帐界面
   * @param {} 1.2 点击“否”，关闭提示框，返回点餐界面。
   * @param {} 2、若在选桌号页面，弹出toast：内容“订单中有未下单菜品”
   */
  public onOrderClickHandle = () => {
    const { list, selectedTable, dispatch, setPayOrder } = this.props;
    
    if (list && list.length > 0) {
      /**
       * @param {list.length > 0} 购物车内有物品
       */
      Base.toastFail('购物车中有未下单菜品');
    } else {
      /**
       * --- 购物车中没有商品直接显示结账 ---
       * @param {showPay} 显示 payPage
       * @param {setPayOrder} 把数据放进去
       */
      const params = { order: selectedTable.tableOrder };
      StatusController.showPay(dispatch);
      setPayOrder(params);
    }
  }

  render() {
    const { showModal, currentPage } = this.state;
    const { 
      tableinfo, 
      selectedAreaInfo, 
      selectedAreaId, 
      selectedTable, 
      list, 
      userinfo,
      currentCartId,
      showPay,
    } = this.props;

    const params = {
      table: selectedTable,
      order: selectedTable.tableOrder,
      cart: list,
    };

    const { meal_fee, total } = GetOrderAndCartDetails(params);

    const modalData = (selectedAreaInfo && typeof (selectedAreaInfo.peopelNum) === 'number')
    ? new Array(selectedAreaInfo.peopelNum).fill({}).map((_: any, index: number) => {
      return {
        key: index + 1,
        value: index + 1,
      };
    })
    : [];

    /**
     * @param {tableOrder} 选中 table 的数据
     * @param {config.TAKEAWAYCARTID} 手动屏蔽外卖的数据
     */ 
    const { tableOrder } = selectedTable;
    const headers: HeadersData = currentCartId !== config.TAKEAWAYCARTID ? {
      data: [
        [{ key: '1', title: '订单号：', value: tableOrder && tableOrder.order_no || '' }],
        [
          { key: '2', title: '桌号：', value: selectedTable.table_no || '' }, 
          { key: '3', title: '用餐人数：', value: tableOrder && tableOrder.people_num ? `${tableOrder.people_num}人` : '' },
        ]
      ]
    } : {};

    const contents: ContentsData = currentCartId !== config.TAKEAWAYCARTID ? {
      data: [
        { itemIcon: '//net.huanmusic.com/llq/icon_dagou.png', list: tableOrder && tableOrder.data || [], },
        { itemIcon: '//net.huanmusic.com/llq/icon_gouwuche1.png', list },
      ]
    } : {};

    const footers: FootersData = currentCartId !== config.TAKEAWAYCARTID ? {
      // remarks: '整单备注：123123123',

      /**
       * @param {detail} 餐位费 1.订单中的餐位费 2.购物车中的餐位费 3.相加
       */
      detail: [
        [
          { key: '1', title: '餐位费', value: '' }, 
          { key: '1-1', title: `￥${meal_fee || '0.00'}`, value: '' }
        ],
        [{ key: '2', title: '合计', value: '' }, { key: '3', title: `￥${total || '0.00'}`, value: '' }]
      ],
      buttons: [
        {
          style: { background: '#474747' },
          values: ['结账', `￥${total || '0.00'}`],
          onClick: () => this.onOrderClickHandle(),
        },
        {
          values: ['下单'],
          onClick: tableOrder && tableOrder.people_num 
            ? () => { Navigate.navto(`/store/${userinfo.mchnt_cd}`); }
            : () => { this.setState({ showModal: true }); },
        },
      ]
    } : {
      buttons: []
    };

    return (
      <Layout>
        <Item position="main" style={{paddingLeft: '10px', minWidth: '450px'}}>
          <PayPage />
          {
            showPay === false ? (
              <div 
                style={{ maxHeight: `${document && document.documentElement && document.documentElement.clientHeight - 64}px` }} 
                className={styles.tables}
              >
                {
                  selectedAreaInfo && selectedAreaInfo.tables.slice((currentPage - 1) * TALBE_PAGE_SIZE, currentPage * TALBE_PAGE_SIZE).map((table: any) => {
                    const { peopelNum } = selectedAreaInfo;
                    return (
                      <div
                        key={table.table_no}
                        className={`
                          ${styles.table}
                          ${table.status === 1 ? styles.occupy : styles.unoccupy}
                        `}
                        style={{
                          border: `${
                            selectedTable.table_no === table.table_no 
                              ? table.status === 1
                                ? '1px solid #b78d1d'
                                : '1px solid #f8c030'
                              : ''
                          }`
                        }}
                        onClick={() => this.onTableClickHandle(table)}
                      >
                        {table.table_name}
                        <div className={table.status === 1 ? styles.activeTip : styles.normalTip}>
                          {
                            selectedTable.table_no === table.table_no
                              ? selectedTable.tableOrder
                                  ? `￥${numeral(selectedTable.tableOrder.stdtrnsamt).format('0.00')}`
                                  : `可供${peopelNum}人`
                              : `可供${peopelNum}人`
                          }
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            ) : ''
          }
          
          {
            showPay === false && selectedAreaInfo && selectedAreaInfo.tables.length > 0 ? (
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  size="small" 
                  total={selectedAreaInfo.tables.length}
                  pageSize={TALBE_PAGE_SIZE}
                  hideOnSinglePage={true}
                  onChange={this.onChangePageHandle}
                />  
              </div>
            ) : ''
          }
          
        </Item>
        <Item position="left">
          <LeftBar headers={headers} contents={contents} footers={footers} />
        </Item>
        <Item position="right">
          <div className={styles.right}>
            <div className={styles.search}>
              <span className={styles.searchIcon} />
              <span>搜索</span>
            </div>
            {tableinfo.map((area: any) => {
              return (
                <div
                  key={area.area_id}
                  className={selectedAreaId === area.area_id ? styles.activeArea : styles.normalArea}
                  onClick={() => this.onAreaClickHandle(area)}
                >
                  {selectedAreaId === area.area_id ? <div className={styles.active} /> : ''}
                  {area.area_name}
                </div>
              );
            })}
          </div>
        </Item>
        <Modal
          title="用餐人数"
          visible={showModal}
          footer={null}
          onCancel={this.onCancelHandle}
          centered={true}
          className="my-change-table-modal my-change-people-modal"
        >
          <div className={styles.people}>
            {
              modalData && modalData.map((item: any) => {
                return (
                  <div 
                    key={item.key} 
                    className={styles.number}
                    onClick={() => this.saveChoicePeople(item)}
                  >
                    {item.value}
                  </div>
                );
              })
            }
          </div>
        </Modal>
      </Layout>
    );
  }
}

const mapStateToProps = (state: Stores) => {

  const { list, currentCartId } = GetCurrentCartList(state);
  return {
    tableinfo: GetTableInfo(state),
    selectedAreaInfo: GetSelectedArea(state),
    selectedAreaId: GetSelectedAreaId(state),
    selectedTable: GetSelecetedTable(state),
    list,
    currentCartId,
    userinfo: GetUserinfo(state),
    showPay: GetShowPay(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<TableActions | BusinessActions>) => ({
  dispatch,
  fetchTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
  changeTableArea: bindActionCreators(BusinessController.changeTableArea, dispatch),
  tableClickHandle: bindActionCreators(BusinessController.tableClickHandle, dispatch),
  saveChoicePeople: bindActionCreators(BusinessController.saveChoicePeople, dispatch),
  setPayOrder: bindActionCreators(OrderController.setPayOrder, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
