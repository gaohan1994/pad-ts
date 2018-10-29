import React, { Component } from 'react';
import { connect, Dispatch } from 'react-redux';
import { mergeProps } from 'src/common/config';
import { Stores } from '../../store';
import styles from './styles.less';
import StatusController, { StatusAtions } from '../../action/status';
import SignController from '../../action/sign';
import Validator from '../../common/validator';
import Base from '../../action/base';
import { bindActionCreators } from 'redux';
import Secure, { DoEncryReturn } from '../../common/secure';

interface CheckDataResult {
  success?: boolean;
  error?: any;
}
interface LoginPageProps { 
  dispatch?: Dispatch<StatusAtions>;
  webLogin?: (param: any) => void;
}

interface LoginPageState {
  username: string;
  password: string;
}
class LoginPage extends Component<LoginPageProps, LoginPageState> {
  state = {
    username: '',
    password: '',
  };

  public onHideLoginPage = () => {
    const { dispatch } = this.props;
    StatusController.changeLoginStatus({ dispatch, showLogin: false });
  }

  public onChangeUsernameHandle = ({ target: { value } }: any) => {
    this.setState({
      username: value
    });   
  }

  public onChangPasswordHandle = ({ target: { value } }: any) => {
    this.setState({
      password: value
    });
  }

  public checkData = async (): Promise<CheckDataResult> => {
    const { username, password } = this.state;
    const validator = new Validator();

    validator.add(username, [{
      strategy: 'isNonEmpty',
      errorMsg: '请输入用户账号~',
      elementName: 'username',
    }]);

    validator.add(password, [{
      strategy: 'isNonEmpty',
      errorMsg: '请输入密码~',
      elementName: 'password',
    }]);

    validator.add(username, [{
      strategy: 'isNumberVali',
      errorMsg: '用户账号格式不正确~',
      elementName: 'username',
    }]);

    const result = await validator.start();

    if (result) {
      Base.toastFail(`${result.errMsg}`);
      return { success: false, error: result };
    } else {
      return { success: true };
    }
  }

  public onLoginButtonClickHandle = async () => {
    const { success }: CheckDataResult = await this.checkData();
    const { username, password } = this.state;
    const { webLogin } = this.props;

    /**
     * @param {success} 是否校验成功 成功登录
     */
    if (success === true && webLogin) {
      const { success: encrySuccess, value }: DoEncryReturn = Secure.doEncry({ value: password });
      console.log('encrySuccess: ', encrySuccess);
      console.log('value: ', value);
      if (encrySuccess === true) {
        const params = { user_id: username, passwd: value };
        webLogin(params);
      } else {
        Base.toastFail('加密失败~');
      }
    }
  }

  render() {
    const { username, password } = this.state;

    const inputData = [
      {
        title: 'username',
        value: username,
        icon: 'http://net.huanmusic.com/llq/icon_user.png',
        placeholder: '请输入用户账号',
        onChange: this.onChangeUsernameHandle
      },
      {
        title: 'password',
        value: password,
        icon: 'http://net.huanmusic.com/llq/icon_mima.png',
        placeholder: '请输入用户密码',
        type: 'password',
        onChange: this.onChangPasswordHandle
      },
    ];

    return (
      <div className={styles.container}>
        <div className={styles.bg}/>
        <div className={styles.box}>
          <div className={styles.title}>登录</div>
          {
            inputData.map((item: any) => {
              return (
                <div key={item.title} className={styles.inputBox}>
                  <span className={styles.inputIcon} style={{backgroundImage: `url(${item.icon})`}}/>
                  <input
                    value={item.value}
                    className={styles.input}
                    placeholder={item.placeholder}
                    onChange={item.onChange}
                    type={item.type || 'text'}
                  />
                </div>
              );
            })
          }
          <div className={styles.button} onClick={this.onLoginButtonClickHandle}>登录</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  
});

const mapDispatchToProps = (dispatch: Dispatch<StatusAtions>) => ({
  dispatch,
  webLogin: bindActionCreators(SignController.webLogin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LoginPage);
