import history from '../../history';
import * as React from 'react';
import { connect } from 'react-redux';
import { Stores } from '../../store';
import { GetUserinfo } from '../../store/sign';
import { Dispatch } from 'redux';

// interface PushState {
//   (data: any): void;
// }

interface AuthRouteProps {
  isAuthenticated: any;
  dispatch?: Dispatch;
}

const authHelper = (params: any): boolean => {
  return false;
};

const RequireAuthComponent = (Component: any) => {

  class AuthRoute extends React.Component <AuthRouteProps, {}> {

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps = () => {
      this.checkAuth();
    }

    /**
     * 这里出错了
     */
    public navToLogin = () => {
      history.push('', '/login');
    }

    public checkAuth = () => {
      console.log('!authHelper(this.props.isAuthenticated): ', !authHelper(this.props.isAuthenticated));
      if (!authHelper(this.props.isAuthenticated)) {
        this.navToLogin();
      }
    }

    public render () {
      console.log('this.props : ' , this.props);
      return (
        <div>
          {
            authHelper(this.props.isAuthenticated) ? (
              <Component {...this.props} />
            ) : null
          }
        </div>
      );
    }
  }

  const mapStateToProps = (state: Stores) => ({
    isAuthenticated: GetUserinfo(state),
  });

  return connect(mapStateToProps)(AuthRoute);
};

export { RequireAuthComponent };