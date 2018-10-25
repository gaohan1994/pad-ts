import * as React from 'react';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Pagination } from 'antd';
import /** config, */ { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenuList, GetMenutp, GetSelectedMenu, GetSelectedMenuList } from '../../store/menu';
import MenuController, { MenuActions } from '../../action/menu';
import BusinessController, { BusinessActions } from '../../action/business';
import CartController, { CallbackParam } from '../../action/cart';
import Layout, { SmallCardProps } from '../../component/basicLayout/Layout';
import styles from './store.less';
import Helper from '../../component/Helper/Helper_V1';
import OrderController from '../../action/order';
import LeftBar, { HeadersData, FootersData, ContentsData } from '../../component/LeftBar/LeftBar';
import { GetCurrentCartList, GetCurrentDish } from '../../store/cart';

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
  getMenuTp: (mchnt_cd: string) => void;
  fetchStoreData: (mchnt_cd: string) => void;
  setSelectedMenutp: (menuid: string) => void;
  sendOrder: () => void;
  emptyCart: () => void;
}

/**
 * @param {currentDish} 点击左边的菜品设置成当前菜品 { product_id: string, currentAttr?: any }
 *
 * @interface StoreState
 */
interface StoreState {

}
class Store extends React.Component<StoreProps, StoreState> {
  constructor(props: StoreProps) {
    super(props);
    this.state = { };
  }
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

    const { currentAttr } = currentDish;

    let selectedDish: any = {};

    if (list && list.length > 0 && currentDish.product_id) {
      selectedDish = list.find((d: any) => d.product_id === currentDish.product_id);
    } else {
      selectedDish = {};
    }

    if (selectedDish.product_id) {
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
   *
   * @memberof Store
   */
  public setCurrentDish = (data: any) => {
    this.setState({
      currentDish: data,
    });
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

  public render() {
    const {
      list,
      menuTp,
      selectedMenu,
      selectedMenuList,
    } = this.props;

    const headers: HeadersData = {
      data: [
        [{ key: '1', title: '订单号', value: '123123' }],
        [{ key: '2', title: '桌号', value: '1' }, { key: '3', title: '用餐人数', value: '3人' }]
      ]
    };

    const contents: ContentsData = {
      data: [{ itemIcon: '//net.huanmusic.com/llq/icon_mima.png', list, }],
      // onClick: this.onLeftBarClickHandle
    };

    const footers: FootersData = {
      remarks: '整单备注：123123123',
      detail: [
        [{ key: '1', title: '餐位费：', value: '' }, { key: '1-2', title: '', value: '￥8.99'}],
        [{ key: '2', title: '合计：', value: '' }, { key: '3', title: '', value: '￥160.99' }]
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
        img: '//net.huanmusic.com/llq/icon_houchu.png',
        value: '删除'
      },
      {
        img: '//net.huanmusic.com/llq/icon_houchu.png',
        value: '整单备注'
      },
      {
        img: '//net.huanmusic.com/llq/icon_houchu.png',
        value: '清空购物车',
        onClick: () => this.emptyCart(),
      },
    ];

    return (
      <Layout>
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
                return (<SmallCard key={index} {...item}/>);
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
  const { list } = GetCurrentCartList(state);
  return {
    menu: GetMenuList(state),
    menuTp: GetMenutp(state),
    selectedMenuList: GetSelectedMenuList(state),
    selectedMenu: GetSelectedMenu(state),
    list,
    currentDish: GetCurrentDish(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<MenuActions | BusinessActions>) => ({
  dispatch,
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  fetchStoreData: bindActionCreators(BusinessController.fetchStoreData, dispatch),
  setSelectedMenutp: bindActionCreators(BusinessController.setSelectedMenutp, dispatch),
  sendOrder: bindActionCreators(OrderController.sendOrder, dispatch),
  emptyCart: bindActionCreators(CartController.emptyCart, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Store);
