import React, { Component } from 'react';
import { Modal, Button, Flex } from 'antd-mobile';
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
import { GetProductInCart, GetProductInCartReturn, GetList } from '../../store/cart';

/**
 * @tood 校验传入的 attrs 和 item 的 attr 是否一致（是否选中）
 * @param { item 商品 }
 * @param { attrs 属性值 }
 * @export
 */
export const AttrsChecked = (item: any, attrs: any[]): boolean => {
  return true;
};

/**
 * @param { data 菜品 }
 *
 * @interface HelperPrps
 */
interface HelperPrps {
  data: any;
  cartItem?: GetProductInCartReturn;
  dispatch?: Dispatch;
  list?: any;
  addItem?: (payload: CartItemPayload) => void;
  reduceItem?: (payload: CartItemPayload) => void;
}

interface HeplerState {
  visible: boolean;
  selectedAttrs: any[];
  inputWeight: string;
}

class Helper extends Component <HelperPrps, HeplerState> {
  state = {
    visible: false,
    selectedAttrs: [],
    inputWeight: '',
  };

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
          <Button size="small" type="primary" onClick={() => this.onShowConfigModal()}>选规格</Button>
        </div>
      );
    } else if (numeral(data.is_weight).value() === 1) {
      return (
        <div>称斤</div>
      );
    } else {
      return (
        <div>
          {
            token === true ? (
              <div>
                <div onClick={() => this.reduceItem()}>-</div>
                <div>{cartData.number}</div>
                <div onClick={() => this.addItem()}>+</div>
              </div>
            ) : (
              <div onClick={() => this.addItem()}>没有</div>
            )
          }
        </div>
      );
    }
  }
}

const mapStateToProps = (state: Stores, ownProps: any) => {
  const { data } = ownProps;
  return {
    cartItem: GetProductInCart(state, data),
    list: GetList(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  addItem: bindActionCreators(CartController.addItem, dispatch),
  reduceItem: bindActionCreators(CartController.reducItem, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Helper);