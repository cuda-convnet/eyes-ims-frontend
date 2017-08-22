import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Input, Select,Modal, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class UserEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="修改用户信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username')(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别" hasFeedback={true}>
            {getFieldDecorator('role')(
              <Select disabled={this.props.roleSelectDisabled}>
                <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
                <Option value={ROLE.EMPLOYEE_INPUTER}>{ROLE.EMPLOYEE_INPUTER}</Option>
                <Option value={ROLE.EMPLOYEE_DOCTOR} disabled>{ROLE.EMPLOYEE_DOCTOR}</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const UserEditModal = Form.create()(UserEditModal_);
export default UserEditModal;
