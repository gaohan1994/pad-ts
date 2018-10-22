
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import TableController, { TableActions } from '../../action/table';
import BusinessController, { BusinessActions } from '../../action/business';
import { mergeProps } from '../../common/config';
import { GetTableInfo, GetSelectedTable, GetSelectedAreaId } from '../../store/table';
import { Stores } from '../../store';
import Layout from '../../component/basicLayout/Layout';
import styles from './table.less';
import LeftBar, { HeadersData, FootersData } from 'src/component/LeftBar/LeftBar';

const { Item } = Layout;

interface TableProps {
  fetchTableInfo: (id: string) => void;
  changeTableArea: (param: any) => void;
  match: { params: { id: string } };
  tableinfo: any;
  selectedTableInfo: any;
  selectedAreaId: string;
}

interface TableState {}

/**
 * @todo 改版之后的table页面
 *
 * @class Table
 * @extends {Component<TableProps, TableState>}
 */
class Table extends Component<TableProps, TableState> {

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
    const { } = this.props;
  }

  render() {
    const { tableinfo, selectedTableInfo, selectedAreaId } = this.props;
    const headers: HeadersData = {
      data: [
        [{key: '1', title: '订单号', value: '123123'}],
        [{key: '2', title: '桌号', value: '1'}, {key: '3', title: '用餐人数', value: '3人'}]
      ]
    };

    const contents = {
      data: 1,
    };
    const footers: FootersData = {
      remarks: '整单备注：123123123',
      detail: [
        [{key: '1', title: '订单号', value: '123123'}],
        [{key: '2', title: '桌号', value: '1'}, {key: '3', title: '用餐人数', value: '3人'}]
      ],
      buttons: [
        {
          style: { background: '#474747' },
          values: ['结账', '188.00'],
          onClick: () => {console.log('hello'); },
        },
        {
          values: ['下单'],
          onClick: () => {console.log('hello'); },
        },
      ]
    };
    return (
      <Layout>
        <Item position="main">
          <div style={{height: `${document && document.documentElement && document.documentElement.clientHeight - 64}px`}} className={styles.tables}>
            {
              selectedTableInfo && selectedTableInfo.tables.map((table: any) => {
                const { peopelNum } = selectedTableInfo;
                return (
                  <div 
                    key={table.table_no}
                    className={`
                      ${styles.table}
                      ${table.status === 1 ? styles.occupy : styles.unoccupy}
                    `}
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
              <span className={styles.searchIcon}/>
              <span>搜索</span>
            </div>
            {tableinfo.map((area: any) => {
              return (
                <div 
                  key={area.area_id}
                  className={selectedAreaId === area.area_id ? styles.activeArea : styles.normalArea}
                  onClick={() => this.onAreaClickHandle(area)}
                >
                  {selectedAreaId === area.area_id ? <div className={styles.active}/> : ''}
                  {area.area_name}
                </div>
              );
            })}
          </div>
        </Item>
      </Layout>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  tableinfo: GetTableInfo(state),
  selectedTableInfo: GetSelectedTable(state),
  selectedAreaId: GetSelectedAreaId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<TableActions | BusinessActions>) => ({
  fetchTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
  changeTableArea: bindActionCreators(BusinessController.changeTableArea, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
