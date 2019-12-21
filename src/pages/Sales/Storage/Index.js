import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Card, Form, Input, Table, Button } from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';

import styles from './product.less';

// const { Option } = Select;

@connect(({ storage1, user }) => ({
  storage1,
  currentUser: user.currentUser,
  // loading: loading.models.product,
}))
@Form.create()
class StorageIndex extends PureComponent {
  state = {
    // categorys: [],
    abbr: '',
    category: '',
    // loading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.fetchList();
    // 查询分类
    dispatch({
      type: 'product/fetchCategoryOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          // categorys: res.data,
        });
      }
    });
    // dispatch({
    //   type: 'product/fetchSupporterOption',
    // }).then(res => {
    //   if (res.code === 200) {
    //     this.setState({
    //       supporters: res.data,
    //     });
    //   }
    // });

    //   dispatch({
    //     type: 'product/fetchTypeOption',
    //   }).then(res => {
    //     if (res.code === 200) {
    //       this.setState({
    //         units: res.data,
    //       });
    //     }
    //   });
  }

  content = index => (
    <div>
      <Input placeholder="请输入产品名称" />
      <p style={{ margin: 0, paddingTop: 10, textAlign: 'right' }}>
        <Button size="small" onClick={() => this.hide(index)}>
          取消
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" size="small">
          保存
        </Button>
      </p>
    </div>
  );

  // 查询产品列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    const { category, abbr } = this.state;
    const param = { ...params };
    if (category) param.category = category;
    if (abbr) param.abbr = abbr;
    dispatch({ type: 'storage1/fetch', payload: param });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const { abbr, category } = this.state;
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    if (abbr) param.abbr = abbr;
    if (category) param.category = category;
    this.fetchList(param);
  };

  handleSearch = val => {
    this.setState(
      {
        ...val,
      },
      () => {
        this.fetchList();
      }
    );
  };

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };

  // 分类选择查询
  handleCategoryChange = val => {
    // const params = val ? {} : {};
    this.setState({ category: val }, () => {
      this.fetchList();
    });
  };

  render() {
    const {
      storage1: { list, pagination },
    } = this.props;
    // const { categorys } = this.state;

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      // {
      //   title: '存货编码',
      //   dataIndex: 'product.sn',
      //   width: 100,
      //   key: 'product.sn',
      // },
      // {
      //   title: '图片',
      //   dataIndex: 'cover',
      //   width: 100,
      //   key: 'cover',
      //   render: cover =>
      //     cover.length === 0 ? (
      //       <div style={{ width: 80, height: 80, lineHeight: 80 }} />
      //     ) : (
      //       <img src={cover[0]} style={{ display: 'inline-block', width: 80, height: 80 }} alt="" />
      //     ),
      // },
      {
        title: '存货名称',
        dataIndex: 'product.name',
        width: 100,
        key: 'product.name',
      },
      {
        title: '规格型号',
        dataIndex: 'product.shape',
        width: 100,
        key: 'product.shape',
      },
      {
        title: '包装',
        dataIndex: 'product.pack',
        width: 100,
        key: 'product.pack',
      },

      // {
      //   title: '供应商',
      //   width: 300,
      //   key: 'supporter',
      //   render: (text, record) => (
      //     <div>
      //       {record.supporter.map(element => (
      //         <p style={{ margin: 0 }} key={element.name}>
      //           {element.name}
      //         </p>
      //       ))}
      //     </div>
      //   ),
      // },

      {
        title: '分类',
        dataIndex: 'product.category',
        width: 100,
        key: 'product.category',
        render: category => <span>{category ? category.name : '无'}</span>,
      },
      {
        title: '计量单位',
        dataIndex: 'product.type',
        width: 100,
        key: 'product.type',
        render: type => <span>{type ? type.name : '无'}</span>,
      },
      {
        title: '生产许可证',
        width: 150,
        dataIndex: 'product.license',
        key: 'product.license',
      },
      {
        title: '生产企业',
        width: 150,
        dataIndex: 'product.company',
        key: 'product.company',
      },
      {
        title: '批准文号',
        width: 150,
        dataIndex: 'product.sn',
        key: 'product.sn',
      },
      {
        title: '仓库',
        width: 150,
        dataIndex: 'storage.name',
        key: 'storage.name',
      },
      {
        title: '批号',
        width: 150,
        dataIndex: 'batch',
        key: 'batch',
      },
      {
        title: '生产日期',
        width: 150,
        dataIndex: 'start',
        key: 'start',
      },
      {
        title: '有效日期',
        width: 150,
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: '数量',
        width: 150,
        dataIndex: 'num',
        key: 'num',
        sorter: true,
      },
      {
        title: '售价',
        width: 150,
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '合计',
        width: 150,
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '备注',
        width: 200,
        dataIndex: 'intro',
        key: 'intro',
        render: text => <p>{text}</p>,
      },
      {
        title: '采购日期',
        width: 200,
        dataIndex: 'ctime',
        key: 'ctime',
        render: text => <p>{text}</p>,
      },
    ];

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Select
                size="large"
                style={{ width: 200, marginRight: 20 }}
                placeholder="选择产品分类"
                allowClear
                onChange={this.handleCategoryChange}
              >
                {categorys.map(el => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
              </Select> */}
              {/* <Button
                icon="plus"
                type="primary"
                size="large"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button> */}
              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="abbr"
                  placeholder="首字母搜索"
                  handlerEnter={val => this.handleSearch(val)}
                />
              </div>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              // loading={loading}
              dataSource={list}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              scroll={{ x: 1400, y: 540 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StorageIndex;
