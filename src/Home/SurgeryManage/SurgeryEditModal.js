import React from 'react';
import {ROLE, SURGERY_LEVEL} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal, Cascader, InputNumber} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class SurgeryEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改手术信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="代码" hasFeedback={true}>
            {getFieldDecorator('code', { rules: [{ required: true, message: '请输入医嘱代码' }]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称" hasFeedback={true}>
              {getFieldDecorator('name', { rules: [{ required: true, message: '请输入医嘱名称' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="别名" hasFeedback={true}>
              {getFieldDecorator('alias', { rules: [{ required: true, message: '请输入医嘱别名' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="价格" hasFeedback={true}>
              {getFieldDecorator('price', { rules: [{ required: true, message: '请输入医嘱价格' }], initialValue: 0,
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="子类" hasFeedback={true}>
              {getFieldDecorator('category', { rules: [{ required: true, message: '请输入医嘱子类' }], initialValue: '眼科手术',
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
          <FormItem {...formItemLayout} label="手术级别" hasFeedback={true}>
            {getFieldDecorator('level', { rules: [{ required: true, message: '请选择手术级别'}]})(
              <Select>
                {SURGERY_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const SurgeryEditModal = Form.create()(SurgeryEditModal_);
export default SurgeryEditModal;
