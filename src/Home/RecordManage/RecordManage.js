import './RecordManage.css';
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, DATE_FORMAT, FILE_SERVER} from './../../App/PublicConstant.js';
import {formatDate} from './../../App/PublicUtil.js';
import moment from 'moment';
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
    recordPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},

    recordTableLoading: false,
    recordEditModalVisible: false,
    confirmRecordLoading: false,

    //职员添加对话框
    recordAddModalVisible: false,
    confirmRecordAddModalLoading: false,

    //医师组
    doctorGroupAllData: []
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
            data : JSON.stringify({historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   place: values.place,
                                   surgeryName: values.surgeryName,
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

  //导出
  handleExportRecordList = () => {

    this.refs.recordSearchForm.validateFields((err, values) => {
      if(!err) {

        console.log('导出手术记录信息', values);
        $.ajax({
            url : SERVER + '/api/record/export',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   place: values.place,
                                   surgeryName: values.surgeryName,
                                   surgeonName : values.surgeonName,
                                   helperName : values.helperName,
                                   beginTime: values.date !== undefined ? formatDate(values.date[0]) : undefined,
                                   endTime: values.date !== undefined ? formatDate(values.date[1]) : undefined}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //下载
                window.location.href = FILE_SERVER + result.content;

                //查询
                this.handleSearchRecordList(1);
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

                let record = result.content.record;

                //将surgeries、surgeons、helpers转换成多选项可识别的数据格式
                let surgeries = result.content.surgeries.map((surgery) => ({key: surgery.surgeryId.toString(), label: surgery.surgeryName}));
                let surgeons = result.content.surgeons.map((surgeon) => ({key: surgeon.doctorId.toString(), label: surgeon.doctorName}));
                let helpers = result.content.helpers.map((helper) => ({key: helper.doctorId.toString(), label: helper.doctorName}));


                if(this.refs.recordEditForm == null) return;
                this.refs.recordEditForm.setFieldsValue({date: moment(formatDate(record.date), DATE_FORMAT),
                                                         type: record.type,
                                                         historyNum: record.historyNum,
                                                         name: record.name,
                                                         sex: record.sex,
                                                         age: Number(record.age),
                                                         eye: record.eye,
                                                         surgeries: surgeries,
                                                         surgeons: surgeons,
                                                         helpers: helpers});


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

        /**
        *输入字段合法性检测
        */

        //检查手术>0
        if(values.surgeries === undefined || values.surgeries.length <= 0) {

          message.error('请至少添加一项手术', 2);
          return;
        }
        //检查术者!=0
        if(values.surgeons === undefined || values.surgeons.length <= 0) {

          message.error('请至少添加一位术者', 2);
          return;
        }
        //检查术者!>2
        if(values.surgeons.length > 2) {

          message.error('术者不能多于2位', 2);
          return;
        }



        console.log('修改手术记录', values);

        //显示加载圈
        this.setState({ confirmRecordLoading: true });

        $.ajax({
            url : SERVER + '/api/record',
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({recordId: this.recordId,
                                   date: formatDate(values.date),
                                   type: values.type,
                                   historyNum: values.historyNum,
                                   name: values.name,
                                   sex: values.sex,
                                   age: Number(values.age),
                                   eye: values.eye,
                                   place: values.place,
                                   surgeries: values.surgeries,
                                   surgeons: values.surgeons,
                                   helpers: values.helpers}),
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
  showRecordAddModal = (record) => {

    this.setState({ recordAddModalVisible: true});

    //病历号、姓名、性别、年龄 项归零
    this.refs.recordAddForm.setFieldsValue({type: '门诊',
                                            historyNum: '0000000000',
                                            name: '',
                                            sex: '男',
                                            age: ''});
  }

  closeRecordAddModal = () => this.setState({ recordAddModalVisible: false})

  confirmRecordAddModal = () => {

    //请求修改职员
    this.refs.recordAddForm.validateFields((err, values) => {
      if(!err) {

        /**
        *输入字段合法性检测
        */

        //检查手术>0
        if(values.surgeries === undefined || values.surgeries.length <= 0) {

          message.error('请至少添加一项手术', 2);
          return;
        }
        //检查术者!=0
        if(values.surgeons === undefined || values.surgeons.length <= 0) {

          message.error('请至少添加一位术者', 2);
          return;
        }
        //检查术者!>2
        if(values.surgeons.length > 2) {

          message.error('术者不能多于2位', 2);
          return;
        }


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
                                   place: values.place,
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

  //查询所有医师组
  requestAllDoctorGroups = () => {

    console.log('查询所有医师组');
    $.ajax({
        url : SERVER + '/api/doctor_group/list',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({doctorGroupAllData: result.content});
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  componentDidMount = () => {

    this.handleSearchRecordList(1);
    this.requestAllDoctorGroups();
  }

  render(){

    const role = sessionStorage.getItem(SESSION.ROLE);
    //record表头//////////
    const recordColumns = [{
      title: '病历号',
      dataIndex: 'historyNum',
      key: 'historyNum',
      fixed: 'left',
      width: 90
    },{
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      width: 50
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 60
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
      title: '地点',
      dataIndex: 'place',
      key: 'place',
    },{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date)
    },{
      title: '所做手术 / 级别 / 价格',
      dataIndex: 'surgeries',
      key: 'surgeries',
      render: (surgeries) => surgeries !== null ? <span>{surgeries.split(',').map((surgery, index) => <span key={index}>{surgery}<br/></span>)}</span> : null
    },{
      title: role === ROLE.EMPLOYEE_ADMIN ? '术者 / 级别 / 工作量' : '术者',
      dataIndex: 'surgeons',
      key: 'surgeons',
      render: (surgeons) => surgeons !== null ? <span>{surgeons.split(',').map((surgeon, index) => <span key={index}>{surgeon}<br/></span>)}</span> : null
    },{
      title: role === ROLE.EMPLOYEE_ADMIN ? '助手 / 级别 / 工作量' : '助手',
      dataIndex: 'helpers',
      key: 'helpers',
      render: (helpers) => helpers !== null ? <span>{helpers.split(',').map((helper, index) => <span key={index}>{helper}<br/></span>)}</span> : null
    },{
      title: '录入者',
      dataIndex: 'inputerName',
      key: 'inputerName',
      fixed: 'right',
      width: 80,
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (record) => (
        <span>
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
              <RecordSearchForm ref="recordSearchForm" handleSearchRecordList={this.handleSearchRecordList} handleExportRecordList={this.handleExportRecordList} doctorGroupAllData={this.state.doctorGroupAllData}/>
              <Table scroll={{ x: '160%'}} className='record-table' columns={recordColumns} dataSource={this.state.recordData} pagination={this.state.recordPager} onChange={this.changeRecordPager} rowKey='id' loading={this.state.recordTableLoading}/>
            </TabPane>
          </Tabs>
          <RecordEditModal ref="recordEditForm" visible={this.state.recordEditModalVisible} confirmLoading={this.state.confirmRecordLoading} onCancel={this.closeRecordEditModal} onConfirm={this.confirmRecordEditModal}  />
          <RecordAddModal ref="recordAddForm" visible={this.state.recordAddModalVisible} confirmLoading={this.state.confirmRecordAddModalLoading} onCancel={this.closeRecordAddModal} onConfirm={this.confirmRecordAddModal}  />
        </div>
    );
  }
}

export default RecordManage;
