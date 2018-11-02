import React, { Component } from 'react';
import { Modal, Pagination } from 'antd';
import { connect, Dispatch } from 'react-redux';
import { Stores } from '../../store';
import { mergeProps } from '../../common/config';
import StatusController, { StatusAtions } from '../../action/status';
import BusinessController from '../../action/business';
import { GetChangeTableModalStatus } from '../../store/status';
import { bindActionCreators } from 'redux';
import styles from './styles.less';
import { GetTableInfo } from '../../store/table';
import numeral from 'numeral';
import TableController, { ChangeTableParams } from '../../action/table';

/**
 * @param {PAGESIZE} 每页数量
 */
const PAGESIZE: number = 3 * 5;

export const AnalysisSelectedTable = (tableinfo: any[], selectedAreaId: string): any => {
  if (tableinfo && tableinfo.length > 0 && selectedAreaId) {
    const selectedArea = tableinfo.find(a => a.area_id === selectedAreaId);

    if (selectedArea) {
      return selectedArea;
    } else {
      return {};
    }
  } else {
    return {};
  }
};

interface TableModalProps { 
  dispatch?: Dispatch<any>;
  changeTableModalStatus?: boolean;
  tableInfo?: any;
  changeModalHandle?: (param: any) => void;
  changeTable?: (param: ChangeTableParams) => void;
  tableClickHandle?: (param?: any) => void;
}

interface TableModalState {
  currentPage: number;
  selectedTable: any;
  selectedAreaId: string;
}

class TableModal extends Component<TableModalProps, TableModalState> {
  constructor(props: TableModalProps) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedTable: {},
      selectedAreaId: ''
    };
  }

  componentWillReceiveProps(nextProps: TableModalProps) {
    this.init(nextProps);
  }

  /**
   * @todo 初始化数据 
   * @param {TableModalProps} 1.set selectedAreaId default as tableinfo[0]
   *
   * @memberof TableModal
   */
  public init = (props: TableModalProps) => {
    const { tableInfo } = props;

    if (tableInfo && tableInfo.length > 0) {
      this.setState({ selectedAreaId: tableInfo[0].area_id });
      this.setState({ selectedTable: {} });
    }
  }

  /**
   * @todo 改变选中的area
   *
   * @memberof TableModal
   */
  setSelectedAreaId = (param: any) => {
    const { area_id } = param;
    this.setState({
      selectedAreaId: area_id,
    });
    console.log('setSelectedArea tableInfo: ', param);
  }

  /**
   * @todo 隐藏换桌modal
   *
   * @memberof TableModal
   */
  public hideChangeTableModal = () => {
    const { changeModalHandle } = this.props;

    if (changeModalHandle) {
      const params = { changeTableModalStatus: false, };
      changeModalHandle(params);
    }
  }

  /**
   * @todo 切换区域的时候也把
   *
   * @memberof TableModal
   */
  public onAreaClickHandle = (area: any) => {
    this.setSelectedAreaId(area);
    this.changeCurrentPage(1);
  }

  public changeCurrentPage = (page: number) => {
    this.setState({
      currentPage: page,
    });
  }

  /**
   * @todo set selectedTable
   *
   * @memberof TableModal
   */
  public onTableClickHandle = (table: any) => {
    this.setState({
      selectedTable: table
    });
  }

  public onConfirmHandle = () => {
    const { selectedTable } = this.state;
    const { changeTable } = this.props;
    if (selectedTable.table_no && changeTable) {
      changeTable({ table: selectedTable, searchTableCallback: this.successCallback });
    }
  }

  public successCallback = (param?: any) => {
    const { tableClickHandle, changeModalHandle } = this.props;

    /**
     * @param {changeModalHandle} 隐藏modal
     * @param {tableClickHandle} 请求一次新的桌子 
     */
    if (tableClickHandle && param && changeModalHandle) {
      const params = { changeTableModalStatus: false, };
      changeModalHandle(params);
      tableClickHandle(param);
    }
  }

  render() {
    const { selectedAreaId, selectedTable, currentPage } = this.state;
    const { changeTableModalStatus, tableInfo } = this.props;

    const selectedArea = AnalysisSelectedTable(tableInfo, selectedAreaId);
    return (
      <Modal 
        visible={changeTableModalStatus} 
        centered={true} 
        closable={false}
        title="选择要更换的桌位"
        className="my-change-table-modal"
        footer={null}
      >
        <div className={styles.contents}>
          <div className={styles.tables}>
            {
              selectedArea && selectedArea.tables ? (
                selectedArea.tables.slice((currentPage - 1) * PAGESIZE, currentPage * PAGESIZE).map((table: any) => {
                  return (
                    <div 
                      key={table.table_no} 
                      className={
                        `${selectedTable.table_no}` === `${table.table_no}` 
                        ? styles.activeTable
                        : numeral(table.status).value() === 1 
                          ? styles.occupyTable
                          : styles.normalTable}
                      onClick={
                        numeral(table.status).value() === 1 
                        ? () => {/** en empty */}
                        : () => this.onTableClickHandle(table)
                      }
                    >
                      <div className={styles.tableTip}>{`可供${selectedArea.peopelNum}人`}</div>
                      {table.table_name}
                    </div>
                  );
                })
              ) : ''
            }
            {
              selectedArea && selectedArea.tables ? (
                <div className={styles.pagination}>
                  <Pagination
                    hideOnSinglePage={true}
                    current={currentPage}
                    size="small"
                    total={selectedArea.tables.length} 
                    pageSize={PAGESIZE}
                    onChange={this.changeCurrentPage}
                  />
                </div>
              ) : ''
            }
          </div>
          <div className={styles.bar}>
            {
              tableInfo && tableInfo.length > 0 ? (
                tableInfo.map((area: any) => {
                  return (
                    <div 
                      key={area.area_id} 
                      className={selectedAreaId === area.area_id ? styles.activeArea : styles.normalArea}
                      onClick={() => this.onAreaClickHandle(area)}
                    >
                      {
                        selectedAreaId === area.area_id ? (
                          <div className={styles.themeIcon}/>
                        ) : ''
                      }
                      {area.area_name}
                    </div>
                  );
                })
              ) : ''
            }
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={() => this.hideChangeTableModal()}>取消</div>
          <div className={`${styles.button} ${styles.confirm}`} onClick={() => this.onConfirmHandle()}>确定</div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  changeTableModalStatus: GetChangeTableModalStatus(state),
  tableInfo: GetTableInfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<StatusAtions>) => ({
  dispatch,
  changeModalHandle: bindActionCreators(StatusController.changeTableModalStatus, dispatch),
  changeTable: bindActionCreators(TableController.changeTable, dispatch),
  tableClickHandle: bindActionCreators(BusinessController.tableClickHandle, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TableModal);
