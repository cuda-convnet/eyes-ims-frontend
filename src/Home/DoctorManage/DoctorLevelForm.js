import React from 'react';
import {ROLE, SESSION, DOCTOR_LEVEL, SERVER, RESULT} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col, Button, message} from 'antd';
import $ from 'jquery';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class DoctorLevelForm_ extends React.Component {

  state = {
    updateDoctorLevelBtnLoading: false
  }


  requestDoctorLevel = () => {

    console.log('拉取医师级别对应的工作量系数');

    $.ajax({
        url : SERVER + '/api/doctor/level',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            this.props.form.setFieldsValue({
              doctorHeadLevel: result.content.doctorHeadLevel,
              doctorViceHeadLevel: result.content.doctorViceHeadLevel,
              doctorTreatLevel: result.content.doctorTreatLevel,
              doctorResidentLevel: result.content.doctorResidentLevel
            });
        }
    });
  }

  handleUpdateDoctorLevel = (e) => {

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log('更新医师级别的工作量系数', values);

        //显示加载圈
        this.setState({ updateDoctorLevelBtnLoading: true });

        $.ajax({
            url : SERVER + '/api/doctor/level',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({doctorHeadLevel: values.doctorHeadLevel,
                                   doctorViceHeadLevel: values.doctorViceHeadLevel,
                                   doctorTreatLevel: values.doctorTreatLevel,
                                   doctorResidentLevel: values.doctorResidentLevel}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({ updateDoctorLevelBtnLoading: false });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ updateDoctorLevelBtnLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  componentDidMount = () => {

    this.requestDoctorLevel();
  }


  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 10 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 10},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form" style={{marginTop: 20}} onSubmit={this.handleUpdateDoctorLevel}>
        <FormItem {...formItemLayout} label="主任医师">
          {getFieldDecorator('doctorHeadLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="副主任医师">
          {getFieldDecorator('doctorViceHeadLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="主治医师">
          {getFieldDecorator('doctorTreatLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="住院医师">
          {getFieldDecorator('doctorResidentLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayoutWithoutLabel}>
          <Button type="primary" htmlType="submit" loading={this.state.updateDoctorLevelBtnLoading}>更新</Button>
        </FormItem>
      </Form>
    );
  }
}

const DoctorLevelForm = Form.create()(DoctorLevelForm_);
export default DoctorLevelForm;
