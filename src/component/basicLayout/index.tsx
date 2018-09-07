import * as React from 'react';
import history from '../../history';
import styles from './index.css';
import Navbar from '../Navbar';

class Layout extends React.Component {

  public onNavHandle = (route: string) => {
    history.push(`${route}`);
  }

  public render() {
    return (
      <div className={styles.container}>
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
