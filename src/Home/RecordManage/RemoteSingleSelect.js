import React from 'react';
import {SERVER, SESSION, RESULT} from './../../App/PublicConstant.js'
import { Select, Spin, message } from 'antd';
import debounce from 'lodash.debounce';
import $ from 'jquery';
const Option = Select.Option;

class RemoteSingleSelect extends React.Component {

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchOptions = debounce(this.fetchOptions, 800);
  }
  state = {
    data: [],
    fetching: false
  }

  fetchOptions = (keyword) => {

    if(keyword.trim() === '') return;

    console.log('远程拉取下拉列表项', keyword);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;

    this.setState({ fetching: true });
    $.ajax({
        url : SERVER + '/api/'+ this.props.dataType +'/list_keyword',
        type : 'POST',
        contentType: 'application/json',
        data : JSON.stringify({keyword: keyword}),
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            if (fetchId !== this.lastFetchId) { // for fetch callback order
              return;
            }
            const data = result.content.map(record => ({ text: record.name, value: record.name}));

            this.setState({ data ,fetching: false});
        }
    });
  }

  handleChange = (value) => {

    let field = {};
    field[this.props.fieldName] = value;

    this.props.form.setFieldsValue(field);
  }

  render() {

    const { fetching, data, value } = this.state;
    const { form, fieldName} = this.props;
    const { getFieldDecorator } = form;

    return (
      getFieldDecorator(fieldName)(
        <Select
          size="large"
          mode="combobox"
          labelInValue
          placeholder={this.props.placeholder}
          notFoundContent={fetching ? <Spin /> : null}
          filterOption={false}
          onSearch={this.fetchOptions}
          onChange={this.handleChange}
          style={{ width: '100%' }}
        >
          {data.map(d => <Option key={d.value}>{d.text}</Option>)}
        </Select>
      )
    );
  }
}

export default RemoteSingleSelect;
