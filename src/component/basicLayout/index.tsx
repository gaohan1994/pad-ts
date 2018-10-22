import * as React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import styles from './index.less';
import { Layout, Spin } from 'antd';
import Menus from 'src/component/Menus';
import { Stores } from '../../store/index';
import { GetLoading } from '../../store/status';
import { mergeProps } from 'src/common/config';

const { Sider, Content, Header } = Layout;

interface LayoutPageProps {
  loading?: boolean;
}
class LayoutPage extends React.Component<LayoutPageProps, {}> {

  public onNavHandle = (route: string) => {
    history.push(`${route}`);
  }

  public render() {
    const { loading } = this.props;
    return (
      <Layout
        className={styles.container}
      >
        <Header className={styles.header}>
          <div className={styles.icon} style={{backgroundImage: `url(//net.huanmusic.com/llq/menu_icon_dinein.png)`}}/>
          <span className={styles.text}>测试店家</span>  
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
  }
}

const mapStateToProps = (state: Stores) => ({
  loading: GetLoading(state),
});

export default connect(mapStateToProps, () => ({}), mergeProps)(LayoutPage);
