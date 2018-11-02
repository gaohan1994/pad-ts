import React, { Component } from 'react';
import { Modal, Flex } from 'antd-mobile';
import { ModalProps } from 'antd-mobile/lib/modal/Modal';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Stores } from '../../store/index';
import { merge } from 'lodash';
import { mergeProps } from '../../common/config';
import CartController, { 
  CartItemPayload, 
  CheckItemAlreadyInCart, 
  CheckItemAlreadyInCartReturn,
} from '../../action/cart';
import numeral from 'numeral';
import orderStyles from '../../container/order/style.less';
import { GetProductInCart, GetProductInCartReturn, GetCurrentCartList, GetCurrentCartListReturn } from '../../store/cart';
import Base from '../../action/base';
import styles from './index.less';

interface WeightModalProps extends ModalProps { 
  value: any;
  onChange: (e: any) => void;
  onCancel?: (param?: any) => void;
  onOk?: (param?: any) => void;
} 
class WeightModal extends Component <WeightModalProps, {}> {

  public onChangeHandle = ({target: { value } }: any) => {
    const { onChange } = this.props;
    onChange(this.checkInputAuth(value));
  }

  render () {
    const { value, visible, onClose, onCancel, onOk } = this.props;
    return (
      <Modal
        transparent={true}
        visible={visible}
        className="my-attr-modal"
        maskClosable={true}
        onClose={onClose ? () => onClose() : () => {/** */}}
        {...this.props}
      >
        <div className={styles.header}>请输入菜品数量</div>
        <div className={orderStyles.close} onClick={onClose} >x</div>
        <div className={styles.content} style={{paddingBottom: '20px'}}>
          <div className={styles.inputBox}>
            <input 
              className={styles.input}
              value={value}
              onChange={this.onChangeHandle}
              placeholder="请输入重量"
            />
            <span>斤</span>
          </div>
          <div className={styles.buttons}>
            <div className={`${styles.button} ${styles.cancel}`} onClick={onCancel ? onCancel : () => {/** */}}>取消</div>
            <div className={`${styles.button} ${styles.ok}`} onClick={onOk ? onOk : () => {/** */}}>确定</div>
          </div>
        </div>
      </Modal>
    );
  }

  private checkInputAuth = (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  }
}

export interface ClickFromPropsParam { 
  type: 'normal' | 'add' | 'reduce';
  currentAttr?: any;
  callback?: (param?: any) => void;
}
/**
 * @param { data 菜品 }
 * @param { clickFromPropsParam: 外层传入关于 click 事件的配置 }
 *
 * @interface HelperPrps
 */
interface HelperProps {
  data: any;
  cartItem?: GetProductInCartReturn;
  dispatch?: Dispatch;
  list?: any;
  addItem?: (payload: CartItemPayload) => void;
  reduceItem?: (payload: CartItemPayload) => void;

  clickFromPropsParam?: ClickFromPropsParam;
}

/**
 * @param {visible} AttrModal
 * @param {value} weight value
 * @param {selectedAttrs}
 */
interface HeplerState {
  visible: boolean;
  weightVisible: boolean;
  weightType: 'ADD' | 'REDUCE';
  value: string;
  selectedAttrs: any[];
}

class Helper extends Component <HelperProps, HeplerState> {
  static WeightModal = WeightModal;
  constructor(props: HelperProps) {
    super(props);
    this.state = {
      visible: false,
      weightVisible: false,
      weightType: 'ADD',
      value: '',
      selectedAttrs: [],
    };
  }
  /**
   * @todo 设置默认第一项是选中状态
   *
   * @memberof Helper
   */
  componentDidMount() {
    const { data } = this.props;
    if (data.attrType && data.attrType.length > 0) {
      const initSelected = data.attrType.map((attr: any) => {
        return {
          ...attr.attrInfos[0]
        };
      });
  
      this.setState({
        selectedAttrs: initSelected
      });
    }
  }

