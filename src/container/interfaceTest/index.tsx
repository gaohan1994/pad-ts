/**
 * created by Ghan 9.9
 * 
 * 测试接口页面
 */
import * as React from 'react';
import * as CSSModules from 'react-css-modules';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps } from '../../common/config';
/**
 * interface
 */
import SignController, { SignActions, /*RegisterParams*/ } from '../../action/sign';

import styles from './index.css';

interface InterfaceProps {
  // doRegisterHandle: (params: RegisterParams) => void;
  doRegisterHandle: () => void;
  checkUserIdUnique: (userid: string) => void;
}

class InterfaceTest extends React.Component<InterfaceProps, {}> {
  constructor (props: InterfaceProps) {
    super(props);
    this.doRegisterHandle = this.doRegisterHandle.bind(this);
    this.checkUserIdUnique = this.checkUserIdUnique.bind(this);
  }

  public doRegisterHandle = () => {
    const { doRegisterHandle } = this.props;
    doRegisterHandle();
  }

  public checkUserIdUnique = () => {
    const { checkUserIdUnique } = this.props;
    checkUserIdUnique('gaohan1994');
  }

  public render() {
    const interfaces = [
      {
        name: 'doRegisterHandle',
        handle: this.doRegisterHandle,
      },
      {
        name: 'checkUserIdUnique',
        handle: this.checkUserIdUnique,
      }
    ];
    return (
      <div className={styles.container}>
        {interfaces.map((item: {name: string; handle: () => void}, index) => {
          return (
            <div 
              key={index} 
              className={styles.item} 
              onClick={item.handle}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }
}

const InterfaceTestHoc = CSSModules(InterfaceTest, styles);

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch<SignActions>) => ({
  doRegisterHandle: bindActionCreators(SignController.doRegisterHandle, dispatch),
  checkUserIdUnique: bindActionCreators(SignController.checkUserIdUnique, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InterfaceTestHoc);
