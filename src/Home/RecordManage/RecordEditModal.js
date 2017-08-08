import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal, Cascader, InputNumber} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class RecordEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改手术信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="代码" hasFeedback={true}>
            {getFieldDecorator('code', { rules: [{ required: true, message: '请输入记录代码' }]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称" hasFeedback={true}>
              {getFieldDecorator('name', { rules: [{ required: true, message: '请输入记录名称' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="别名" hasFeedback={true}>
              {getFieldDecorator('alias', { rules: [{ required: true, message: '请输入记录别名' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="价格" hasFeedback={true}>
              {getFieldDecorator('price', { rules: [{ required: true, message: '请输入记录价格' }], initialValue: 0,
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="子类" hasFeedback={true}>
              {getFieldDecorator('category', { rules: [{ required: true, message: '请输入记录子类' }], initialValue: '眼科手术',
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="收费代码" hasFeedback={true}>
              {getFieldDecorator('chargeCode', { rules: [{ required: true, message: '请输入收费代码' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="收费名称" hasFeedback={true}>
              {getFieldDecorator('chargeName', { rules: [{ required: true, message: '请输入收费名称' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="数量" hasFeedback={true}>
              {getFieldDecorator('chargeCount', { rules: [{ required: true, message: '请输入数量' }]})(
              <InputNumber step={1} min={0} precision={1} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="收费价格" hasFeedback={true}>
              {getFieldDecorator('chargePrice', { rules: [{ required: true, message: '请输入收费价格' }]
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="特需价格" hasFeedback={true}>
              {getFieldDecorator('extraPrice', { rules: [{ required: true, message: '请输入特需价格' }]
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const RecordEditModal = Form.create()(RecordEditModal_);
export default RecordEditModal;
