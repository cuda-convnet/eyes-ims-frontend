import React from 'react';
import {ROLE, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Cascader} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class DoctorEditModal_ extends React.Component {

  render() {

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};


    const { getFieldDecorator } = this.props.form;
    const { doctorGroupAllData } = this.props;
    return (
      <Modal title="修改医师信息" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' }, {pattern: REGEX.WITHOUT_SPECIAL_CHARACTER, message: '不能包括特殊字符,*.?+$^[](){}|\\/'}]
            })(
            <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="工资号">
            {getFieldDecorator('salaryNum', { rules: [{ required: true, message: '请输入工资号' }]
            })(
            <Input disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="医师级别" hasFeedback={true}>
            {getFieldDecorator('level', { rules: [{ required: true, message: '请选择医师级别' }]
            })(
              <Select>
                {DOCTOR_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属医师组" hasFeedback={true}>
            {getFieldDecorator('doctorGroupId', { rules: [{ required: true, message: '请选择医师组'}], initialValue: doctorGroupAllData.length <= 0 ? '' : doctorGroupAllData[0].name
            })(
              <Select>
                {doctorGroupAllData.map((doctorGroup, index) => <Option value={doctorGroup.id.toString()} key={index}>{doctorGroup.name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
const DoctorEditModal = Form.create()(DoctorEditModal_);
export default DoctorEditModal;
