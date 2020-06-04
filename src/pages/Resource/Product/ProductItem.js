import React from 'react';
import { Form, Select, Button, InputNumber } from 'antd';

const { Option } = Select;

// eslint-disable-next-line react/prefer-stateless-function
class ProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      productOption: [],
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { bom } = this.props;
    this.fetchProductOption(bom.id === undefined ? '' : bom.id);
  }

  fetchProductOption(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchProductOption',
      payload: { abbr: value },
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          productOption: res.data.list,
        });
      }
    });
  }

  selectSearchHandle(e) {
    this.fetchProductOption(e);
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form;
    const { addHandle, deleteHandle, id, bom } = this.props;
    const { productOption } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    return (
      <div>
        <Form layout="inline">
          <Form.Item required label="产品">
            {getFieldDecorator('product', {
              rules: [{ required: true, message: '请选择产品' }],
              initialValue: bom.product,
            })(
              <Select
                allowClear
                showSearch
                placeholder="请选择产品"
                // eslint-disable-next-line no-return-assign
                onChange={value => (bom.product = value)}
                style={{ width: '200px' }}
                onSearch={e => this.selectSearchHandle(e)}
              >
                {productOption.map(el => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item required label="数量">
            {getFieldDecorator('num', {
              rules: [{ required: true, message: '请输入数量' }],
              initialValue: bom.num,
            })(
              <InputNumber
                placeholder="请输入数量"
                style={{ width: '200px' }}
                min={0}
                // eslint-disable-next-line no-return-assign
                onChange={value => (bom.num = value)}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape="circle" icon="plus" onClick={() => addHandle()} />
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              style={{ marginLeft: 10 }}
              onClick={() => deleteHandle(id)}
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedAddProductForm = Form.create({ name: 'bom' })(ProductItem);

export default WrappedAddProductForm;
