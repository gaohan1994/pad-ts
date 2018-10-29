import React, { Component } from 'react';
import { Modal, Flex } from 'antd-mobile';
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

interface HeplerState {
  visible: boolean;
  selectedAttrs: any[];
  inputWeight: string;
}

class Helper extends Component <HelperProps, HeplerState> {

  constructor(props: HelperProps) {
    super(props);
    this.state = {
      visible: false,
      selectedAttrs: [],
      inputWeight: '',
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
        this.reduceItem();
      }
    } else {
      /**
       * @todo 增加条目
       */
      if (token === true) {
        // 如果是 规格商品
        if (currentAttr) {
          // 如果是外部传入 attr
          if (clickFromPropsParam) {
            this.addItemFromProps(clickFromPropsParam);
          }
        } else {
          // 外部没传入 则选择 attr
          this.onShowConfigModal();
        }
      } else {
        // 正常增加
        this.addItem();
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

  /**
   * @todo 添加条目
   * @param { 根据 attrType 判断是否是规格商品 }
   * @param { 根据 is_weight 判断是否是称斤商品 }
   * @param { data 商品 }
   * @memberof Helper
   */
  public addItem = () => {
    const { selectedAttrs } = this.state;
    const { data, addItem } = this.props;

    let payload: CartItemPayload = { data };

    if (data.attrType) {
      payload = {
        ...payload,
        attrs: selectedAttrs,
      };
    }
    if (addItem) {
      addItem(payload);
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

    console.log('callback: ', callback);
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
    const { selectedAttrs } = this.state;
    const { data, reduceItem } = this.props;

    let payload: CartItemPayload = { data };

    if (data.attrType) {
      payload = {
        ...payload,
        attrs: selectedAttrs,
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
   * @param { 规格 attrType: [{attrTypeId: string; attrTypeName: string; attrInfos: [{}]}] }
   * @param { 称斤 is_weight === 1 }
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
       * @param { attrIndex 购物车中该规格商品 }
       * @param { attrId 规格组合的 id }
       */
      token = false;

      console.log('data: ', data);
      console.log('list: ', list);
      console.log('selectedAttrs: ', selectedAttrs);
      
      let
        attrIndex: number = -1,
        attrId: string = '';
      const { inCart, index, attrToken }: CheckItemAlreadyInCartReturn = CheckItemAlreadyInCart(data, list, selectedAttrs);
      if (inCart === true && typeof index === 'number' && attrToken) {
        token = true;
        attrIndex = attrToken.attrIndex;
        attrId = attrToken.attrId;
      }

      return (
        <div>
          <Modal
            transparent={true}
            visible={visible}
            className={orderStyles.modal}
          >
            <div>{data.product_name}</div>
            <div
              onClick={() => this.onHideConfigModal()}
              className={orderStyles.close}
            >
              x
            </div>
            <div className={orderStyles.content}>
              {data.attrType.map((attr: any) => {
                return (
                  <div key={attr.attrTypeId} >
                    {attr.attrTypeName}
                    <Flex
                      wrap="wrap"
                      align="start"
                      justify="between"
                    >
                      {attr.attrInfos && attr.attrInfos.length > 0
                      ? attr.attrInfos.map((info: any) => {
                        return (
                          <div 
                            key={info.attrId} 
                            className={`${orderStyles.button}`}
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
            <div className={orderStyles.footer}>
              {
                token === true 
                && attrIndex !== -1
                && attrId ? (
                  <div>
                    <div onClick={() => this.reduceItem()}> - </div>
                    <div>
                      {cartData.number[attrIndex].number}
                    </div>
                    <div onClick={() => this.addItem()}> + </div>
                  </div>
                ) : (
                  <div onClick={() => this.addItem()}>没有</div>
                )
              }
            </div>
          </Modal>
          <div onClick={() => this.handleClickWithParam()}>{this.props.children}</div>
        </div>
      );
    } else if (numeral(data.is_weight).value() === 1) {
      return (
        <div onClick={() => this.handleClickWithParam()}>{this.props.children}</div>
      );
    } else {
      return (
        <div onClick={() => this.handleClickWithParam()}>
          {this.props.children}
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