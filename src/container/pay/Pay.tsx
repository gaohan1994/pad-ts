/**
 * @todo 结账页面
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QrcodeReact from 'qrcode.react';
import styles from './styles.less';
import { GetShowPay } from '../../store/status';
import { Stores } from '../../store';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps } from 'src/common/config';
import StatusController, { StatusAtions } from '../../action/status';
import OrderController, { PayOrderReturn, PayOrderParam } from '../../action/order';
import { GetPayOrder } from '../../store/order';
import numeral from 'numeral';
import config from '../../common/config';
import BusinessController from '../../action/business';
import { GetCurrentCartList, GetCurrentCartListReturn } from '../../store/cart';
import { Modal } from 'antd';

interface ShowPayQRcodeParams {
  url: string;
}
interface PayPageProps { 
  showPay?: boolean;
  dispatch?: Dispatch<StatusAtions>;
  payOrder?: any;
  list?: any[];
  currentCartId?: string;
  payOrderHandle?: (param: PayOrderParam) => PayOrderReturn;
  changeModuleHandle?: (type: 'meal' | 'store' | 'order') => void;
  getCalledNumber?: () => void;
}

interface PayPageState {
  currentInput: string;
  packValue: string;
  changeValue: string;
  showPayQRcode: boolean;
  payUrl: string;
}
/**
 * @todo 结账页面
 *
 * @class PayPage
 * @extends {Component<PayPageProps, {}>}
 */
class PayPage extends Component<PayPageProps, PayPageState> {
  state = {
    currentInput: '',
    packValue: '',
    changeValue: '',
    showPayQRcode: false,
    payUrl: '',
  };
  
  public onWxClickHandle = (): void => {
    console.log('onWxClickHandle: ');
  }

  public onCashClickHandle = (): void => {
    console.log('onCashClickHandle: ');
  }

  public onCardClickHandle = (): void => {
    console.log('onCardClickHandle: ');
  }

  public onPackValueHandle = ({ target: { value } }: any) => {
    this.setState({ packValue: this.checkInputAuth(value) });
  }
  public onChangeValueHandle = ({ target: { value } }: any) => {
    this.setState({ changeValue: this.checkInputAuth(value) });
  }

  public onShowPayQRcode = (params: ShowPayQRcodeParams) => {
    const { url } = params;

    this.setState({
      showPayQRcode: true,
      payUrl: url
    });
  }

  public onHidePayQRcode = () => {
    this.setState({
      showPayQRcode: false,
      payUrl: ''
    });
  }

  /**
   * @todo 关闭pay页面
   * @param {onPackValueHandle | onChangeValueHandle} 清空输入数据
   * @param {hidePay} 关闭pay页面
   * @param {recoverPayOrder} 删除所有 order 数据
   *
   * @memberof PayPage
   */
  public onClosePayHandle = (): void => {
    const { dispatch, currentCartId, changeModuleHandle, getCalledNumber } = this.props;
    this.onPackValueHandle({ target: { value: '' } });
    this.onChangeValueHandle({ target: { value: '' } });
    this.onHidePayQRcode();
    if (dispatch) { 

      if (currentCartId === config.TAKEAWAYCARTID) {
        /**
         * --- 外卖 ---
         * @param {currentCartId === config.TAKEAWAYCARTID}
         * @param {} 1.如果是外卖要把数据清理的更干净一些
         * @param {} 2.getCalledNumber 重新获取取餐号 
         * @param {} 3.changeModuleHandle 重新跳转到 store
         */
        OrderController.recoverPayOrder(dispatch);
        StatusController.hidePay(dispatch);
        if (changeModuleHandle && getCalledNumber) {
          getCalledNumber();
          changeModuleHandle('store');
        }
      } else {
        /**
         * --- 堂食 ---
         * @param {} 1.正常走逻辑
         */
        OrderController.recoverPayOrder(dispatch);
        StatusController.hidePay(dispatch); 
      }
    }
  }

  public onKeyboardClickHandle = (item: any): void => {
    const { currentInput } = this.state;

    if (item.value && currentInput !== '') {
      const { value } = item;
      let event: any = {};
      switch (currentInput) {
        case 'pack':
          const { packValue } = this.state;
          event = { target: { value: packValue + value } };
          this.onPackValueHandle(event);
          break;
        case 'change':
          const { changeValue } = this.state;
          event = { target: { value: changeValue + value } };
          this.onChangeValueHandle(event);
          break;
        default:
          break;
      }
    }
  }

