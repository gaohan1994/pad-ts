/**
 * @todo created by Ghan
 * 
 * updated by Ghan 2018.10.22
 * 
 * @param { 新的table页面 }
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Modal } from 'antd';
import TableController, { TableActions } from '../../action/table';
import BusinessController, { BusinessActions } from '../../action/business';
import { mergeProps } from '../../common/config';
import { GetTableInfo, GetSelectedArea, GetSelectedAreaId, GetSelecetedTable } from '../../store/table';
import { Stores } from '../../store';
import Layout from '../../component/basicLayout/Layout';
import styles from './table.less';
import LeftBar, { HeadersData, FootersData } from 'src/component/LeftBar/LeftBar';
import { ContentsData } from '../../component/LeftBar/LeftBar';

const { Item } = Layout;

/**
 * @param { tableClickHandle: 点击桌子的 action }
 * @param { fetchTableInfo: 请求桌子信息 }
 * @param { changeTableArea: 切换区域的 action }
 * @param { match: route 上的参数 }
 * @param { tableinfo: 所有 table 的数据 }
 * @param { selectedTableInfo: 选中的 area 的数据 }
 * @param { selectedAreaI: 选中的 area 的id }
 * @param { selectedTable: 选中的桌子 }
 * @interface TableProps
 */
interface TableProps {
  tableClickHandle: (param: any) => void;
  fetchTableInfo: (id: string) => void;
  changeTableArea: (param: any) => void;
  saveChoicePeople: (param: any) => void;
  match: { params: { id: string } };
  tableinfo: any;
  selectedAreaInfo: any;
  selectedAreaId: string;
  selectedTable: any;
}

interface TableState {
  showModal: boolean;
}

/**
 * @todo 改版之后的table页面
 *
 * @class Table
 * @extends {Component<TableProps, TableState>}
 */
class Table extends Component<TableProps, TableState> {
  state = {
    showModal: false,
  };
  /**
   * @param { 1.先请求桌号 }
   * @param { }
   *
   * @memberof Meal
   */
  componentDidMount = () => {
    this.fetchTable();
  }

  /**
   * @todo 查询桌子情况
   *
   * @memberof Table
   */
  public fetchTable = () => {
    const { fetchTableInfo, match: { params: { id } } } = this.props;
    fetchTableInfo(id);
  }

  /**
   * @todo area click handle
   * @param { area: Area; change Area }
   *
   * @memberof Table
   */
  public onAreaClickHandle = (area: any) => {
    const { changeTableArea } = this.props;
    changeTableArea(area);
  }

  /**
   * @todo table click handle
   * @param { table: Table 1.fetch current table's order if table status === 1 }
   *
   * @memberof Table
   */
  public onTableClickHandle = async (table: any) => {
    const { tableClickHandle } = this.props;
    tableClickHandle(table);
  }

  /**
   * @todo 点击人数前去点餐
   *
   * @memberof Table
   */
  public saveChoicePeople = async (param: any) => {
    const { saveChoicePeople } = this.props;
    saveChoicePeople(param);
  }

  public onChoicePeople = (...rest: any[]) => {
    console.table(rest);
  }

  public onShowModal = () => {
    this.setState({ showModal: true });
  }

  public onHideModal = () => {
    this.setState({ showModal: false });
  }

  /**
   * @todo cancel modal handle
   *
   * @memberof Table
   */
  public onCancelHandle = () => {
    this.onHideModal();
  }

  render() {
    const { showModal } = this.state;
    const { tableinfo, selectedAreaInfo, selectedAreaId, selectedTable } = this.props;

    const modalData = (selectedAreaInfo && typeof (selectedAreaInfo.peopelNum) === 'number')
      ? new Array(selectedAreaInfo.peopelNum).fill({}).map((_: any, index: number) => {
        return {
          key: index + 1,
          value: index + 1,
        };
      })
      : [];

    const headers: HeadersData = {
      data: [
        [{ key: '1', title: '订单号', value: '123123' }],
        [{ key: '2', title: '桌号', value: '1' }, { key: '3', title: '用餐人数', value: '3人' }]
      ]
    };

    const contents: ContentsData = {
      data: [],
    };
    const footers: FootersData = {
      remarks: '整单备注：123123123',
      detail: [
        [{ key: '1', title: '订单号', value: '123123' }],
        [{ key: '2', title: '桌号', value: '1' }, { key: '3', title: '用餐人数', value: '3人' }]
      ],
      buttons: [
        {
          style: { background: '#474747' },
          values: ['结账', '188.00'],
          onClick: () => { console.log('hello'); },
        },
        {
          values: ['下单'],
          onClick: () => { this.setState({ showModal: true }); },
        },
      ]
    };
    return (
      <Layout>
        <Item position="main">
          <div style={{ height: `${document && document.documentElement && document.documentElement.clientHeight - 64}px` }} className={styles.tables}>
            {
              selectedAreaInfo && selectedAreaInfo.tables.map((table: any) => {
                const { peopelNum } = selectedAreaInfo;
                return (
                  <div
                    key={table.table_no}
                    className={`
                      ${styles.table}
                      ${table.status === 1 ? styles.occupy : styles.unoccupy}
                    `}
                    style={{
                      border: `${
                        selectedTable.table_no === table.table_no 
                          ? table.status === 1
                            ? '2px solid #b78d1d'
                            : '2px solid #f8c030'
                          : ''
                      }`
                    }}
                    onClick={() => this.onTableClickHandle(table)}
                  >
                    {table.table_name}
                    <div>{table.status === 1 ? `占用` : `未占用`}</div>

                    <div className={table.status === 1 ? styles.activeTip : styles.normalTip}>{`可供${peopelNum}人`}</div>
                  </div>
                );
              })
            }
          </div>
        </Item>
        <Item position="left">
          <LeftBar headers={headers} contents={contents} footers={footers} />
        </Item>
        <Item position="right">
          <div className={styles.right}>
            <div className={styles.search}>
              <span className={styles.searchIcon} />
              <span>搜索</span>
            </div>
            {tableinfo.map((area: any) => {
              return (
                <div
                  key={area.area_id}
                  className={selectedAreaId === area.area_id ? styles.activeArea : styles.normalArea}
                  onClick={() => this.onAreaClickHandle(area)}
                >
                  {selectedAreaId === area.area_id ? <div className={styles.active} /> : ''}
                  {area.area_name}
                </div>
              );
            })}
          </div>
        </Item>
        <Modal
          title="用餐人数"
          visible={showModal}
          footer={null}
          onCancel={this.onCancelHandle}
          centered={true}
        >
          <div className={styles.people}>
            {
              modalData && modalData.map((item: any) => {
                return (
                  <div 
                    key={item.key} 
                    className={styles.number}
                    onClick={() => this.saveChoicePeople(item)}
                  >
                    {item.value}
                  </div>
                );
              })
            }
          </div>
        </Modal>
      </Layout>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  tableinfo: GetTableInfo(state),
  selectedAreaInfo: GetSelectedArea(state),
  selectedAreaId: GetSelectedAreaId(state),
  selectedTable: GetSelecetedTable(state),
});

const mapDispatchToProps = (dispatch: Dispatch<TableActions | BusinessActions>) => ({
  fetchTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
  changeTableArea: bindActionCreators(BusinessController.changeTableArea, dispatch),
  tableClickHandle: bindActionCreators(BusinessController.tableClickHandle, dispatch),
  saveChoicePeople: bindActionCreators(BusinessController.saveChoicePeople, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
