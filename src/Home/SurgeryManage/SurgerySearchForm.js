import React from 'react';
import {ROLE, SURGERY_LEVEL} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class SurgerySearchForm_ extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearchSurgeryList(1);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearchSurgeryList(1);
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
              {getFieldDecorator('code')(
                <Input placeholder="医嘱代码" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="医嘱名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('alias')(
                <Input placeholder="医嘱别名" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('level', {
                initialValue: '所有手术级别'
              })(
                <Select>
                  <Option value="">所有手术级别</Option>
                  {SURGERY_LEVEL.map((level, index) => <Option value={level} key={index}>{level}</Option>)}
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

const SurgerySearchForm = Form.create()(SurgerySearchForm_);
export default SurgerySearchForm;