  /**
   * @todo 针对点击事件进行处理
   * @param { 扯淡的点就是要根据外部传入的参数进行判断，如果传入了 type 而且传入了 attr 那么直接走 type 并传入 attr }
   * @param { token: 是否是规格商品 }
   * @param { propsAttrToken: 是否是外部传入 规格 }
   *
   * @memberof Helper
   */
  public handleClickWithParam = () => { 
    const { 
      data, 
      clickFromPropsParam,
     } = this.props;

    console.log('handleClickWithParam');

    let token: boolean = false;

    let type: string = 'normal';
    let currentAttr: any;

    if (clickFromPropsParam) {
      const { 
        type: clickFromPropsParamType, 
        currentAttr: clickFromPropsParamAttr,
      } = clickFromPropsParam;
      if (clickFromPropsParamType) {
        type = clickFromPropsParamType;
      }

      if (clickFromPropsParamAttr) {
        currentAttr = clickFromPropsParamAttr;
      }
    }
    
    if (data.attrType) { token = true; }
    console.log('data: ', data);
    console.log('token: ', token);
    /**
     * @todo 如果是减少条目
     */
    if (type === 'reduce') {
      if (currentAttr) {
        // 减少条目且是外部传入attr
        if (clickFromPropsParam) {
          this.reduceItemFromProps(clickFromPropsParam);
        }
      } else {
        // 减少条目是一般商品的情况
        if (numeral(data.is_weight).value() === 1) {
          this.ShowWeightModalAndChangeType('REDUCE');
        } else {
          this.reduceItem();
        }
      }
    } else {
      /**
       * @todo 增加条目
       */
      if (token === true) {
        console.log('token === true');
        // 如果是 规格商品
        if (currentAttr) {
          console.log('currentAttr');
          // 如果是外部传入 attr
          if (clickFromPropsParam) {
            this.addItemFromProps(clickFromPropsParam);
          }
        } else {
          console.log('onShowConfigModal');
          // 外部没传入 则选择 attr
          this.onShowConfigModal();
        }
      } else {
        /**
         * @param {data.is_weight === 1} 称斤商品显示weight modal
         * @param {else} 正常增加
         */
        if (numeral(data.is_weight).value() === 1) {
          this.ShowWeightModalAndChangeType('ADD');
        } else {
          this.addItem();
        }
      }
    }
  }

  /**
   * @todo 点击选项之后处理
   * @param { attr 父层的 attr }
   * @param { info 具体的 attrInfo }
   *
   * @memberof Helper
   */
  public onInfoClickHandle = (attr: any, info: any) => {
    const { selectedAttrs } = this.state;
    selectedAttrs.map((selectedAttr: any) => {
      if (selectedAttr.attrTypeId === attr.attrTypeId) {
        selectedAttr.attrId = info.attrId;
        selectedAttr.attrName = info.attrName;
        selectedAttr.attrPrice = info.attrPrice;
        selectedAttr.priority = info.priority;
      }
    });

    const newAttrs = merge([], selectedAttrs);
    this.setState({
      selectedAttrs: newAttrs,
    });
  }

  public onShowConfigModal = () => {
    this.setState({
      visible: true,
    });
  }

  public onHideConfigModal = () => {
    this.setState({
      visible: false,
    });
  }
  
  public onShowWeightModal = () => {
    this.setState({
      weightVisible: true
    });
  }

  public onHideWeightModal = () => {
    this.setState({
      weightVisible: false
    });
  }

  public onWeightChange = (value: any) => {
    this.setState({ value });
  }

  public onChangeWeightType = (type: 'ADD' | 'REDUCE') => {
    this.setState({ weightType: type });
  }

  /**
   * @param {onAttrItemShowWeightModal} 规格商品显示 weight modal
   */
  public ShowWeightModalAndChangeType = (type: 'ADD' | 'REDUCE') => {
    this.onShowWeightModal();
    this.onChangeWeightType(type);
  }

  /**
   * @param {onCancelHandle} 取消
   */
  public onCancelHandle = () => {
    this.onHideWeightModal();
  }

  public WeightControll = async () => {
    const { weightType } = this.state;
    if (weightType === 'ADD') {
      await this.addItem();
    } else {
      await this.reduceItem();
    }
    this.onHideWeightModal();
    this.onWeightChange('');
    this.onChangeWeightType('ADD');
  }

