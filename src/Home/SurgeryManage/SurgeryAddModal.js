import React from 'react';
import {ROLE, SESSION, SURGERY_LEVEL} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class SurgeryAddModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加手术医嘱" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
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
              {getFieldDecorator('chargeCount', { rules: [{ required: true, message: '请输入数量' }], initialValue: 1})(
              <InputNumber step={1} min={0} precision={1} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="收费价格" hasFeedback={true}>
              {getFieldDecorator('chargePrice', { rules: [{ required: true, message: '请输入收费价格' }], initialValue: 0,
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="特需价格" hasFeedback={true}>
              {getFieldDecorator('extraPrice', { rules: [{ required: true, message: '请输入特需价格' }], initialValue: 0,
              })(
              <InputNumber  min={0} precision={2} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="手术级别" hasFeedback={true}>
            {getFieldDecorator('level', { rules: [{ required: true, message: '请选择手术级别'}], initialValue: SURGERY_LEVEL[0]})(
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

const SurgeryAddModal = Form.create()(SurgeryAddModal_);
export default SurgeryAddModal;
