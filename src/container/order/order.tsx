/**
 * created by Ghan 9.13
 */
import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import styles from './style.css';

interface OrderProps {}

class OrderPage extends React.Component<OrderProps, {}> {

  public render() {
    return (
      <div>
        Order
      </div>
    );
  }
}

const OrderHoc = CSSModules(OrderPage, styles);

export default OrderHoc;
