/**
 * @param { created by Ghan 9.20 }
 */
import * as React from 'react';
import { Grid } from 'antd-mobile';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import TableController, { TableActions } from '../../action/table';
import BusinessController, { BusinessActions } from '../../action/business';
import { mergeProps } from '../../common/config';
import { GetUserinfo } from '../../store/sign';
import { GetTableInfo } from '../../store/table';
import { Stores } from '../../store';
import numeral from 'numeral';

/**
 * @param { getTableInfo 请求桌子信息 }
 * @param { userinfo 获取mchnt_cd }
 * @param { tableinfo 拿到桌子信息 }
 *
 * @interface TableProps
 */
interface TableProps {
  getTableInfo: (mchnt_cd: string) => void;
  saveChoiceTable: (table: any) => void;
  userinfo: any;
  tableinfo: any;
}

class Table extends React.Component<TableProps, {}> {

  componentDidMount = () => {
    this.fetchTable();
  }
  
  /**
   * @todo 查询桌子情况
   *
   * @memberof Table
   */
  public fetchTable = () => {
    const { getTableInfo, userinfo } = this.props;
    getTableInfo(userinfo.mchnt_cd);
  }

  /**
   * @todo 点击回调
   *
   * @memberof Table
   */
  public onChoiceTable = (table: any) => {

    if (numeral(table.status).value() === 1) {
      console.log('如果是已经占用 直接请求该桌子订单');
    } else if (numeral(table.status).value() === 0) {
      const { saveChoiceTable } = this.props;
      saveChoiceTable(table);
    }
  }

  public render() {
    const { tableinfo } = this.props;
    return (
      <div>
        {
          tableinfo && tableinfo.length > 0
          ? tableinfo.map((area: any, index: number) => {

            const data = area.tables.map((table: any) => {
              return {
                area_id: tableinfo[index].area_id,
                area_name: tableinfo[index].area_name,
                peopelNum: tableinfo[index].peopelNum,
                ...table,
                icon: '',
                text: table.table_name
              };
            });

            return (
              <div key={index}>
                <div>{area.area_name}</div>
                <Grid 
                  data={data} 
                  columnNum={4}
                  onClick={(table) => this.onChoiceTable(table)}
                />
              </div>
            );
          })
          : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  tableinfo: GetTableInfo(state),
  userinfo: GetUserinfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<TableActions | BusinessActions>) => ({
  getTableInfo: bindActionCreators(TableController.getTableInfo, dispatch),
  saveChoiceTable: bindActionCreators(BusinessController.saveChoiceTable, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
