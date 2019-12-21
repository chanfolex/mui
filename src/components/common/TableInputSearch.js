import React from 'react';
import { Input, Form, Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';

const FormItem = Form.Item;
@Form.create()
export default class TableInputSearch extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     targetValue: '',
  //   };
  // }

  handleSearch = e => {
    e.preventDefault();
    // const { form, field, handlerEnter } = this.props;
    // form.validateFields((err, values) => {
    //   if (err) return;
    //   const obj = {};
    //   obj[field] = values.abbr;
    //   handlerEnter(obj);
    // });
  };

  @Debounce(400)
  onChange = e => {
    const { handlerEnter, field } = this.props;
    const obj = {};
    obj[field] = e.currentTarget.value;
    handlerEnter(obj);
  };

  emitEmpty = () => {
    const { form, handlerEnter, field } = this.props;
    form.setFieldsValue({
      abbr: '',
    });
    const obj = {};
    obj[field] = '';
    handlerEnter(obj);
  };

  render() {
    const { form, placeholder } = this.props;
    const { getFieldDecorator } = form;

    const suffix = form.getFieldValue('abbr') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: 10 }}>
        <FormItem label="">
          {getFieldDecorator('abbr')(
            <Input
              suffix={suffix}
              placeholder={placeholder}
              onChange={this.onChange}
              size="large"
              autoComplete="off"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
