import { Dispatch } from 'redux';
// import { CHANGE_SIGN_LOADING } from './constants';
import { ConsoleUtil } from '../common/request';
import PrinterService from '../service/printer';

class PrinterController {
  /**
   * @todo 获取打印机信息
   *
   * @static
   * @memberof PrinterController
   */
  static getPrinterInfo = (mchnt_cd: string) => async (dispatch: Dispatch) => {
    ConsoleUtil('getPrinterInfo');

    const params = { mchnt_cd };

    const result = await PrinterService.getPrinterInfo(params);
    if (result.code === '10000') {
      console.log(result);
    } else {
      console.log(result);
    }
  }
}

export default PrinterController;