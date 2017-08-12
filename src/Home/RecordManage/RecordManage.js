import './RecordManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import RecordEditModal from './RecordEditModal.js';
import RecordSearchForm from './RecordSearchForm.js';
import RecordAddModal from './RecordAddModal.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class RecordManage extends React.Component {

  state = {

    //手术记录相关
    recordData: [],
    recordPager: {pageSize: PAGE_SIZE, total: 0},
    adviserAndManagerData: [],

    recordTableLoading: false,
    recordEditModalVisible: false,
    confirmRecordLoading: false,

    //职员添加对话框
    recordAddModalVisible: false,
    confirmRecordAddModalLoading: false
  };

  //翻页
  changeRecordPager = (pager) =>  this.handleSearchRecordList(pager.current)

  handleSearchRecordList = (pageNow) => {

    this.refs.recordSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ recordTableLoading: true});

        console.log('拉取第'+ pageNow + "页手术记录信息", values);

        $.ajax({
            url : SERVER + '/api/record/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({surgeryName: values.surgeryName,
                                   historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   surgeonName : values.surgeonName,
                                   helperName : values.helperName,
                                   beginTime: values.date !== undefined ? formatDate(values.date[0]) : undefined,
                                   endTime: values.date !== undefined ? formatDate(values.date[1]) : undefined,
                                   pageNow: pageNow,
                                   pageSize: PAGE_SIZE}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //更新页码
                const recordPager = this.state.recordPager;
                recordPager.total = result.content.rowTotal;
                recordPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  recordData: result.content.data,
                  recordPager
                });

                this.setState({ recordTableLoading: false});
            }
        });
      }
    });
  }

  //删除手术记录
  handleDeleteRecord(record) {

    console.log('删除手术记录', record);

    $.ajax({
        url : SERVER + '/api/record/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchRecordList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询recordId手术记录信息显示到对话框内
  requestRecord = (recordId) => {

    console.log('查询手术记录', recordId);

    $.ajax({
        url : SERVER + '/api/record/' + recordId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let record = result.content;

                if(this.refs.recordEditForm == null) return;
                this.refs.recordEditForm.setFieldsValue({ code: record.code,
                                                           name: record.name,
                                                           alias: record.alias,
                                                           price: record.price,
                                                           category: record.category,
                                                           chargeCode: record.chargeCode,
                                                           chargeName: record.chargeName,
                                                           chargeCount: record.chargeCount,
                                                           chargePrice: record.chargePrice,
                                                           extraPrice: record.extraPrice,
                                                           level: record.level});


                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showRecordEditModal = (record) => {

    this.setState({recordEditModalVisible: true});

    this.recordId = record.id //保存当前正在编辑的手术记录手术记录名方便提交用
    this.requestRecord(this.recordId);
  }

  closeRecordEditModal = () => this.setState({ recordEditModalVisible: false })

  //确认更新信息
  confirmRecordEditModal = () => {

    //请求修改手术记录
    this.refs.recordEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改手术记录', values);

        //显示加载圈
        this.setState({ confirmRecordLoading: true });

        $.ajax({
            url : SERVER + '/api/record',
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({recordId: this.recordId,
                                   code: values.code,
                                   name: values.name,
                                   alias: values.alias,
                                   price: values.price.toFixed(2),
                                   category: values.category,
                                   chargeCode: values.chargeCode,
                                   chargeName: values.chargeName,
                                   chargeCount: values.chargeCount.toFixed(2),
                                   chargePrice: values.chargePrice.toFixed(2),
                                   extraPrice: values.extraPrice.toFixed(2),
                                   level: values.level }),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchRecordList(this.state.recordPager.current);

                //关闭加载圈、对话框
                this.setState({
                  recordEditModalVisible: false,
                  confirmRecordLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmRecordLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  /**
  * 添加手术记录对话框
  **/
  showRecordAddModal = (record) => this.setState({ recordAddModalVisible: true})

  closeRecordAddModal = () => this.setState({ recordAddModalVisible: false})

  confirmRecordAddModal = () => {

    //请求修改职员
    this.refs.recordAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加手术记录', values);

        //显示加载圈
        this.setState({ confirmRecordAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/record',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({date: formatDate(values.date),
                                   type: values.type,
                                   historyNum: values.historyNum,
                                   name: values.name,
                                   sex: values.sex,
                                   age: Number(values.age),
                                   eye: values.eye,
                                   surgeries: values.surgeries,
                                   surgeons: values.surgeons,
                                   helpers: values.helpers}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchRecordList(this.state.recordPager.current);

                //关闭加载圈、对话框
                this.setState({
                  recordAddModalVisible: false,
                  confirmRecordAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmRecordAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  componentDidMount = () => {

    this.handleSearchRecordList(1);
  }

  render(){


    //record表头//////////
    const recordColumns = [{
      title: '病历号',
      dataIndex: 'historyNum',
      key: 'historyNum'
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },{
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },{
      title: '眼别',
      dataIndex: 'eye',
      key: 'eye',
    },{
      title: '手术日期',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date)
    },{
      title: '所做手术',
      dataIndex: 'surgeries',
      key: 'surgeries',
      render: (surgeries) => <span>{surgeries.split(',').map((surgery) => <span>{surgery}<br/></span>)}</span>
    },{
      title: '术者',
      dataIndex: 'surgeons',
      key: 'surgeons',
      render: (surgeons) => <span>{surgeons.split(',').map((surgeon) => <span>{surgeon}<br/></span>)}</span>
    },{
      title: '助手',
      dataIndex: 'helpers',
      key: 'helpers',
      render: (helpers) => <span>{helpers.split(',').map((helper) => <span>{helper}<br/></span>)}</span>
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showRecordEditModal(record)}>查看</a>
          <span className="ant-divider" />
          <a onClick={() => this.showRecordEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该手术记录吗?" onConfirm={() => this.handleDeleteRecord(record)}>
                <a className='record-table-delete'>删除</a>
              </Popconfirm>
            </span>
            :
            null
          }
        </span>
      )
    }];

    return (
        <div>
          <BackTop visibilityHeight="200"/>
          <Tabs defaultActiveKey={"1"}
                tabBarExtraContent={<Button type="primary" onClick={this.showRecordAddModal}>添加手术记录</Button>}>
            <TabPane tab="手术记录管理" key="1">
              <RecordSearchForm ref="recordSearchForm" handleSearchRecordList={this.handleSearchRecordList}/>
              <Table className='record-table' columns={recordColumns} dataSource={this.state.recordData} pagination={this.state.recordPager} onChange={this.changeRecordPager} rowKey='id' loading={this.state.recordTableLoading}/>
            </TabPane>
          </Tabs>
          <RecordEditModal ref="recordEditForm" visible={this.state.recordEditModalVisible} confirmLoading={this.state.confirmRecordLoading} onCancel={this.closeRecordEditModal} onConfirm={this.confirmRecordEditModal}  />
          <RecordAddModal ref="recordAddForm" visible={this.state.recordAddModalVisible} confirmLoading={this.state.confirmRecordAddModalLoading} onCancel={this.closeRecordAddModal} onConfirm={this.confirmRecordAddModal}  />
        </div>
    );
  }
}

export default RecordManage;
