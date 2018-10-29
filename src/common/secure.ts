import Base from '../action/base';

export interface DoEncryParam { 
  value: string;
}

export interface DoEncryReturn {
  success?: boolean;
  value?: string;
}

class Secure {
  public doEncry = (param: DoEncryParam): DoEncryReturn => {
    const { value } = param;

    if (value) {

      const result = md5(value);
      return { success: true, value: result.toUpperCase() };
    } else {

      Base.toastFail('请传入要加密的内容');
      return { success: false };
    }
  }
}

export default new Secure();