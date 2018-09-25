import React, { Component } from 'react';
import { Modal, Button, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Stores } from '../../store/index';
import { merge } from 'lodash';
import { mergeProps } from '../../common/config';
import CartController from '../../action/cart';
import numeral from 'numeral';
import orderStyles from '../../container/order/style.less';

/**
 * @param { data 菜品 }
 *
 * @interface HelperPrps
 */
interface HelperPrps {
  data: any;
  dispatch?: Dispatch;
  putItemToCart?: (data: any) => void;
  addItem?: (data: any) => void;
  reducItem?: (data: any) => void;
  deleteItem?: (data: any) => void;
}

interface HeplerState {
  visible: boolean;
  selectedAttrs: any[];
}

class Helper extends Component <HelperPrps, HeplerState> {
  state = {
    visible: false,
    selectedAttrs: [],
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
    console.log(this.props.data);
    console.log(this.state.selectedAttrs);
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
   * @param { data 商品 }
   * @memberof Helper
   */
  public putItemToCart = () => {
    const { selectedAttrs } = this.state;
    const { data, putItemToCart } = this.props;
    console.log('selectedAttrs: ', selectedAttrs);
    console.log('data: ', data);

    const payload = {
      data,
      attrs: selectedAttrs,
    };

    if (putItemToCart) {
      putItemToCart(payload);
    }
  }

  public addItem = () => {
    const { data } = this.props;
    console.log('addItem data: ', data);
  }

  public reducItem = () => {
    const { data } = this.props;
    console.log('reducItem data: ', data);
  }

  public deleteItem = () => {
    const { data } = this.props;
    console.log('deleteItem data: ', data);
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
    const { visible } = this.state;
    const { data } = this.props;
    if (data.attrType) {
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
                            className={`
                              ${orderStyles.button}
                            `}
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
            <div className={orderStyles.footer} onClick={() => this.putItemToCart()}>+1</div>
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
        <div onClick={this.putItemToCart}>
          default
        </div>
      );
    }
  }
}

const mapStateToProps = (state: Stores) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  putItemToCart: bindActionCreators(CartController.putItemToCart, dispatch),
  addItem: bindActionCreators(CartController.addItem, dispatch),
  reducItem: bindActionCreators(CartController.reducItem, dispatch),
  deleteItem: bindActionCreators(CartController.deleteItem, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Helper);