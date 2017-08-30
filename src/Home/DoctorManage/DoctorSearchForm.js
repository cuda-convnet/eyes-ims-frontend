import React from 'react';
import {ROLE, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select} from 'antd';
import RemoteSingleSelect from './../RecordManage/RemoteSingleSelect.js';
const FormItem = Form.Item;
const Option = Select.Option;

class DoctorSearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchDoctorList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchDoctorList(1);
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
      >
        <Row gutter={20}>
          <Col span={6}>
            <FormItem>
              <RemoteSingleSelect form={this.props.form} fieldName="name" dataType="doctor" placeholder="姓名"/>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('salaryNum')(
                <Input placeholder="工资号" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('level', {
                initialValue: '所有医师级别'
              })(
                <Select>
                  <Option value="">所有医师级别</Option>
                  {DOCTOR_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('doctorGroupId', {
                initialValue: '所有医师组'
              })(
                <Select>
                  <Option value="">所有医师组</Option>
                  {this.props.doctorGroupAllData.map((doctorGroup, index) => <Option value={doctorGroup.id.toString()} key={index}>{doctorGroup.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const DoctorSearchForm = Form.create()(DoctorSearchForm_);
export default DoctorSearchForm;
