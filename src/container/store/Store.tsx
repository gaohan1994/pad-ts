import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import styles from './index.css';

class Store extends React.Component {
  public render() {
    return (
      <div className={`${styles.container} ${styles.store}`}>
        Store
      </div>
    );
  }
}

const StoreHoc = CSSModules(Store, styles);

export default StoreHoc;
