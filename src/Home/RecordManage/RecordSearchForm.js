import React from 'react';
import {ROLE} from './../../App/PublicConstant.js';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
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
          <Col span={5}>
            <FormItem>
              {getFieldDecorator('date')(
                <RangePicker style={{width:'100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              {getFieldDecorator('surgeryName')(
                <Input placeholder="手术名称" />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              {getFieldDecorator('historyNum')(
                <Input placeholder="病历号" />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="病人姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('doctorName')(
                <Input placeholder="术者/助手姓名" />
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

const RecordSearchForm = Form.create()(RecordSearchForm_);
export default RecordSearchForm;
