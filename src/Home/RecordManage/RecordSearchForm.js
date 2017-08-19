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

  handleExport = (e) => {
    e.preventDefault();
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
          <Col span={6}>
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
              {getFieldDecorator('surgeryName')(
                <Input placeholder="手术名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('surgeonName')(
                <Input placeholder="术者姓名" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('helperName')(
                <Input placeholder="助手姓名" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" style={{float: 'left'}} onClick={this.handleExport}>导出</Button>
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