  /**
   * @todo 设置当前 选中的 input 如果没有那么不能使用自带的键盘
   *
   * @memberof PayPage
   */
  public onFocusHandle = (type: string) => {
    this.setState({
      currentInput: type
    });
  }

  /**
   * @todo 点击结账按钮
   *
   * @memberof PayPage
   */
  public doPayOrderHandle = async () => {
    const { payOrder, payOrderHandle } = this.props;
    const params = { 
      order: payOrder,
      callback: this.payCallback
    };
    if (payOrderHandle) {
      await payOrderHandle(params);
    }
  }

  public payCallback = (result: PayOrderReturn) => {
    const { success, url } = result;
    if (success === true && url) {
      /**
       * @param {success === true} 成功拿到支付链接
       * @param {url} 支付链接
       */
      const showQRcodeParam: ShowPayQRcodeParams = { url };
      this.onShowPayQRcode(showQRcodeParam);
    }
  }

  render() {
    const { packValue, changeValue, showPayQRcode, payUrl } = this.state;
    const { showPay, payOrder } = this.props;
    const numbers = new Array(12).fill({}).map((_, index: number) => {
      
      if (index < 9) {

        return {
          key: index,
          value: `${index + 1}`
        };
      } else if (index === 9) {
        return {
          key: index,
          value: `.`
        };
      } else if (index === 10) {
        return {
          key: index,
          value: `0`
        };
      } else if (index === 11) {
        return {
          key: index,
          value: `00`
        };
      } else { return {}; }
    });
    if (showPay === true) {
      return (
        <div className={styles.container}>
          <Modal
            title="请扫描支付二维码"
            visible={showPayQRcode}
            footer={null}
            onCancel={this.onHidePayQRcode}
            centered={true}
            maskClosable={true}
            className="my-change-table-modal"
          >
            <div className={styles.qrcode}>
              <QrcodeReact value={payUrl} />
            </div>
            
          </Modal>
          
          <div className={styles.close} onClick={this.onClosePayHandle} />
          <div className={styles.calculator}>
            <div className={styles.total}>
              <span>
                应付金额
                <em>￥{numeral(payOrder.stdtrnsamt).format('0.00')}</em>
              </span>
            </div>
            <div className={styles.box}>
              <div className={styles.inputBox}>
                <span>打包费</span>
                <input
                  value={packValue}
                  onChange={this.onPackValueHandle}
                  onFocus={() => this.onFocusHandle('pack')}
                />
              </div>
              <div className={styles.inputBox}>
                <span>抹零</span>
                <input
                  value={changeValue}
                  onChange={this.onChangeValueHandle}
                  onFocus={() => this.onFocusHandle('change')}
                />
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.types}>
                <div onClick={this.onWxClickHandle} className={styles.type} style={{backgroundImage: `url(//net.huanmusic.com/llq/icon_wechat1.png)`}} />
                <div onClick={this.onCashClickHandle} className={styles.type} style={{backgroundImage: `url(//net.huanmusic.com/llq/icon_cash.png)`}} />
                <div onClick={this.onCardClickHandle} className={styles.type} style={{backgroundImage: `url(//net.huanmusic.com/llq/icon_card.png)`}} />
              </div>
              <div className={styles.numbers}>
                {
                  numbers && numbers.length > 0 ? (
                    numbers.map((item: any) => {
                      return (
                        <div 
                          key={item.key}
                          style={{
                            borderRight: ((item.key + 1) % 3) === 0 ? '1px solid #f3f3f3' : '',
                            borderBottom: item.key >= 9 ? '1px solid #f3f3f3' : '',
                          }}
                          onClick={() => this.onKeyboardClickHandle(item)}
                        >
                          {item.value}
                        </div>
                      );
                    })
                  ) : ''
                }
              </div>
              <div className={styles.button} onClick={this.doPayOrderHandle} >结账</div>
            </div>
          </div>
        </div>
      );
    } else {
      return '';
    }
    
  }

  private checkInputAuth = (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  }
}

const mapStateToProps = (state: Stores) => {
  const { list, currentCartId }: GetCurrentCartListReturn = GetCurrentCartList(state);
  return {
    showPay: GetShowPay(state),
    payOrder: GetPayOrder(state),
    list,
    currentCartId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  payOrderHandle: bindActionCreators(OrderController.payOrder, dispatch),
  changeModuleHandle: bindActionCreators(BusinessController.changeModuleHandle, dispatch),
  getCalledNumber: bindActionCreators(OrderController.getCalledNumber, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PayPage);
