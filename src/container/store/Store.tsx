import * as React from 'react';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Pagination } from 'antd';
import config, { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenuList, GetMenutp, GetSelectedMenu, GetSelectedMenuList } from '../../store/menu';
import MenuController, { MenuActions } from '../../action/menu';
import BusinessController, { BusinessActions } from '../../action/business';
import CartController from '../../action/cart';
import Layout, { SmallCardProps } from '../../component/basicLayout/Layout';
import styles from './store.less';
import Helper from '../../component/Helper/Helper_V1';
import OrderController from '../../action/order';
import LeftBar, { HeadersData, FootersData, ContentsData } from '../../component/LeftBar/LeftBar';
import { GetCurrentCartList, GetCurrentDish, GetCurrentCartListReturn } from '../../store/cart';
import { GetSelecetedTable } from '../../store/table';
import StatusController from '../../action/status';
import TableModal from '../../component/TableModal/TableModal';

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
  getMenuTp: (mchnt_cd: string) => void;
  fetchStoreData: (mchnt_cd: string) => void;
  setSelectedMenutp: (menuid: string) => void;
  sendOrder: () => void;
  emptyCart: () => void;
  changeModalHandle: (params: any) => void;
}

/**
 * @param {changeTableModal} string 显示换桌modal
 * @interface StoreState
 */
interface StoreState { }
class Store extends React.Component<StoreProps, StoreState> {

  /**
   * 请求扫描出来的餐厅的数据保存到redux中去
   * 在接下来会使用到数据的地方都从redux中取
   *
   * @memberof Welcome
   */
  componentDidMount() {
    this.fetchData();
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
   * @memberof Store
   */
  public changeMenuTp = (tp: any) => {
    const { setSelectedMenutp } = this.props;
    setSelectedMenutp(tp.menutp_id);
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

    if (selectedDish && selectedDish.product_id) {
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
   * @todo left bar item click handle callback from LeftBar
   *
   * @memberof Store
   */
  public onLeftBarClickHandle = (param: any) => {
    const { data, currentAttr } = param;
    let currentDataParam: any = { product_id: data.product_id };
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
    console.log('showChangeTableModal: ');
    const { changeModalHandle } = this.props;

    const param = { changeTableModalStatus: true };

    changeModalHandle(param);
  }

  public render() {
    const {
      list,
      menuTp,
      selectedMenu,
      selectedMenuList,
      currentCartId,
      selectedTable,
    } = this.props;

    const { tableOrder } = selectedTable;

    const headers: HeadersData = currentCartId === config.TAKEAWAYCARTID ? {
      data: [
        [{ key: '1', title: '订单号：', value: tableOrder && tableOrder.order_no || '' }],
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
        { itemIcon: '//net.huanmusic.com/llq/icon_mima.png', list, onClick: this.onLeftBarClickHandle },
        { itemIcon: '//net.huanmusic.com/llq/icon_mima.png', list: tableOrder && tableOrder.data || [], onClick: this.onLeftBarClickHandle },
      ],
    };

    const footers: FootersData = {
      // remarks: '整单备注：123123123',
      detail: [
        [
          { key: '1', title: '餐位费：', value: '' }, 
          { key: '1-2', title: '', value: '￥8.99'},
        ],
        [
          { key: '2', title: '合计：', value: '' }, 
          { key: '3', title: '', value: '￥160.99' },
        ]
      ],
      buttons: [
        {
          style: { background: '#474747' },
          values: ['结账', '188.00'],
          onClick: () => { console.log('hello'); },
        },
        {
          values: ['下单'],
          onClick: () => { console.log('order'); },
        },
      ]
    };

    const ItemBarData: SmallCardProps[] = [
      tableOrder && tableOrder.table_no ? {
        img: '//net.huanmusic.com/llq/icon_huanzhuo.png',
        value: '换桌',
        onClick: () => this.showChangeTableModal(),
      } : {},
      tableOrder && tableOrder.people_num ? {
        img: '//net.huanmusic.com/llq/icon_renshu.png',
        value: '修改人数'
      } : {},
      {
        img: '//net.huanmusic.com/llq/icon_houchu.png',
        value: '重打后厨'
      },
      {
        img: '//net.huanmusic.com/llq/icon_houchu.png',
        value: '重打前台'
      },
      {
        render: this.renderHelper,
      },
      {
        img: '//net.huanmusic.com/llq/icon_lajitong.png',
        value: '删除'
      },
      // {
      //   img: '//net.huanmusic.com/llq/icon_houchu.png',
      //   value: '整单备注'
      // },
      {
        img: '//net.huanmusic.com/llq/icon_gouwuche.png',
        value: '清空购物车',
        onClick: () => this.emptyCart(),
      },
    ];

    return (
      <Layout>
        <TableModal />
        <Item position="main" style={{marginLeft: '340px'}}>
          <div className={styles.dishes}>
            {
              selectedMenuList && selectedMenuList.length > 0
                ? selectedMenuList.map((dish: any) => {
                  return (
                    <Helper key={dish.product_id} data={dish} >
                      <div className={styles.dish}>
                        <span>{dish.product_name}</span>
                        <span>￥{numeral(dish.price).format('0.00')}</span>
                      </div>
                    </Helper>
                  );
                })
                : ''
            }
          </div>
          <div className={styles.pagination}>
            <Pagination size="small" total={selectedMenuList.length}/>  
          </div>
        </Item>
        <Item position="left">
          <LeftBar headers={headers} contents={contents} footers={footers}/>
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
        </Item>
        <Item position="right">
          <div className={styles.right}>
            <div className={styles.search}>
              <span className={styles.searchIcon} />
              <span>搜索</span>
            </div>
            {menuTp && menuTp.length > 0 ?
              menuTp.map((menutp: any) => {
                return (
                  <div
                    key={menutp.menutp_id}
                    className={selectedMenu.menutp_id === menutp.menutp_id ? styles.activeArea : styles.normalArea}
                    onClick={() => this.changeMenuTp(menutp)}
                  >
                    {selectedMenu.menutp_id === menutp.menutp_id ? <div className={styles.active} /> : ''}
                    {menutp.menutp_name}
                  </div>
                );
              })
              : ''}
          </div>
        </Item>
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
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Store);