  /**
   * @todo 添加条目
   * @param { 根据 attrType 判断是否是规格商品 }
   * @param { 根据 is_weight 判断是否是称斤商品 }
   * @param { data 商品 }
   * @memberof Helper
   */
  public addItem = () => {
    const { selectedAttrs, value } = this.state;
    const { data, addItem } = this.props;

    let payload: CartItemPayload = { data };

    if (numeral(data.inventory).value() !== 0) {

      /**
       * @param {attrType} 规格商品
       */
      if (data.attrType) {
        payload = {
          ...payload,
          attrs: selectedAttrs,
        };
      }

      /**
       * @param {is_weight} 称斤商品 ( + 称斤商品)
       */
      if (numeral(data.is_weight).value() === 1) {
        payload = {
          ...payload,
          weight: { value: numeral(value).value() },
        };
      }
      if (addItem) {
        addItem(payload);
      }
    } else {
      Base.toastFail('没有库存');
    }
  }

  public addItemFromProps = (clickFromPropsParam: ClickFromPropsParam) => {
    const { data, addItem } = this.props;
    const { currentAttr, callback } = clickFromPropsParam;

    let payload: CartItemPayload = { data };

    if (data.attrType) {
      payload = { 
        ...payload,
        attrs: currentAttr.attrs,
      };
    }

    if (callback) {
      payload = { 
        ...payload,
        callback,
      };
    }

    if (addItem) {
      addItem(payload);
    }
  }

  /**
   * @todo 减少条目
   *
   * @memberof Helper
   */
  public reduceItem = () => {
    const { selectedAttrs, value } = this.state;
    const { data, reduceItem } = this.props;

    let payload: CartItemPayload = { data };

    if (data.attrType) {
      payload = {
        ...payload,
        attrs: selectedAttrs,
      };
    }

    /**
     * @param {is_weight} 称斤商品 ( + 称斤商品)
     */
    if (numeral(data.is_weight).value() === 1) {
      payload = {
        ...payload,
        weight: { value: numeral(value).value() },
      };
    }

    if (reduceItem) {
      reduceItem(payload);
    }
  }

  public reduceItemFromProps = (clickFromPropsParam: ClickFromPropsParam) => {
    const { data, reduceItem } = this.props;
    const { currentAttr, callback } = clickFromPropsParam;

    let payload: CartItemPayload = { data };
    if (data.attrType) {
      payload = {
        ...payload,
        attrs: currentAttr.attrs,
      };
    }

    if (callback) {
      payload = { 
        ...payload,
        callback,
      };
    }

    if (reduceItem) {
      reduceItem(payload);
    }
  }

  /**
   * @TODO render WeightModal
   *
   * @memberof Helper
   */
  public renderWeightModal = () => {
    const { weightVisible, value } = this.state;
    return (
      <WeightModal
        value={value}
        onChange={this.onWeightChange}
        visible={weightVisible}
        onCancel={this.onCancelHandle}
        onOk={() => this.WeightControll()}
        onClose={() => this.onHideWeightModal()}
      />
    );
  }

