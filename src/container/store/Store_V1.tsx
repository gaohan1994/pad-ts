import * as React from 'react';
// import numeral from 'numeral';
/**
 * react-redux
 */
import { connect } from 'react-redux';
// import { Dispatch, bindActionCreators } from 'redux';
// import config, { mergeProps } from '../../common/config';
// import { Stores } from '../../store';
// import { GetMenuList, GetMenutp, GetSelectedMenu } from '../../store/menu';
// import MenuController, { MenuActions } from '../../action/menu';
// import BusinessController, { BusinessActions } from '../../action/business';
// import styles from './index.less';
import Menus from 'src/component/Menus';
// import Helper from '../../component/Helper';
// import OrderController from '../../action/order';

class Store extends React.Component {
  state = {  };
  
  render() {
    return (
      <div>
        <Menus />
      </div>
    );
  }
}

export default connect()(Store);