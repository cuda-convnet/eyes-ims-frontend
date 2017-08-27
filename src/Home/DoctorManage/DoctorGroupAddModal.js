import React from 'react';
import {ROLE, SESSION, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class DoctorGroupAddModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加医师组" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="名称" hasFeedback={true}>
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

const DoctorGroupAddModal = Form.create()(DoctorGroupAddModal_);
export default DoctorGroupAddModal;
