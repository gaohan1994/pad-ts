import * as React from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { Navigate, mergeProps } from 'src/common/config';
import { Stores } from '../../store/index';
import { GetUserinfo } from '../../store/sign';
import { ClickParam } from 'antd/lib/menu';
import styles from './index.less';

const { Item: MenuItem } = Menu;

interface MenusProps { 
  userinfo?: any;
}

interface MenusItem {
  key: string; 
  value: string;
  value_us: string;
  img: string;
  handle: () => void;
}

class Menus extends React.Component<MenusProps, {}> {
  /**
   * @param { menusData: init menusData in constructor }
   */
  private menusData: MenusItem[] = [];

  /**
   * @todo Creates an instance of Menus.
   * @param {MenusProps} props
   * @memberof Menus
   */
  constructor (props: MenusProps) {
    super(props);
    this.menusData = [
      {
        key: '1',
        value: '点餐',
        value_us: 'DINE IN',
        img: '//net.huanmusic.com/llq/menu_icon_dinein.png',
        handle: () => this.onNavHandle('meal')
      },
      {
        key: '2',
        value: '外带',
        value_us: 'TAKE AWAY',
        img: '//net.huanmusic.com/llq/menu_icon_dinein.png',
        handle: () => this.onNavHandle('store')
      },
      {
        key: '3',
        value: '订单',
        value_us: 'ORDER FORM',
        img: '//net.huanmusic.com/llq/menu_icon_dinein.png',
        handle: () => this.onNavHandle('order')
      },
    ];
  }
  
  /**
   * @param { type: string - item navigate type one of 'meal' 'store' 'order' } type
   *
   * @memberof Menus
   */
  public onNavHandle = (type?: string) => {
    const { userinfo: { mchnt_cd } } = this.props;
    
    let route: string = '';

    switch (type) {
      case 'meal':
        route = `/table/${mchnt_cd}`;
        break;
      case 'store':
        route = `/store/${mchnt_cd}`;
        break;
      case 'order':
        route = `/orderlist`;
        break;
      default:
        break;
    }
    Navigate.navto(route);
  }

  /**
   * @todo when click, find the clicked item by key and execute this item's click handle
   * @param { params: ClickParam antd click function callback payload typed } params
   *
   * @memberof Menus
   */
  public onMenuClickHandle = (params: ClickParam) => {
    const { key } = params;
    const item = this.menusData.find(m => m.key === key);
    if (item) {
      item.handle();
    }
  }

  render() {

    return (
      <Menu onClick={this.onMenuClickHandle}>
        {
          this.menusData.map((menu: MenusItem) => (
            <MenuItem
              key={menu.key}
              className={styles.menu}
              style={{ padding: '0px !important' }}
            >
              <span style={{backgroundImage: `url(${menu.img})`}} className={styles.icon}/>
              <span>{menu.value}</span>
              <span style={{fontSize: '12px'}}>{menu.value_us}</span>
            </MenuItem>
          ))
        }
      </Menu>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  userinfo: GetUserinfo(state),
});

export default connect(mapStateToProps, () => ({}), mergeProps)(Menus);