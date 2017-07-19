import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//用户编辑对话框的表单
class UserAddModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加会员" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名" hasFeedback={true}>
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' }]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名" hasFeedback={true}>
              {getFieldDecorator('username', { rules: [{ required: true, message: '请输入手机号' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色级别" hasFeedback={true}>
            {getFieldDecorator('role', { rules: [{ required: true, message: '请选择角色'}], initialValue: ROLE.EMPLOYEE_VISITOR})(
              <Select>
                <Option value={ROLE.EMPLOYEE_ADMIN}>{ROLE.EMPLOYEE_ADMIN}</Option>
                <Option value={ROLE.EMPLOYEE_INPUTER}>{ROLE.EMPLOYEE_INPUTER}</Option>
                <Option value={ROLE.EMPLOYEE_HANDLER}>{ROLE.EMPLOYEE_HANDLER}</Option>
                <Option value={ROLE.EMPLOYEE_VISITOR}>{ROLE.EMPLOYEE_VISITOR}</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithoutLabel}>
            <Tag color="orange">默认初始密码为123456</Tag>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const UserAddModal = Form.create()(UserAddModal_);
export default UserAddModal;
