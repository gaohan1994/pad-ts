import React from 'react';
import { connect } from 'react-redux';
import { Stores } from '../../store/index';
import { GetMchntInfo } from '../../store/sign';
import { Dispatch } from 'redux';
import { mergeProps } from '../../common/config';
import { Route, Redirect, RouteProps } from 'react-router';

interface AuthRouteProps extends RouteProps {
  mchntInfo?: any;
  dispatch?: Dispatch;
  redirectPath?: string;
}

/**
 * @todo 
 * -- 1 --
 * 判断 redux 中内是否有商户信息如果有则正常跳转如果没有那么走2
 * -- 2 --
 * 如果没有那么去 localstorage 中查找如果有那么存入 redux 中然后正常跳转 如果没有走 3
 * -- 3 --
 * 如果 localstorage 中也没有那么跳转到登录
 * 
 * @class AuthRoute
 * @extends {React.PureComponent<AuthRouteProps, {}>}
 */
class AuthRoute extends React.PureComponent<AuthRouteProps, {}> {

  public render () {
    const {
      mchntInfo,
      component,
      redirectPath = '/exception/404',
      ...rest
    } = this.props;

    if (mchntInfo && typeof mchntInfo.mchnt_cd === 'string') {
      return (
        <Route component={component} {...rest} />
      );
    } else {
      return (
        <Route {...rest} render={() => (<Redirect to={{ pathname: redirectPath }}/>)}/>
      );
    }
  }
}

const mapStateToProps = (state: Stores) => ({
  mchntInfo: GetMchntInfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AuthRoute);