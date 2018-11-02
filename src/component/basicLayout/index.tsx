import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './index.less';
import { Layout, Spin, Select } from 'antd';
import Menus from 'src/component/Menus';
import { Stores } from '../../store/index';
import { GetLoading, GetShowLogin } from '../../store/status';
import { mergeProps } from 'src/common/config';
import Login from '../../container/sign/Login';
import SignController, { SignActions } from '../../action/sign';

import { GetUserinfo, GetOperatorInfo } from '../../store/sign';

const { Sider, Content, Header } = Layout;
const { Option } = Select;

interface LayoutPageProps {
  loading?: boolean;
  showLogin?: boolean;
  userinfo?: any;
  opeartorInfo?: any;
  webLogout?: () => void;
}

/**
 * @todo 1.从 localstorage 和 redux 中拿出信息看看有没有用户信息如果没有显示登录，如果有那么正常走
 *
 * @class LayoutPage
 * @extends {React.Component<LayoutPageProps, {}>}
 */
class LayoutPage extends React.Component<LayoutPageProps, {}> {
  public onSelect = (type: string) => {
    const { webLogout } = this.props;
    switch (type) {
      case 'exit':
        if (webLogout) { webLogout(); }
        break;
      default:
        break;
    } 
  }

  public render() {
    const { 
      loading,
      userinfo,
      opeartorInfo,
    } = this.props;

    console.log('userinfo: ', userinfo);
    if (userinfo.mchnt_cd && opeartorInfo.user_id) {
      return (
        <Layout
          className={styles.container}
        >
          <Header className={styles.header}>
            <div className={styles.icon} style={{backgroundImage: `url(//net.huanmusic.com/llq/menu_icon_dinein.png)`}}/>
            <span className={styles.text}>测试店家</span>
            <div className={styles.user}>
              <Select 
                value={opeartorInfo.user_id}
                onSelect={this.onSelect}
                className="my-sign-select"
              >
                {/* <Option value="user_id">{opeartorInfo.user_id}</Option> */}
                <Option value="exit">退出</Option>
              </Select>
            </div>
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
  opeartorInfo: GetOperatorInfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<SignActions>) => ({
  webLogout: bindActionCreators(SignController.webLogout, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LayoutPage);
