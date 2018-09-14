import { 
  Toast,
  Modal,
} from 'antd-mobile';

import { isArrayFn } from '../common/config';

const { alert } = Modal;
class Base {

  /**
   * @todo toast fail 
   *
   * @static
   * @memberof Base
   */
  static toastFail = (message: string, duration?: number) => {

    Toast.fail(message, duration);
  }

  /**
   * @todo taost info
   *
   * @static
   * @memberof Base
   */
  static toastInfo = (message: string, duration?: number) => {

    Toast.info(message, duration);
  }

  static alert = (...args: Array<any>) => {
    const argByType: any = {};
    const strings: string[] = [];

    let header: string = '';
    let content: string = '';

    args.forEach(arg => {

        if (isArrayFn(arg) === true) {
          argByType.array = arg;
        } else if (typeof arg === 'string') {
          strings.push(arg);
        } else {
          argByType[typeof arg] = arg;
        }
    });

    if (strings && strings.length > 0) {
      if (strings.length === 1) {
        header = strings[0];
      } else if (strings.length === 2) {
        header = strings[0];
        content = strings[1];
      }
    }

    alert(header, content, argByType.array);
  }
}

export default Base;