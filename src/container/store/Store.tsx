import * as React from 'react';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Pagination, Modal } from 'antd';
import config, { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenuList, GetMenutp, GetSelectedMenu, GetSelectedMenuList } from '../../store/menu';
import MenuController, { MenuActions } from '../../action/menu';
import BusinessController, { BusinessActions } from '../../action/business';
import CartController, { DeleteItemParam } from '../../action/cart';
import Layout, { SmallCardProps } from '../../component/basicLayout/Layout';
import styles from './store.less';
import Helper from '../../component/Helper/Helper_V1';
import OrderController, { ManageMenuParams, SendOrderV2Params } from '../../action/order';
import LeftBar, { HeadersData, FootersData, ContentsData } from '../../component/LeftBar/LeftBar';
import { GetCurrentCartList, GetCurrentDish, GetCurrentCartListReturn } from '../../store/cart';
import { GetSelecetedTable } from '../../store/table';
import { GetCalledNumber } from '../../store/order';
import StatusController from '../../action/status';
import TableModal from '../../component/TableModal/TableModal';
import PeopleModal from '../../component/PeopleModal/PeopleModal';
import { GetOrderAndCartDetails } from '../table/Table';
import Base from '../../action/base';
import SearchDish from '../../component/Search/SearchDish';
import PayPage from '../pay/Pay';
import { GetSearchStatus, GetShowPay } from '../../store/status';

const { confirm } = Modal;
const { Item } = Layout;
const { ItemBar } = Item;
const { SmallCard } = ItemBar;

interface StoreProps {
  menu: any;
  menuTp: any;
  dispatch: Dispatch;
  match: { params: { id: string } };
  selectedMenu: any;
  selectedMenuList: any;
  list: any[];
  currentDish: any;
  currentCartId: string;
  selectedTable: any;
  calledNumber: string;
  searchStatus: boolean;
  showPay: boolean;
  getMenuTp: (mchnt_cd: string) => void;
  fetchStoreData: (mchnt_cd: string) => void;
  setSelectedMenutp: (menuid: string) => void;
  sendOrder: () => void;
  emptyCart: () => void;
  changeModalHandle: (params: any) => void;
  manageMenu: (param: ManageMenuParams) => void;
  getCalledNumber: () => void;
  sendOrderV2: (param: SendOrderV2Params) => void;
  setPayOrder: (param: any) => void;
  deleteItem: (param: DeleteItemParam) => void;
}

/**
 * @param {changeTableModal} string 显示换桌modal
 * @interface StoreState
 */
interface StoreState { 
  currentPage: number;
}

/**
 * @param {STOREPAGESIZE} 每页的数据数量 (4 * 8)
 */
export const STOREPAGESIZE: number = 28;
/**
 * @todo Store 页面
 *
 * @class Store
 * @extends {React.Component<StoreProps, StoreState>}
 */
class Store extends React.Component<StoreProps, StoreState> {
  state = {
    currentPage: 1,
  };
  /**
   * 请求扫描出来的餐厅的数据保存到redux中去
   * 在接下来会使用到数据的地方都从redux中取
   *
   * @memberof Welcome
   */
  componentDidMount() {
    this.fetchData();
    this.initTakeaway();
  }

  public initTakeaway = () => {
    const { currentCartId, getCalledNumber } = this.props;
    /**
     * @param {currentCartId === config.TAKEAWAYCARTID} 如果是外卖那么请求取餐号
     */
    if (currentCartId === config.TAKEAWAYCARTID) {
      getCalledNumber();
    }
  }

  /**
   * @todo 请求数据
   * @param { mchnt_cd 商户号 }
   *
   * @memberof Store
   */
  public fetchData = async () => {
    const { match, fetchStoreData, getMenuTp } = this.props;

    await getMenuTp(match.params.id);
    fetchStoreData(match.params.id);
  }

  /**
   * @todo 切换菜单
   * @param { menutp 在菜单中找到 menutp 的位置然后跳转 }
   * @param {onChangePageHandle 每次切换菜单都重置页码}
   * @memberof Store
   */
  public changeMenuTp = (tp: any) => {
    const { setSelectedMenutp } = this.props;
    setSelectedMenutp(tp.menutp_id);
    this.onChangePageHandle(1);
  }

