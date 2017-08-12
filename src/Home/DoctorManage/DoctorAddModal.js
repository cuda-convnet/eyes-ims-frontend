import React from 'react';
import {ROLE, SESSION, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class DoctorAddModal_ extends React.Component {

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加医师" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名" hasFeedback={true}>
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' }, {pattern: REGEX.WITHOUT_SPECIAL_CHARACTER, message: '不能包括特殊字符*.?+$^[](){}|\/'}]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="工资号" hasFeedback={true}>
              {getFieldDecorator('salaryNum', { rules: [{ required: true, message: '请输入工资号' }],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="医师级别" hasFeedback={true}>
            {getFieldDecorator('level', { rules: [{ required: true, message: '请选择医师级别'}], initialValue: DOCTOR_LEVEL[0]})(
              <Select>
                {DOCTOR_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const DoctorAddModal = Form.create()(DoctorAddModal_);
export default DoctorAddModal;
