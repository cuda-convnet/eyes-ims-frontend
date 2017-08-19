import React from 'react';
import moment from 'moment';
import {ROLE, SESSION, DATE_FORMAT} from './../../App/PublicConstant.js';
import {REGEX} from './../../App/PublicRegex.js';
import RemoteSelect from './RemoteSelect.js';
import { Form, Input, Select,Modal, Tag, Cascader, InputNumber, Row, Col, DatePicker, Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

//医师编辑对话框的表单
class RecordAddModal_ extends React.Component {

  //点击门诊时自动填充病历号为0000000000,且置为disabled
  onTypeChange = (e) => {

    let type = e.target.value;
    if(type === '门诊') {
      this.props.form.setFieldsValue({historyNum: '0000000000'});
    } else {
      this.props.form.setFieldsValue({historyNum: ''});
    }
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 7 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 12 },}};
    const formItemLayoutOfRemoteSelect = {labelCol: { xs: { span: 24 }, sm: { span: 5 },}, wrapperCol: { xs: { span: 24 }, sm: { span: 16 },}};
    const formItemLayoutWithoutLabel = {wrapperCol: { xs: { span: 24 , offset: 0}, sm: { span: 12 , offset: 7},}};

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="添加手术记录" visible={this.props.visible} onOk={this.props.onConfirm} confirmLoading={this.props.confirmLoading} onCancel={this.props.onCancel}>
        <Form className="login-form">

          <h3 className="record-header">基本信息</h3>

          <FormItem {...formItemLayout} label="手术日期" hasFeedback={true} >
            {getFieldDecorator('date', {rules: [{ required: true, message: '请选择手术日期!' }], initialValue:  moment(new Date(), DATE_FORMAT)})(
              <DatePicker style={{width: '100%'}}/>
            )}
          </FormItem>


          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type', {rules: [{ required: true, message: '请选择检查类型!' }], initialValue: "门诊"})(
            <Radio.Group onChange={this.onTypeChange}>
              <Radio.Button value="门诊">门诊</Radio.Button>
              <Radio.Button value="住院">住院</Radio.Button>
              <Radio.Button value="一日病房">一日病房</Radio.Button>
            </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="病历号" hasFeedback={true}>
              {getFieldDecorator('historyNum', { rules: [{ required: true, message: '请输入病历号' },{pattern: REGEX.NUMBER10, message:'病历号由10位数字组成'}], initialValue: "0000000000"
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名" hasFeedback={true}>
              {getFieldDecorator('name', { rules: [{ required: true, message: '请输入姓名' },{pattern: REGEX.CHINESE5_OR_LETTER10, message: '姓名不能多于5个汉字或10个英文字母'}],
              })(
              <Input />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="性别">
            {getFieldDecorator('sex', {rules: [{ required: true, message: '请选择性别!' }], initialValue: "男"})(
            <Radio.Group>
              <Radio.Button value="男">男</Radio.Button>
              <Radio.Button value="女">女</Radio.Button>
            </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="年龄" hasFeedback={true}>
              {getFieldDecorator('age', { rules: [{ required: true, message: '请输入年龄' }]})(
              <InputNumber step={1} min={0} max={99} precision={0} style={{width: '100%'}}/>
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="眼别">
            {getFieldDecorator('eye', {rules: [{ required: true, message: '请选择眼别!' }], initialValue: "左"})(
            <Radio.Group>
              <Radio.Button value="左">左</Radio.Button>
              <Radio.Button value="双">双</Radio.Button>
              <Radio.Button value="右">右</Radio.Button>
            </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="地点">
            {getFieldDecorator('place', {rules: [{ required: true, message: '请选择手术地点!' }], initialValue: "西区"})(
            <Radio.Group>
              <Radio.Button value="西区">西区</Radio.Button>
              <Radio.Button value="南区">南区</Radio.Button>
              <Radio.Button value="东区">东区</Radio.Button>
              <Radio.Button value="特需">特需</Radio.Button>
            </Radio.Group>
            )}
          </FormItem>

          <h3 className="record-header">详细信息</h3>

          <FormItem {...formItemLayoutOfRemoteSelect} label="手术" hasFeedback={true}>
              <RemoteSelect form={this.props.form} fieldName="surgeries" dataType="surgery"/>
          </FormItem>

          <FormItem {...formItemLayoutOfRemoteSelect} label="术者" hasFeedback={true}>
              <RemoteSelect form={this.props.form} fieldName="surgeons" dataType="doctor"/>
          </FormItem>

          <FormItem {...formItemLayoutOfRemoteSelect} label="助手" hasFeedback={true}>
              <RemoteSelect form={this.props.form} fieldName="helpers" dataType="doctor"/>
          </FormItem>

        </Form>
      </Modal>
    );
  }
}

const RecordAddModal = Form.create()(RecordAddModal_);
export default RecordAddModal;
