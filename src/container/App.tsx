/**
 * created by Ghan 9.13
 * 
 * 首页
 * @todo 展示各个模块的入口
 */
import * as React from 'react';
import styles from './index.less';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps } from '../common/config';
/**
 * interface
 */
import SignController, { SignActions } from '../action/sign';
import { GetUserinfo } from '../store/sign';
import { Stores } from '../store/index';
import history from '../history';

interface AppProps {
  dispatch?: Dispatch;
  getUserinfo?: (mchnt_cd: string) => void;
  userinfo?: any;
}
interface AppState {}

class App extends React.Component<AppProps, AppState> {

  componentDidMount() {
    // this.getUserinfo();
  }

  /**
   * 获取用户信息
   *
   * @memberof App
   */
  public getUserinfo = () => {
    const { getUserinfo } = this.props;
    if (getUserinfo) {
      getUserinfo('60000000200');
    }
  }

  /**
   * @todo 跳转函数
   * @param { route } string
   *
   * @memberof App
   */
  public onNavHandle = (route: string) => {
    history.push(`${route}`);
  }

  public render() {
    const { userinfo } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.item}>{userinfo.mchnt_name || '加载中'}</div>
        <div className={styles.item} onClick={() => this.onNavHandle(`/meal/${userinfo.mchnt_cd}`)}>点餐</div>
        <div className={styles.item} onClick={() => this.onNavHandle(`/store/${userinfo.mchnt_cd}`)}>外卖</div>
        <div className={styles.item} onClick={() => this.onNavHandle('/orderlist')}>订单</div>
        <div className={styles.item}>加菜</div>
        <div className={styles.item}>收银</div>
        <div className={styles.item}>排队</div>
        <div className={styles.item}>估清</div>
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  userinfo: GetUserinfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<SignActions>) => ({
  dispatch,
  getUserinfo: bindActionCreators(SignController.getUserinfo, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
