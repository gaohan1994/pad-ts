/**
 * @param { created by Ghan }
 */

import { 
  RECEIVE_TABLE_INFO,
  CHANGE_TABLE_AREA,
} from '../action/constants';
import { TableActions } from '../action/table';
import { BusinessActions } from '../action/business';
import { Stores } from './index';

export type Table = {
  selectedAreaId: string;
  tableinfo: any[];
};

export const initState = {
  selectedAreaId: '',
  tableinfo: []
};

/**
 * @todo table reducer
 *
 * @export
 * @param {Table} [state=initState]
 * @param {(TableActions | BusinessActions)} action
 * @returns {Table}
 */
export default function table (
  state: Table = initState,
  action: TableActions | BusinessActions
): Table {
  switch (action.type) {

    case RECEIVE_TABLE_INFO:
    /**
     * @param { tableinfo 初始化table信息，同时存入第一个数据的area_id （default） }
     */
    const { payload: { tableinfo } } = action;
    
    return {
      ...state,
      tableinfo,
      selectedAreaId: tableinfo[0].area_id,
    };

    /**
     * @param { 1.selectedAreaId: change selectedAreaId in redux }
     * @param { 2.save table's orders from fetch callback }
     */
    case CHANGE_TABLE_AREA:
      const { payload: { selectedAreaId } } = action;
      return {
        ...state,
        selectedAreaId,
      };

    default: return state;
  }
}

/**
 * @todo export tableinfo from redux
 * @param { state: Store }
 */
export const GetTableInfo = (state: Stores) => state.table.tableinfo;

/**
 * @todo find selected table in redux
 * @param { state: Store }
 */
export const GetSelectedTable = (state: Stores) => {
  const { table: { selectedAreaId, tableinfo } } = state;
  const selectedTable = tableinfo.find(t => t.area_id === selectedAreaId);
  return selectedTable;
};

export const GetSelectedAreaId = (state: Stores) => state.table.selectedAreaId;