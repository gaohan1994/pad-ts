import React, { Component } from 'react';
import { connect } from 'react-redux';
import QrcodeReact from 'qrcode.react';

export class PayPage extends Component {
  render() {
    return (
      <div>
        <QrcodeReact value="https://ibsbjstar.ccb.com.cn/CCBIS/QR?QRCODE=CCB9980007453634256628085"/>
      </div>
    );
  }
}

const mapStateToProps = () => ({
  
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
