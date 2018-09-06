import * as React from 'react';
import history from '../../history';
import styles from './index.css';

class Layout extends React.Component {

  public onNavHandle = (route: string) => {
    history.push(`${route}`);
  }

  public render() {
    return (
      <div className={styles.container}>
        <span onClick={() => this.onNavHandle('/')}>app</span>
        <span onClick={() => this.onNavHandle('/stores')}>stores</span>
        <span onClick={() => this.onNavHandle('/store/123')}>store</span>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
