import React from 'react';
import {ROLE, SESSION, DOCTOR_LEVEL, SERVER, RESULT} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col, Button, message} from 'antd';
import $ from 'jquery';
const FormItem = Form.Item;
const Option = Select.Option;

//手术编辑对话框的表单
class SurgeryLevelForm_ extends React.Component {

  state = {
    updateSurgeryLevelBtnLoading: false
  }

  requestSurgeryLevel = () => {

    console.log('拉取手术级别对应的工作量系数');

    $.ajax({
        url : SERVER + '/api/surgery/level',
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
              surgeryFifthLevel: result.content.surgeryFifthLevel,
              surgeryForthLevel: result.content.surgeryForthLevel,
              surgeryThirdLevel: result.content.surgeryThirdLevel,
              surgerySecondLevel: result.content.surgerySecondLevel,
              surgeryFirstLevel: result.content.surgeryFirstLevel
            });
        }
    });
  }

  handleUpdateSurgeryLevel = (e) => {

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log('更新手术级别的工作量系数', values);

        //显示加载圈
        this.setState({ updateSurgeryLevelBtnLoading: true });

        $.ajax({
            url : SERVER + '/api/surgery/level',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({ surgeryFifthLevel: values.surgeryFifthLevel,
                                    surgeryForthLevel: values.surgeryForthLevel,
                                    surgeryThirdLevel: values.surgeryThirdLevel,
                                    surgerySecondLevel: values.surgerySecondLevel,
                                    surgeryFirstLevel: values.surgeryFirstLevel}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //关闭加载圈、对话框
                this.setState({ updateSurgeryLevelBtnLoading: false });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ updateSurgeryLevelBtnLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  componentDidMount = () => {

    this.requestSurgeryLevel();
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 10 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 10},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form" style={{marginTop: 20}} onSubmit={this.handleUpdateSurgeryLevel}>
        <FormItem {...formItemLayout} label="五级手术">
          {getFieldDecorator('surgeryFifthLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="四级手术">
          {getFieldDecorator('surgeryForthLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="三级手术">
          {getFieldDecorator('surgeryThirdLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="二级手术">
          {getFieldDecorator('surgerySecondLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="一级手术">
          {getFieldDecorator('surgeryFirstLevel', { rules: [{ required: true, message: '请输入系数' }]
          })(
          <InputNumber step={1} min={0} max={99} precision={0} style={{width: '50%'}}/>
          )}
        </FormItem>
        <FormItem {...formItemLayoutWithoutLabel}>
          <Button type="primary" htmlType="submit" loading={this.state.updateSurgeryLevelBtnLoading}>更新</Button>
        </FormItem>
      </Form>
    );
  }
}

const SurgeryLevelForm = Form.create()(SurgeryLevelForm_);
export default SurgeryLevelForm;
