import React from 'react';
import {ROLE, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class DoctorGroupEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改医师组信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入医师组名称' }]
            })(
            <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const DoctorGroupEditModal = Form.create()(DoctorGroupEditModal_);
export default DoctorGroupEditModal;
