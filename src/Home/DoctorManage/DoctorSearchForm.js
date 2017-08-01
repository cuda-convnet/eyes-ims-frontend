import React from 'react';
import {ROLE, DOCTOR_LEVEL} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select} from 'antd';
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
        <Row gutter={40}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('salaryNum')(
                <Input placeholder="工资号" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('level', {
                initialValue: '全部'
              })(
                <Select>
                  <Option value="">全部</Option>
                  {DOCTOR_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
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