  /**
   * @todo 下单
   *
   * @memberof Store
   */
  public sendOrder = () => {
    const { sendOrder } = this.props;
    sendOrder();
  }

  /**
   * @todo 清空购物车
   *
   * @memberof Store
   */
  public emptyCart = () => {
    const { emptyCart } = this.props;
    emptyCart();
  }

  public deleteItem = () => {
    const { currentDish, deleteItem } = this.props;
    console.log('currentDish: ', currentDish);
    if (currentDish.type === config.STORE_DISH_CART_TYPE) {
      /**
       * @param {currentDish} 选中的菜品
       */
      let params: DeleteItemParam = {
        data: currentDish,
      };

      if (currentDish.currentAttr) {
        params = {
          ...params,
          attrs: currentDish.currentAttr.attrs
        };
      }
      deleteItem(params);
    } else {
      Base.toastFail('删除失败~');
    }
  }

  /**
   * 显示 search module
   *
   * @memberof Store
   */
  public onSearchHandle = () => {
    const { dispatch } = this.props;
    StatusController.showSearch(dispatch);
  }

  /**
   * @todo render controll bar
   *
   * @memberof Store
   */
  public renderHelper = (): JSX.Element => {
    const { list, currentDish } = this.props;
    const { currentAttr, product_id } = currentDish;

    let selectedDish: any = {};

    if (list && list.length > 0 && product_id) {
      selectedDish = list.find((d: any) => d.product_id === product_id);
    } else {
      selectedDish = {};
    }

    if (
      currentDish && currentDish.type === 'cart' && 
      selectedDish && selectedDish.product_id
    ) {
      return (
        <div className={styles.coustomCard}>
          <div className={styles.controllNumber}>
            {
              selectedDish.attrType && currentAttr 
              ? selectedDish.number.find((n: any) => n.id === currentAttr.id)
                ? selectedDish.number.find((n: any) => n.id === currentAttr.id).number
                : ''
              : selectedDish.number
            }
          </div>
          <div className={styles.controllBar}>
            <Helper data={selectedDish} clickFromPropsParam={{type: 'reduce', currentAttr}} >-</Helper>
            <Helper data={selectedDish} clickFromPropsParam={{type: 'add', currentAttr}} >+</Helper>
          </div>
        </div>
      ); 
    } else {
      return <div/>;
    }
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
   * @todo set current Dish 
   * @param {1.整理好数据 2.触发dispatch存到redux}
   *
   * @memberof Store
   */
  public setCurrentDish = (data: any) => {
    const { dispatch } = this.props;

    const param = {
      dispatch,
      currentDish: data,
    };
    CartController.setCurrentDish(param);
  }

  /**
   * @param {type} 已经下单的菜和购物车中的菜要区别开
   * @memberof Store
   */
  public onLeftBarCartListClickHandle = (param: any) => {
    const { data, currentAttr } = param;
    let currentDataParam: any = { 
      product_id: data.product_id,
      type: config.STORE_DISH_CART_TYPE,
    };
    if (currentAttr) {
      currentDataParam.currentAttr = currentAttr;
    }
    this.setCurrentDish(currentDataParam);
  }

  /**
   * @todo
   * @param {type} 已经下单的菜和购物车中的菜要区别开
   * @memberof Store
   */
  public onLeftBarOrderListClickHandle = (param: any) => {
    const { data, currentAttr } = param;
    let currentDataParam: any = {
      product_id: data.product_id,
      type: config.STORE_DISH_ORDER_TYPE, 
    };
    if (currentAttr) {
      currentDataParam.currentAttr = currentAttr;
    }
    this.setCurrentDish(currentDataParam);
  }

  /**
   * @todo 显示换桌modal
   *
   * @memberof Store
   */
  public showChangeTableModal = () => {
    const { changeModalHandle } = this.props;

    const param = { changeTableModalStatus: true };
    changeModalHandle(param);
  }

  /**
   * @todo 显示换人数 modal 
   *
   * @memberof Store
   */
  public showChangePeopleModal = () => {
    const { dispatch } = this.props;
    const params = { changePeopleModalStatus: true, dispatch };
    StatusController.changePeopleModalHandle(params);
  }

  /**
   * @todo 退菜
   *
   * @memberof Store
   */
  public onManageMenuHandle = () => {
    const { currentDish, currentCartId, selectedTable, manageMenu } = this.props;

    if (currentDish.type === config.STORE_DISH_ORDER_TYPE && selectedTable.tableOrder) {
      /**
       * @param {order} 该桌子的订单
       * @param {selectedTable} 选中的桌子
       */
      const { tableOrder: order } = selectedTable;

      const data = {
        ...order.data.find((d: any) => d.product_id === currentDish.product_id),
        num: 1,
      };
      const params: ManageMenuParams = {
        type: 'retire',
        order,
        data: [data],
        table: selectedTable,
        currentCartId,
        needPay: false,
      };
      manageMenu(params);
    } else {
      Base.toastFail('只有下单之后的菜品可以退菜~');
    }
  }

  /**
   * @todo 是否显示pay页面
   * @param {1.传入所有需要的数据进入 redux}
   *
   * @memberof Store
   */
  public onShowPayHandle = () => {
    const { 
      dispatch, 
      selectedTable, 
      setPayOrder,
      list,
    } = this.props;
    console.log('onShowPayHandle: ');
    if (!selectedTable.tableOrder) {
      /**
       * --- 空桌 ---
       * @param {true} 先下单在显示 pay
       */
      this.doOrderHandle(true);
    } else {
      /**
       * --- 非空桌 ---
       * @param {list} 购物车中是否有物品
       */
      if (list && list.length > 0) {

        /**
         * --- 购物车中有商品先下单然后结账 ---
         * @param {}
         */
        confirm({
          title: '购物车中有未下单菜品，是否直接下单并结帐',
          onOk: () => this.doOrderHandle(true),
          onCancel: () => {/** */}
        });
        
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
  }

  /**
   * @todo 下单
   *
   * @memberof Store
   */
  public doOrderHandle = (needPay: boolean) => {
    /**
     * @param {selectedTable.tableOrder} selectedTable.tableOrder 存在那么走加菜如果不存在那说明是新桌走下单
     * @param {list} 购物车
     */
    const { list, currentCartId, selectedTable, manageMenu, sendOrderV2 } = this.props;

    if (list && list.length > 0) {
      /**
       * @param {onChangePageHandle} 先切换成第一页 
       */
      this.onChangePageHandle(1);
      if (selectedTable.tableOrder) {
        /**
         * @param {order} 已经存在的订单,走加菜接口
         */
        const { tableOrder: order } = selectedTable;

        const params: ManageMenuParams = {
          type: 'add',
          order,
          data: list,
          currentCartId,
          table: selectedTable,
          needPay,
        };
        console.log('params: ', params);
        manageMenu(params);
      } else {
        /**
         * @param {} 不存在订单走下单接口
         */
        sendOrderV2({ needPay });
      }
    } else {
      Base.toastInfo('请选择要下单的菜品');
    }
  }

  public render() {
    const { currentPage } = this.state;
    const {
      list,
      menuTp,
      selectedMenu,
      selectedMenuList,
      currentCartId,
      selectedTable,
      currentDish,
      calledNumber,
      searchStatus,
      showPay,
    } = this.props;

    const { tableOrder } = selectedTable;

    const params = {
      table: selectedTable,
      order: selectedTable.tableOrder,
      cart: list,
    };
    const { meal_fee, total } = GetOrderAndCartDetails(params);

    const headers: HeadersData = currentCartId === config.TAKEAWAYCARTID ? {
      data: [
        [{ key: '1', title: '取餐号：', value: calledNumber || '' }],
      ]
    } : {
      data: [
        [{ key: '1', title: '订单号：', value: tableOrder && tableOrder.order_no || '' }],
        [
          { key: '2', title: '桌号：', value: selectedTable.table_no || '' }, 
          { key: '3', title: '用餐人数：', value: tableOrder && tableOrder.people_num ? `${tableOrder.people_num}人` : '' },
        ]
      ]
    };

    const contents: ContentsData = {
      data: [
        { 
          itemIcon: '//net.huanmusic.com/llq/icon_dagou.png', 
          list: tableOrder && tableOrder.data || [], 
          onClick: this.onLeftBarOrderListClickHandle,
          type: 'order',
        },
        { 
          itemIcon: '//net.huanmusic.com/llq/icon_gouwuche1.png', 
          list, 
          onClick: this.onLeftBarCartListClickHandle,
          type: 'cart'
        },
      ],
    };

    const footers: FootersData = {
      // remarks: '整单备注：123123123',
      detail: [
        [{ key: '1', title: '餐位费', value: '' }, { key: '1-2', title: `￥${meal_fee || '0.00'}`, value: '' }],
        [{ key: '2', title: '合计', value: '' }, { key: '2-2', title: `￥${total || '0.00'}`, value: '' }]
      ],
      buttons: currentCartId === config.TAKEAWAYCARTID ? [
        {
          style: { background: '#474747' },
          values: ['结账', `￥${total || '0.00'}`],
          onClick: () => this.doOrderHandle(true),
        },
      ] : [
        {
          style: { background: '#474747' },
          values: ['结账', `￥${total || '0.00'}`],
          onClick: () => this.onShowPayHandle(),
        },
        {
          values: ['下单'],
          onClick: () => this.doOrderHandle(false),
        },
      ]
    };

    const ItemBarData: SmallCardProps[] = [
      tableOrder && tableOrder.table_no ? {
        img: '//net.huanmusic.com/llq/icon_huanzhuo.png',
        value: '换桌',
        style: {background: '#f8c030'},
        onClick: () => this.showChangeTableModal(),
      } : {},
      tableOrder && tableOrder.people_num ? {
        img: '//net.huanmusic.com/llq/icon_renshu.png',
        style: {background: '#f8c030'},
        value: '修改人数',
        onClick: () => this.showChangePeopleModal(),
      } : {},
      // {
      //   img: '//net.huanmusic.com/llq/icon_houchu.png',
      //   value: '重打后厨'
      // },
      // {
      //   img: '//net.huanmusic.com/llq/icon_houchu.png',
      //   value: '重打前台'
      // },
      {
        render: this.renderHelper,
      },
      {
        img: '//net.huanmusic.com/llq/icon_lajitong.png',
        value: '删除',
        style: currentDish && currentDish.type === config.STORE_DISH_CART_TYPE
          ? {background: '#f8c030'}
          : {},
        onClick: currentDish && currentDish.type === config.STORE_DISH_CART_TYPE
          ? this.deleteItem
          : () => { Base.toastFail('请先选择要从购物车中删除的菜品~'); }
      },
      {
        img: '//net.huanmusic.com/llq/icon_tuicai.png',
        value: '退菜',
        style: currentDish && currentDish.type === config.STORE_DISH_ORDER_TYPE
          ? {background: '#f8c030'}
          : {},
        onClick: currentDish && currentDish.type === config.STORE_DISH_ORDER_TYPE
          ? this.onManageMenuHandle
          : () => { Base.toastFail('选择一个已经下单的菜品才能进行退菜~'); }
      },
      // {
      //   img: '//net.huanmusic.com/llq/icon_houchu.png',
      //   value: '整单备注'
      // },
      {
        img: '//net.huanmusic.com/llq/icon_gouwuche.png',
        value: '清空购物车',
        style: {background: '#f8c030'},
        onClick: () => this.emptyCart(),
      },
    ];

    return (
      <Layout>
        <TableModal />
        <PeopleModal />
        <Item 
          position="main" 
          style={{
            marginLeft: `${showPay === false ? '340px' : '250px'}`, 
            marginRight: `${searchStatus === true || showPay === true ? '10px' : '100px'}`, 
            minWidth: '450px'
          }}
        >
          <SearchDish />
          <PayPage />
          {
            searchStatus === false && showPay === false ? (
              <div className={styles.dishes}>
                {
                  selectedMenuList && selectedMenuList.length > 0
                    ? selectedMenuList.slice((currentPage - 1) * STOREPAGESIZE, currentPage * STOREPAGESIZE).map((dish: any) => {
                      return (
                        <Helper key={dish.product_id} data={dish} >
                          <div 
                            className={numeral(dish.inventory).value() === 0
                              ? styles.emptyDish
                              : styles.dish}
                          >
                            {
                              numeral(dish.inventory).value() === 0
                              ? <div className={styles.mask} >
                                  <div>已售罄</div>
                                </div>
                              : ''
                            }
                            <span>{dish.product_name}</span>
                            <span>￥{numeral(dish.price).format('0.00')}</span>
                          </div>
                        </Helper>
                      );
                    })
                    : ''
                }
              </div>
            ) : ''
          }
          {
            searchStatus === false && showPay === false ? (
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  size="small" 
                  total={selectedMenuList.length}
                  pageSize={STOREPAGESIZE}
                  hideOnSinglePage={true}
                  onChange={this.onChangePageHandle}
                />  
              </div>
            ) : ''
          }
        </Item>
        <Item position="left">
          <LeftBar headers={headers} contents={contents} footers={footers}/>
          {
            showPay === false ? (
              <ItemBar>
                {
                  ItemBarData.map((item: SmallCardProps, index: number) => {
                    if (item.img || item.render) {
                      return (<SmallCard key={index} {...item}/>);
                    } else {
                      return '';
                    }
                  })
                }
              </ItemBar>
            ) : ''
          }
        </Item>
        {
          searchStatus === false && showPay === false ? (
            <Item position="right">
              <div className={styles.right}>
                <div className={styles.search}>
                  <span className={styles.searchIcon} />
                  <span onClick={() => this.onSearchHandle()}>搜索</span>
                </div>
                {menuTp && menuTp.length > 0 ?
                  menuTp.map((menutp: any) => {
                    return (
                      <div
                        key={menutp.menutp_id}
                        className={selectedMenu && selectedMenu.menutp_id === menutp.menutp_id ? styles.activeArea : styles.normalArea}
                        onClick={() => this.changeMenuTp(menutp)}
                      >
                        {selectedMenu && selectedMenu.menutp_id === menutp.menutp_id ? <div className={styles.active} /> : ''}
                        {menutp.menutp_name}
                      </div>
                    );
                  })
                  : ''}
              </div>
            </Item>
          ) : ''
        }
        
      </Layout>
    );
  }
}

const mapStateToProps = (state: Stores) => {
  const { list, currentCartId }: GetCurrentCartListReturn = GetCurrentCartList(state);
  return {
    menu: GetMenuList(state),
    menuTp: GetMenutp(state),
    selectedMenuList: GetSelectedMenuList(state),
    selectedMenu: GetSelectedMenu(state),
    list,
    currentCartId,
    currentDish: GetCurrentDish(state),
    selectedTable: GetSelecetedTable(state),
    calledNumber: GetCalledNumber(state),
    searchStatus: GetSearchStatus(state),
    showPay: GetShowPay(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<MenuActions | BusinessActions>) => ({
  dispatch,
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  fetchStoreData: bindActionCreators(BusinessController.fetchStoreData, dispatch),
  setSelectedMenutp: bindActionCreators(BusinessController.setSelectedMenutp, dispatch),
  sendOrder: bindActionCreators(OrderController.sendOrder, dispatch),
  emptyCart: bindActionCreators(CartController.emptyCart, dispatch),
  changeModalHandle: bindActionCreators(StatusController.changeTableModalStatus, dispatch),
  manageMenu: bindActionCreators(OrderController.manageMenu, dispatch),
  getCalledNumber: bindActionCreators(OrderController.getCalledNumber, dispatch),
  sendOrderV2: bindActionCreators(OrderController.sendOrderV2, dispatch),
  setPayOrder: bindActionCreators(OrderController.setPayOrder, dispatch),
  deleteItem: bindActionCreators(CartController.deleteItem, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Store);
