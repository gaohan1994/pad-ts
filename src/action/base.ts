import { Toast } from 'antd-mobile';

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
}

export default Base;