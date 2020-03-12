import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Row, Col, Button, Card, message, InputNumber } from 'antd';
// eslint-disable-next-line import/no-unresolved
import { styleObj } from './printStyle';

class PrintExportTable extends PureComponent {
  state = {
    printData: [],
    printCol: [],
    pageNumber: 8, // 默认8条一页
    printGroupData: [],
  };

  componentDidMount() {
    const printCol = [
      {
        key: 'number',
        name: '序号',
      },
      {
        key: 'name',
        name: '商品名称',
      },
      {
        key: 'shape',
        name: '型号',
      },
      
      {
        key: 'price',
        name: '单价',
      },
      {
        key: 'num',
        name: '数量',
      },
      {
        key: 'total',
        name: '合计',
      },
      {
        key: 'extra',
        name: '备注',
      },
    ];
    const { print } = this.props;
    const printData = print.des.map((el, i) => ({
      number: i + 1,
      shape: el.shape || el.product.shape,
      name: el.name || el.product.name,
      price: parseFloat(el.price).toFixed(2),
      num: el.num,
      total: parseFloat(el.total).toFixed(2),
      extra: el.extra,
    }));

    while (printData.length === 0 || printData.length % 8 !== 0) {
      printData.push({
        number: '',
        shape: '',
        name: '',
        price: '',
        num: '',
        total: '',
        extra: '',
      });
    }
  
    const { pageNumber } = this.state;

    const printGroupData = this.page(pageNumber, printData);
    this.setState({
      printData,
      printCol,
      printGroupData,
    });
  }


  createTitle = title => (
    <div>
      <h1 style={styleObj.title}>{title}</h1>
    </div>
  );

  createHeader = () => {
    const { print } = this.props;

    return (
      <table style={{ width: '100%' }}>
        <tbody style={styleObj.header}>
          {/* <tr>
            <th>合同编号：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value="P201901020002" />
            </th>
          </tr> */}
          <tr>
            <th>订单编号：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.sn} />
            </th>
            <th>客户</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.clientName||print.client.name} />
            </th>
            <th>订单日期</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.ctime} />
            </th>
          </tr>
          <tr>
            <th>&nbsp;</th>
            <th colSpan="7">&nbsp;</th>
            <th>&nbsp;</th>
            <th colSpan="7">&nbsp;</th>
            <th>&nbsp;</th>
            <th colSpan="7">&nbsp;</th>
          </tr>
        </tbody>
      </table>
    );
  };

  createForm = (printCol, printData) => (
    <table style={styleObj.printTable}>
      <tbody>
        {
          <tr style={styleObj.printTableTr}>
            {printCol.map(item => (
              <th key={item.key} style={{ ...styleObj[item.key], ...styleObj.printTableTh }}>
                <div>{item.name}</div>
              </th>
            ))}
          </tr>
        }
        {printData.map(item => (
          <tr style={styleObj.printTableTr}>
            {Object.keys(item).map(i => (
              <td key={item.key} style={styleObj.printTableTh}>
                {item[i]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  createFooter = (footerData) => {
    const { print } = this.props;
    return (
      <table style={{ width: '100%', height: 30 }}>
      <tbody style={styleObj.footer}>
        <tr>
          <th>经办人</th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} />
          </th>
          <th></th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} />
          </th>
          <th></th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} />
          </th>
        </tr>

        <tr>
          <th>合计数量</th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
          <input style={styleObj.printInputFooter} value={print.totalNum}  />
          </th>
          <th>合计金额(元)</th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} value={print.totalPrice}  />
          </th>
          <th>{`第${footerData.current}页`}</th>
          <th>{`共${footerData.total}页`}</th>
        </tr>
      </tbody>
    </table>
    );
  };

  handlePrint = () => {
    const win = window.open('', 'printwindow');
    win.document.write(window.document.getElementById('printArea').innerHTML);
    win.print();
    win.close();
  };

  createPrintArea = printCol => {
    const { printGroupData } = this.state;
    return printGroupData.map((item, index) => (
      <div style={styleObj.printArea}>
        {this.createTitle('台州卡特机械有限公司 销售出库单')}
        {this.createHeader()}
        {this.createForm(printCol, item)}
        {this.createFooter({ current: index + 1, total: printGroupData.length })}
      </div>
    ));
  };

  handlePage = () => {
    const { pageNumber, printData } = this.state;
    if (pageNumber <= 0) {
      message.warning('输出正确的分页');
      return;
    }
    this.setState({
      printGroupData: this.page(pageNumber, printData),
    });
  };

  page = (pageNumber, printData) => {
    const printDataBack = printData.concat();
    const printGroupData = [];
    while (printDataBack.length >= pageNumber) {
      let tempGroup = [];
      tempGroup = printDataBack.splice(0, pageNumber);
      printGroupData.push(tempGroup);
    }
    if (printDataBack.length) {
      printGroupData.push(printDataBack);
    }
    printGroupData.forEach(item => {
      item.forEach((i, index) => {
        // eslint-disable-next-line no-param-reassign
        i.number = index + 1;
      });
    });
    return printGroupData;
  };

  onChange = value => {
    this.setState({
      pageNumber: value,
    });
  };

  render() {
    const { printCol, printData } = this.state;
    return (
      <Card>
        <Row>
          <Col span={22}>
            <InputNumber
              onChange={this.onChange}
              placeholder="输入自定义分页条数"
              style={{ width: 150 }}
            />
            <Button onClick={this.handlePage}>确认分页</Button>
          </Col>
          <Col span={2}>
            <Button onClick={this.handlePrint} type="primary">
              打印
            </Button>
          </Col>
        </Row>
        <Row>
          <div id="printArea">
            <div style={styleObj.printArea}>
              {printCol.length && printData.length ? this.createPrintArea(printCol) : null}
            </div>
          </div>
        </Row>
      </Card>
    );
  }
}

export default PrintExportTable;
