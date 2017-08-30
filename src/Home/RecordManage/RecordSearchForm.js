import React from 'react';
import {ROLE, SESSION} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
import RemoteSingleSelect from './RemoteSingleSelect.js';
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;

class RecordSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchRecordList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchRecordList(1);
  }

  handleExport = (e) => {
    e.preventDefault();
    this.props.handleExportRecordList();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={10}>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('date')(
                <RangePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('historyNum')(
                <Input placeholder="病历号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('patientName')(
                <Input placeholder="病人姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator('type', { initialValue: ''
              })(
                <Select>
                  <Option value="">所有类型</Option>
                  <Option value="门诊">门诊</Option>
                  <Option value="住院">住院</Option>
                  <Option value="一日病房">一日病房</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator('place', { initialValue: ''
              })(
                <Select>
                  <Option value="">所有地点</Option>
                  <Option value="西区">西区</Option>
                  <Option value="南区">南区</Option>
                  <Option value="东区">东区</Option>
                  <Option value="特需">特需</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <FormItem>
              <RemoteSingleSelect form={this.props.form} fieldName="surgeryName" dataType="surgery" placeholder="手术名称"/>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <RemoteSingleSelect form={this.props.form} fieldName="surgeonName" dataType="doctor" placeholder="术者名称"/>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              <RemoteSingleSelect form={this.props.form} fieldName="helperName" dataType="doctor" placeholder="助手名称"/>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('doctorGroupName', {
                initialValue: '所有医师组'
              })(
                <Select>
                  <Option value="">所有医师组</Option>
                  {this.props.doctorGroupAllData.map((doctorGroup, index) => <Option value={doctorGroup.name} key={index}>{doctorGroup.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {role === ROLE.EMPLOYEE_ADMIN ? <Button type="primary" style={{float: 'left'}} onClick={this.handleExport}>导出</Button> : null}
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const RecordSearchForm = Form.create()(RecordSearchForm_);
export default RecordSearchForm;
