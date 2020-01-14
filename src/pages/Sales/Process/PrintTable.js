import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Row, Col, Button, Card, message, InputNumber } from 'antd';
// eslint-disable-next-line import/no-unresolved
import { styleObj } from './printStyle';

class PrintTable extends PureComponent {
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
        key: 'shape',
        name: '型号',
      },
      {
        key: 'name',
        name: '商品名称',
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
      shape: el.product.shape,
      name: el.product.name,
      price: el.price,
      num: el.num,
      total: el.total,
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
    // const printData = [
    //   { number: 1, goodsName: '1111', goodsType: '2222', unitName: 'sfs', specifications: 'sfsdf' },
    //   { number: 1, goodsName: '1111', goodsType: '2222', unitName: 'sfs', specifications: 'sfsdf' },
    //   { number: 1, goodsName: '1111', goodsType: '2222', unitName: 'sfs', specifications: 'sfsdf' },
    //   { number: 1, goodsName: '1111', goodsType: '2222', unitName: 'sfs', specifications: 'sfsdf' },
    // ];
    const { pageNumber } = this.state;
    // const { print:{ data } } = this.props;
    // formPrintData.forEach((i,index)=>{
    //   const colData = {};
    //   printCol.forEach(j=>{
    //     colData[j.key] = i[j.key];
    //   })
    //   colData.number = index+1;
    //   printData.push(colData);
    // });

    const printGroupData = this.page(pageNumber, printData);
    this.setState({
      printData,
      printCol,
      printGroupData,
    });
  }

  // componentWillReceiveProps(nextProps){
  // const printCol = [
  //   {
  //     key:'number',
  //     name:'序号',
  //   },{
  //     key:'goodsName',
  //     name:'商品名称',
  //   },{
  //     key:'goodsType',
  //     name:'商品类型',
  //   },{
  //     key:'unitName',
  //     name:'单位',
  //   },{
  //     key:'specifications',
  //     name:'规格',
  //   }];
  //   const printData =[
  //     [1,2,3,4,5],
  //     [1,2,3,4,5],
  //     [1,2,3,4,5],
  //     [1,2,3,4,5],
  //     [1,2,3,4,5],
  //   ];
  // const { pageNumber } = this.state;
  // const { print:{ data } } = nextProps;
  // formPrintData.forEach((i,index)=>{
  //   const colData = {};
  //   printCol.forEach(j=>{
  //     colData[j.key] = i[j.key];
  //   })
  //   colData.number = index+1;
  //   printData.push(colData);
  // });
  // const printGroupData = this.page(pageNumber,printData);
  // this.setState({
  //   printData,
  //   printCol,
  //   printGroupData,
  // })
  // }

  createTitle = title => (
    <div>
      <h1 style={styleObj.title}>{title}</h1>
    </div>
  );

  createHeader = () => {
    const { print } = this.props;
    // const headerData = [
    //   {
    //     orderID: '合同编号',
    //     value: print.sn,
    //   },
    //   {
    //     people: '客户',
    //     value: print.client.name,
    //   },
    //   {
    //     time: '合同日期',
    //     value: print.ctime,
    //   },
    // ];
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
            <th>合同编号：</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.sn} />
            </th>
            <th>客户</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.client && print.client.name} />
            </th>
            <th>合同日期</th>
            <th colSpan="7">
              <input style={styleObj.printInput} value={print.ctime} />
            </th>
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

  createFooter = footerData => (
    <table style={{ width: '100%', height: 30 }}>
      <tbody style={styleObj.footer}>
        <tr>
          <th>供应商（签字）</th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} />
          </th>
          <th>库管员（签字）</th>
          <th>
            <div style={styleObj.footerSpace} />
          </th>
          <th colSpan="4">
            <input style={styleObj.printInputFooter} />
          </th>
          <th>{`第${footerData.current}页`}</th>
          <th>{`共${footerData.total}页`}</th>
        </tr>
      </tbody>
    </table>
  );

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
        {this.createTitle('xxxxxxx公司xxx单')}
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

export default PrintTable;
