import React, { Component } from 'react';
import { connect } from 'dva';

import { Form, Modal } from 'antd';
// eslint-disable-next-line import/no-unresolved
import PrintTable from './printTable';

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
export default class PrintModal extends Component {
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
        </Modal>
      </span>
    );
  }
}
