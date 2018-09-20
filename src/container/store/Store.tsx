import * as React from 'react';
import { ListView } from 'antd-mobile';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import config, { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenuList, GetMenutp } from '../../store/menu';
import MenuController, { MenuActions } from '../../action/menu';
import BusinessController, { BusinessActions } from '../../action/business';
import styles from './index.less';

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
  getMenuTp: (mchnt_cd: string) => void;
  fetchStoreData: (mchnt_cd: string) => void;
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
   *
   * @memberof Store
   */
  public onScroll = (event: any) => {
    const { target: { scrollTop } } = event;

    if (scrollTop) {
      console.log('scrollTop: ', scrollTop);
    }
    console.log('e.event: ', event);
  }

  /**
   * @todo 切换菜单
   * @param { menutp 在菜单中找到 menutp 的位置然后跳转 }
   * @memberof Store
   */
  public changeMenuTp = (tp: any) => {
      const { menuTp } = this.props;

      const index = menuTp.findIndex((item: any) => item.menutp_id === tp.menutp_id);

      if (index !== -1) {
        let beforeHeight = 0;

        for (let i = 0; i < index; i++) {
          beforeHeight += SECTIONHEADERHEIGHT;
          beforeHeight += MENUITEMHEIGHT * menuTp[i].menutp_num;
        }

        console.log('beforeHeight: ', beforeHeight);

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
          pageSize={8}
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
          pageSize={8}
          style={{
            height: `${document.documentElement.clientHeight}px`,
            overflow: 'auto',
          }}
          onScroll={this.onScroll}
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
          </div>
        </div>
      </div>
    );
  }

  private renderMenuTpRow = (item: any) => {
    return (
      <div
        key={item.menutp_id}
        className={`${styles.menuTpItem} ${styles.menuTpNormal}`}
        onClick={() => this.changeMenuTp(item)}
      >
        {item.menutp_name}
      </div>
    );
  }

  private renderMenuSectionHeader = (data: any, key: string) => {
    const { menuTp } = this.props;
    const tp = menuTp.find((item: any) => item.menutp_id === key);
    console.log('tp: ', tp);
    return (
      <div>{tp && tp.menutp_name}</div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  menu: GetMenuList(state),
  menuTp: GetMenutp(state),
});

const mapDispatchToProps = (dispatch: Dispatch<MenuActions | BusinessActions>) => ({
  dispatch,
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  fetchStoreData: bindActionCreators(BusinessController.fetchStoreData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Store);
