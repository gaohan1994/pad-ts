/**
 * created by Ghan 9.9
 * 
 * 测试接口页面
 */
import * as React from 'react';
/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps } from '../../common/config';
/**
 * interface
 */
import SignController, { /*RegisterParams*/ } from '../../action/sign';
import PrinterController from '../../action/printer';
import MenuController from '../../action/menu';
import ManageController from '../../action/manage';
import OrderController, { OrderQueryParams } from '../../action/order';
import TableController from '../../action/table';
import history from '../../history';
import styles from './index.less';

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
  getSingleMenuTp: (mchnt_cd: string) => void;
  getTermlist: (mchnt_cd: string) => void;
  orderQuery: (params: OrderQueryParams) => void;
  orderDetailSearch: (params: { mchnt_cd: string; order_no: string; }) => void;
  getTableInfo: (mchnt_cd: string) => void;
  addTableInfo: (params: {mchnt_cd: string; num: string}) => void;
  inventoryClean: (param: any) => void;
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
    getUserinfo('60000000217');
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
  public getAllSingleMenuNew = async () => {
    const { getAllSingleMenuNew } = this.props;
    await getAllSingleMenuNew('60000000200');

    history.push('/store/60000000200');
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

  /**
   * @todo 获取所有单品信息
   *
   * @memberof InterfaceTest
   */
  public getSingleMenuTp = () => {
    const { getSingleMenuTp } = this.props;
    getSingleMenuTp(DEFAULT_MCHNT_CD);
  }

  /**
   * @todo 获取终端信息
   *
   * @memberof InterfaceTest
   */
  public getTermlist = () => {
    const { getTermlist }  = this.props;
    getTermlist('60000000217');
  }

  /**
   * @todo 查询订单列表
   *
   * @memberof InterfaceTest
   */
  public orderQuery = () => {
    const { orderQuery } = this.props;

    const param: OrderQueryParams = {
      mchnt_cd: '60000000217',
      currentPage: '1',
      pageSize: '20',
    };
    orderQuery(param);
  }

  /**
   * @todo 查询订单详情
   *
   * @memberof InterfaceTest
   */
  public orderDetailSearch = () => {
    const { orderDetailSearch } = this.props;

    const params = {
      mchnt_cd: '60000000217',
      order_no: '24366971201809126421',
    };
    orderDetailSearch(params);
  }

  /**
   * @todo 获取台位信息
   *
   * @memberof InterfaceTest
   */
  public getTableInfo = () => {
    const { getTableInfo } = this.props;
    getTableInfo(DEFAULT_MCHNT_CD);
  }

  /**
   * @todo 商户添加台位信息
   *
   * @memberof InterfaceTest
   */
  public addTableInfo = () => {
    const { addTableInfo } = this.props;
    addTableInfo({
      mchnt_cd: DEFAULT_MCHNT_CD,
      num: '1'
    });
  }

  /**
   * @todo 估清
   * @param { product_id 菜品id }
   *
   * @memberof InterfaceTest
   */
  public inventoryClean = () => {
    const { inventoryClean } = this.props;
    inventoryClean('S00001635');
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
          },
          {
            name: 'getSingleMenuTp',
            handle: this.getSingleMenuTp,
          },
          {
            name: 'inventoryClean',
            handle: this.inventoryClean,
          },
        ]
      },
      {
        moduleName: 'manage',
        interfaces: [
          {
            name: 'getTermlist',
            handle: this.getTermlist
          }
        ]
      },
      {
        moduleName: 'order',
        interfaces: [
          {
            name: 'orderQuery',
            handle: this.orderQuery
          },
          {
            name: 'orderDetailSearch',
            handle: this.orderDetailSearch,
          }
        ]
      },
      {
        moduleName: 'getTableInfo',
        interfaces: [
          {
            name: 'getTableInfo',
            handle: this.getTableInfo,
          },
          {
            name: 'addTableInfo',
            handle: this.addTableInfo,
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

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  doRegisterHandle: bindActionCreators(SignController.doRegisterHandle, dispatch),
  checkUserIdUnique: bindActionCreators(SignController.checkUserIdUnique, dispatch),
  getUserinfo: bindActionCreators(SignController.getUserinfo, dispatch),
  getPrinterInfo: bindActionCreators(PrinterController.getPrinterInfo, dispatch),
  getAllSingleMenuNew: bindActionCreators(MenuController.getAllSingleMenuNew, dispatch),
  getPromotion: bindActionCreators(MenuController.getPromotion, dispatch),
  getMenuTp: bindActionCreators(MenuController.getMenuTp, dispatch),
  deleteMenuTp: bindActionCreators(MenuController.deleteMenuTp, dispatch),
  getSingleMenuTp: bindActionCreators(MenuController.getSingleMenuTp, dispatch),
  getTermlist: bindActionCreators(ManageController.getTermlist, dispatch),
  orderQuery: bindActionCreators(OrderController.orderQuery, dispatch),
  orderDetailSearch: bindActionCreators(OrderController.orderDetailSearch, dispatch),
  getTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
  addTableInfo: bindActionCreators(TableController.addTableInfo, dispatch),
  inventoryClean: bindActionCreators(MenuController.InventoryClean, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InterfaceTest);
