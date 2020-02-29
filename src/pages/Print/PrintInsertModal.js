import React, { Component } from 'react';
import { connect } from 'dva';

import { Form, Modal } from 'antd';
// eslint-disable-next-line import/no-unresolved
import PrintTable from './printInsertTable';

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
export default class PrintInsertModal extends Component {
  constructor(props) {
    super(props);
    this.printHtml = React.createRef();
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {};

  render() {
    const { visible } = this.state;
    const { children, record, showModel, controlHideModelHandler } = this.props;
    let totalNum = 0;
    let totalPrice = 0;
    if (record.des) {
      totalNum = record && record.des.reduce((pre, cur) => Number(pre) + Number(cur.num), 0);
      totalPrice =
        record &&
        record.des.reduce((pre, cur) => Number(pre) + Number(cur.num) * Number(cur.price), 0);
    }

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={960}
          destroyOnClose
          centered
          title="打印"
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible || showModel}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={controlHideModelHandler || this.hideModelHandler}
        >
          <PrintTable print={record} />
          <div
            style={{
              height: 50,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: 20 }}>共{totalNum}个</div>
            <div>￥ {totalPrice}</div>
          </div>
        </Modal>
      </span>
    );
  }
}
