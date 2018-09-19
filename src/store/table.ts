import { 
  RECEIVE_TABLE_INFO
} from '../action/constants';
import { TableActions } from '../action/table';
import { Stores } from './index';

export type Table = {
  tableinfo: any[];
};

export const initState = {
  tableinfo: []
};

export default function table (state: Table = initState, action: TableActions): Table {
  switch (action.type) {
    case RECEIVE_TABLE_INFO:
    const { payload: { tableinfo } } = action;
    return {
      ...state,
      tableinfo,
    };

    default: return state;
  }
}

export const GetTableInfo = (state: Stores) => state.table.tableinfo;