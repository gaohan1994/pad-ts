import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import styles from './index.less';

class Stores extends React.Component {
  public render() {
    return (
      <div className={`${styles.container} ${styles.stores}`}>
        Stores
      </div>
    );
  }
}

const StoresHoc = CSSModules(Stores, styles);

export default StoresHoc;
