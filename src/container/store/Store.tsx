import * as React from 'react';
import numeral from 'numeral';
import { ListView } from 'antd-mobile';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenuList, GetMenutp, GetSelectedMenu } from '../../store/menu';
import MenuController, { MenuActions } from '../../action/menu';
import BusinessController, { BusinessActions } from '../../action/business';
import styles from './index.less';
import Helper from '../../component/Helper';

const SECTIONHEADERHEIGHT: number = 44;
const MENUITEMHEIGHT: number = 92;

const MyBody = (props: any) => {
  return (
    <div
      style={{
      width: '100%',
      height: '100%',
    }}
      className={`am-list-body ${styles.listBody}`}
    >
      {props.children}
    </div>
  );
};
interface StoreProps {
  menu: any;
  menuTp: any;
  dispatch: Dispatch;
  match: { params: { id: string } };
  selectedMenu: any;
  getMenuTp: (mchnt_cd: string) => void;
  fetchStoreData: (mchnt_cd: string) => void;
  setSelectedMenutp: (menuid: string) => void;
}
interface StoreState {
  menuDataSource: any;
  menuTpDataSource: any;
}
class Store extends React.Component<StoreProps, StoreState> {
  /**
   * @param { menuRef MenuListView 的ref scrollTo 用 }
   */
  private menuRef: any;

  constructor (props: StoreProps) {
    super(props);
    this.state = {
      menuDataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2,
        sectionHeaderHasChanged: (s1: any, s2: any) => s1 !== s2,
      }),
      menuTpDataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2,
      }),
    };
  }

  componentWillReceiveProps(nextProps: any) {
    const { menu, menuTp } = nextProps;
    if (menu !== this.props.menu) {
      this.setState({
        menuDataSource: this.state.menuDataSource.cloneWithRowsAndSections(menu),
      });
    }

    if (menuTp !== this.props.menuTp) {
      this.setState({
        menuTpDataSource: this.state.menuTpDataSource.cloneWithRows(menuTp),
      });
    }
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
   * @todo 挂载onscroll
   * @param { scrollTop 距离顶部的距离先计算 然后左侧菜单对应 }
   * @memberof Store
   */
  public onScroll = (event: any) => {
    const { menuTp, setSelectedMenutp } = this.props;
    const { target: { scrollTop } } = event;

    if (scrollTop === 0) {
      setSelectedMenutp(menuTp[0].menutp_id);
    } else if (scrollTop > 0) {
      let height = 0;
      for (let index = 0; index < menuTp.length; index++) {
        height += SECTIONHEADERHEIGHT;
        height += menuTp[index].menutp_num * MENUITEMHEIGHT;
        if (scrollTop < height) {
          setSelectedMenutp(menuTp[index].menutp_id);
          return;
        }
      }
    }
  }

  /**
   * @todo 切换菜单
   * @param { menutp 在菜单中找到 menutp 的位置然后跳转 }
   * @memberof Store
   */
  public changeMenuTp = (tp: any) => {
    const { menuTp, setSelectedMenutp } = this.props;
    
    const index = menuTp.findIndex((item: any) => item.menutp_id === tp.menutp_id);

    if (index !== -1) {
      let beforeHeight = 0;

      for (let i = 0; i < index; i++) {
        beforeHeight += SECTIONHEADERHEIGHT;
        beforeHeight += MENUITEMHEIGHT * menuTp[i].menutp_num;
      }

      setSelectedMenutp(tp.menutp_id);
      this.menuRef.scrollTo(0, beforeHeight);
    }
  }

  public render() {
    return (
      <div className={`${styles.container} ${styles.store}`}>
        <ListView
          dataSource={this.state.menuTpDataSource}
          renderRow={this.renderMenuTpRow}
          renderBodyComponent={() => <MyBody />}
          className={styles.menutp}
          pageSize={20}
          style={{
            height: `${document.documentElement.clientHeight}px`,
            overflow: 'auto',
          }}
        />
        <ListView
          ref={(menuRef) => { this.menuRef = menuRef; }}
          dataSource={this.state.menuDataSource}
          renderSectionHeader={this.renderMenuSectionHeader}
          renderRow={this.renderMenuRow}
          renderBodyComponent={() => <MyBody />}
          className={styles.menu}
          initialListSize={100}
          pageSize={20}
          scrollEventThrottle={100}
          onScroll={this.onScroll}
          style={{
            height: `${document.documentElement.clientHeight}px`,
            overflow: 'auto',
          }}
        />
      </div>
    );
  }

  private renderMenuRow = (item: any): React.ReactElement<any> => {
    return (
      <div
        key={item.product_id}
        className={styles.item}
      >
        <div className={styles.img}>
          <div style={{backgroundImage: `url(${config.DEFAULT_PICTURE_LING})`}} />
        </div>
        <div className={styles.wrap}>
          <div className={styles.wrapDiv}>
            <div className={styles.productName}>{item.product_name}</div>
            <div>{numeral(item.price).format('0.00')}</div>
            <Helper data={item} />
          </div>
        </div>
      </div>
    );
  }

  private renderMenuTpRow = (item: any) => {
    const { selectedMenu } = this.props;
    return (
      <div
        key={item.menutp_id}
        className={`
          ${styles.menuTpItem} 
          ${item.menutp_id === selectedMenu.menutp_id ? styles.menuTpActive : styles.menuTpNormal}
        `}
        onClick={() => this.changeMenuTp(item)}
      >
        {item.menutp_name}
      </div>
    );
  }

  private renderMenuSectionHeader = (data: any, key: string) => {
    const { menuTp } = this.props;
    const tp = menuTp.find((item: any) => item.menutp_id === key);
    return (
      <div>{tp && tp.menutp_name}</div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  menu: GetMenuList(state),
  menuTp: GetMenutp(state),
  selectedMenu: GetSelectedMenu(state),
});

const mapDispatchToProps = (dispatch: Dispatch<MenuActions | BusinessActions>) => ({
  dispatch,
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  fetchStoreData: bindActionCreators(BusinessController.fetchStoreData, dispatch),
  setSelectedMenutp: bindActionCreators(BusinessController.setSelectedMenutp, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Store);