  /**
   * @param { 规格 attrType: [{attrTypeId: string; attrTypeName: string; attrInfos: [{}]}] }
   * @param { 默认 其他 }
   *
   * @returns
   * @memberof Helper
   */
  render() {
    const { visible, selectedAttrs } = this.state;
    const { data, cartItem, list } = this.props;
    /**
     * @param { token: 是否存在 cart 中 } 
     * @param { index: 在 cart 中的位置 } 
     * @param { cartData: 在 cart 中的数据 }
     */
    let
      token: boolean = false,
      cartData: any;

    if (cartItem && typeof cartItem.index === 'number') {
      token = true;
      cartData = cartItem.data;
    }
    if (data.attrType) {
      /**
       * @todo 规格商品先把 token 置否在进行特殊处理
       * @param { currentPrice: 当前物品的单价}
       * @param { attrIndex 购物车中该规格商品 }
       * @param { attrId 规格组合的 id }
       */
      token = false;
      
      let
        currentPrice: number = 0,
        attrIndex: number = -1,
        attrId: string = '';
      const { inCart, index, attrToken }: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list, selectedAttrs);
      if (inCart === true && typeof index === 'number' && attrToken) {
        token = true;
        attrIndex = attrToken.attrIndex;
        attrId = attrToken.attrId;
      }

      currentPrice = numeral(data.price).value();
      selectedAttrs.forEach((attr: any) => {
        currentPrice += numeral(attr.attrPrice).value();
      });

      return (
        <div>
          {this.renderWeightModal()}
          <Modal
            transparent={true}
            visible={visible}
            className="my-attr-modal"
            maskClosable={true}
            onClose={() => this.onHideConfigModal()}
          >
            <div className={styles.header}>{data.product_name}</div>
            <div
              onClick={() => this.onHideConfigModal()}
              className={orderStyles.close}
            >
              x
            </div>
            <div className={styles.content}>
              {data.attrType.map((attr: any) => {
                return (
                  <div key={attr.attrTypeId} >
                    <div className={styles.attrName}>{attr.attrTypeName}</div>
                    <Flex
                      wrap="wrap"
                      align="start"
                      justify="between"
                    >
                      {attr.attrInfos && attr.attrInfos.length > 0
                      ? attr.attrInfos.map((info: any) => {
                        const checkCurrentAttrToken = selectedAttrs.some(s => s.attrId === info.attrId);
                        return (
                          <div 
                            key={info.attrId} 
                            className={checkCurrentAttrToken === true ? styles.activeButton : styles.normalButton}
                            onClick={() => this.onInfoClickHandle(attr, info)}
                          > 
                            {info.attrName}
                          </div>
                        );
                      })
                      : ''}
                    </Flex>
                  </div>
                );
              })}
            </div>
            {
              token === true 
              && attrIndex !== -1
              && attrId ? (
                <div className={styles.footer}>
                  <div className={styles.price}>
                    {numeral(currentPrice).format('0.00')}
                  </div>
                  <div className={`${styles.number} ${styles.controll}`}>
                    <div 
                      className={styles.smallIcon} 
                      onClick={numeral(data.is_weight).value() === 1 
                        ? () => this.ShowWeightModalAndChangeType('REDUCE')
                        : () => this.reduceItem()}
                      style={{backgroundImage: `url(//net.huanmusic.com/llq/icon_jianfa.png)`}}
                    />
                    <div className={styles.currentNumber}>
                      {cartData.number[attrIndex].number}
                    </div>
                    <div 
                      className={styles.smallIcon} 
                      onClick={numeral(data.is_weight).value() === 1 
                        ? () => this.ShowWeightModalAndChangeType('ADD')
                        : () => this.addItem()}
                      style={{backgroundImage: `url(//net.huanmusic.com/llq/icon_jiahao.png)`}}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.footer}>
                  <div className={styles.price}>
                    {numeral(currentPrice).format('0.00')}
                  </div>
                  <div 
                    className={`${styles.number} ${styles.icon}`} 
                    onClick={numeral(data.is_weight).value() === 1
                      ? () => this.ShowWeightModalAndChangeType('ADD')
                      : () => this.addItem()} 
                  />
                </div>
              )
            }
          </Modal>
          <div onClick={() => this.handleClickWithParam()}>{this.props.children}</div>
        </div>
      );
    } else {
      /**
       * @param {numeral(data.is_weight).value() === 1} 称斤商品显示称斤Modal
       * @param {default} 直接点击
       */
      return (
        <div>
          {this.renderWeightModal()}
          <div onClick={() => this.handleClickWithParam()}>{this.props.children}</div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: Stores, ownProps: any) => {
  const { data } = ownProps;
  const { list }: GetCurrentCartListReturn = GetCurrentCartList(state);
  return {
    cartItem: GetProductInCart(state, data),
    list,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  addItem: bindActionCreators(CartController.addItem, dispatch),
  reduceItem: bindActionCreators(CartController.reducItem, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Helper);