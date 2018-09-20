import {
  SAVE_CHOICE_TABLEINFO,
} from '../action/constants';
import { BusinessActions } from '../action/business';
import { Stores } from './index';

export type Business = {
  table: any;
};

export const initState = {
  table: {},
};

export default function business (state: Business = initState, action: BusinessActions): Business {
  switch (action.type) {
    case SAVE_CHOICE_TABLEINFO:
    const { payload: { table } } = action;
    return {
      ...state,
      table,
    };

    default: return state;
  }
}

export const GetSelectedTable = (state: Stores) => state.business.table;