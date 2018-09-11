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
import PrinterController from '../../action/printer';
import MenuController from '../../action/menu';

import styles from './index.css';

interface InterfaceProps {
  // doRegisterHandle: (params: RegisterParams) => void;
  doRegisterHandle: () => void;
  checkUserIdUnique: (userid: string) => any;
  getUserinfo: (mchnt_cd: string) => void;
  getPrinterInfo: (mchnt_cd: string) => void;
  getAllSingleMenuNew: (mchnt_cd: string) => void;
  getPromotion: (mchnt_cd: string) => void;
  getMenuTp: (mchnt_cd: string) => void;
  deleteMenuTp: (menutp_id: string) => void;
}

const DEFAULT_MCHNT_CD = '60000000200';
class InterfaceTest extends React.Component<InterfaceProps, {}> {
  /**
   * 注册
   *
   * @memberof InterfaceTest
   */
  public doRegisterHandle = () => {
    const { doRegisterHandle } = this.props;
    doRegisterHandle();
  }

  /**
   * 校验用户名是否唯一 
   *
   * @memberof InterfaceTest
   */
  public checkUserIdUnique = async () => {
    const { checkUserIdUnique } = this.props;
    const result = await checkUserIdUnique('gaohan1994');
    console.log('result in interface: ', result);
  }

  /**
   * 获取用户信息
   *
   * @memberof InterfaceTest
   */
  public getUserinfo = () => {
    const { getUserinfo } = this.props;
    getUserinfo('60000000200');
  }

  /**
   * 获取打印机信息
   *
   * @memberof InterfaceTest
   */
  public getPrinterInfo = () => {
    const { getPrinterInfo } = this.props;
    getPrinterInfo('60000000200');
  }

  /**
   * @todo 获取所有菜单信息
   *
   * @memberof InterfaceTest
   */
  public getAllSingleMenuNew = () => {
    const { getAllSingleMenuNew } = this.props;
    getAllSingleMenuNew('60000000200');
  }

  /**
   * @todo 获取促销信息
   *
   * @memberof InterfaceTest
   */
  public getPromotion = () => {
    const { getPromotion } = this.props;
    getPromotion('60000000200');
  }
  
  /**
   * @todo 获取所有菜单信息
   *
   * @memberof InterfaceTest
   */
  public getMenuTp = () => {
    const { getMenuTp } = this.props;
    getMenuTp(DEFAULT_MCHNT_CD);
  }

  /**
   * @todo 删除菜单
   *
   * @memberof InterfaceTest
   */
  public deleteMenuTp = () => {
    const { deleteMenuTp } = this.props;
    deleteMenuTp('S00000287');
  }

  public render() {
    const testInterfaces = [
      {
        moduleName: 'sign',
        interfaces: [
          {
            name: 'doRegisterHandle',
            handle: this.doRegisterHandle,
          },
          {
            name: 'checkUserIdUnique',
            handle: this.checkUserIdUnique,
          },
          {
            name: 'getUserinfo',
            handle: this.getUserinfo,
          }
        ]
      },
      {
        moduleName: 'printer',
        interfaces: [
          {
            name: 'getPrinterInfo',
            handle: this.getPrinterInfo,
          }
        ]
      },
      {
        moduleName: 'menu',
        interfaces: [
          {
            name: 'getAllSingleMenuNew',
            handle: this.getAllSingleMenuNew,
          },
          {
            name: 'getPromotion',
            handle: this.getPromotion,
          },
          {
            name: 'getMenuTp',
            handle: this.getMenuTp,
          },
          {
            name: 'deleteMenuTp',
            handle: this.deleteMenuTp
          }
        ]
      }
    ];
    return (
      <div className={styles.container}>
        {testInterfaces.map((
          item: {moduleName: string; interfaces: {name: string; handle: () => void}[]},
          index,
        ) => {
          return (
            <div key={index}>
              <div className={styles.header}>{item.moduleName}</div>
              {item.interfaces.map((testInterface: {name: string; handle: () => void}) => {
                  return (
                    <div
                      key={testInterface.name}
                      className={styles.item}
                      onClick={testInterface.handle}
                    >
                      {testInterface.name}
                    </div>
                  );
                })}
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
  getUserinfo: bindActionCreators(SignController.getUserinfo, dispatch),
  getPrinterInfo: bindActionCreators(PrinterController.getPrinterInfo, dispatch),
  getAllSingleMenuNew: bindActionCreators(MenuController.getAllSingleMenuNew, dispatch),
  getPromotion: bindActionCreators(MenuController.getPromotion, dispatch),
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  deleteMenuTp: bindActionCreators(MenuController.deleteMenuTp, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InterfaceTestHoc);
