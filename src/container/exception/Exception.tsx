/**
 * created by Ghan 9.6
 * 
 * 错误跳转页面 
 */
import * as React from 'react';

/**
 * @param status router 传递 -- 错误码
 *
 * @interface ExceptionProps
 */
interface ExceptionProps {
  match: {
    params: {
      status: number;
    }
  };
}

class Exception extends React.Component<ExceptionProps, {}> {

  public render() {
    const { match: { params: { status } } } = this.props;
    return (
      <div>
        Exception {status}
      </div>
    );
  }
}

export default Exception;
