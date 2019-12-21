import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ chart }) => ({
  chart,
  // loading: loading.effects['chart/fetch'],
}))
class System extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return <div>系统信息</div>;
  }
}

export default System;
