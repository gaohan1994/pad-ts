import * as React from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import styles from './index.less';

const { Item: MenuItem } = Menu;

const menusData = [
  {
    key: '1',
    value: '点餐'
  },
  {
    key: '2',
    value: '外带'
  },
  {
    key: '3',
    value: '订单'
  },
];

class Menus extends React.Component {
  state = { };
  
  render() {
    return (
      <div>
        <Menu
          className={styles.container}  
        >
          {
            menusData.map((menu: any) => (
              <MenuItem key={menu.key}>
                <span>{menu.value}</span>
              </MenuItem>
            ))
          }
        </Menu>
      </div>
    );
  }
}

export default connect()(Menus);