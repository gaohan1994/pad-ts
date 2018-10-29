import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './index.less';
import { Layout, Spin } from 'antd';
import Menus from 'src/component/Menus';
import { Stores } from '../../store/index';
import { GetLoading, GetShowLogin } from '../../store/status';
import { mergeProps } from 'src/common/config';
import Login from '../../container/sign/Login';
import SignController, { SignActions } from '../../action/sign';

import { GetUserinfo } from '../../store/sign';

const { Sider, Content, Header } = Layout;

interface LayoutPageProps {
  loading?: boolean;
  showLogin?: boolean;
  userinfo?: any;
  webLogout?: () => void;
}

/**
 * @todo 1.从 localstorage 和 redux 中拿出信息看看有没有用户信息如果没有显示登录，如果有那么正常走
 *
 * @class LayoutPage
 * @extends {React.Component<LayoutPageProps, {}>}
 */
class LayoutPage extends React.Component<LayoutPageProps, {}> {

  public onStoreClickHandle = () => {
    const { webLogout } = this.props;
    if (webLogout) {
      webLogout();
    }
  }

  public render() {
    const { 
      loading,
      // showLogin,
      userinfo,
    } = this.props;

    // if (showLogin === false) {

    if (userinfo.mchnt_cd) {
      return (
        <Layout
          className={styles.container}
        >
          <Header className={styles.header}>
            <div className={styles.icon} style={{backgroundImage: `url(//net.huanmusic.com/llq/menu_icon_dinein.png)`}}/>
            <span className={styles.text} onClick={this.onStoreClickHandle}>测试店家</span>  
          </Header>
          <Layout>
            <Sider
              trigger={null}
              collapsible={true}
              className={styles.sider}
            >
              <Menus />
            </Sider>
            <Content>
              <Spin size="large" spinning={loading} >{this.props.children}</Spin>
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      return (
        <Login />
      );
    }
  }
}

const mapStateToProps = (state: Stores) => ({
  loading: GetLoading(state),
  showLogin: GetShowLogin(state),
  userinfo: GetUserinfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<SignActions>) => ({
  webLogout: bindActionCreators(SignController.webLogout, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LayoutPage);
