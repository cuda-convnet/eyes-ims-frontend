import './DoctorManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import DoctorEditModal from './DoctorEditModal.js';
import DoctorSearchForm from './DoctorSearchForm.js';
import DoctorAddModal from './DoctorAddModal.js';
import DoctorLevelForm from './DoctorLevelForm.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class DoctorManage extends React.Component {

  state = {

    //医师相关
    doctorData: [],
    doctorPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},

    doctorTableLoading: false,
    doctorEditModalVisible: false,
    confirmDoctorLoading: false,

    //职员添加对话框
    doctorAddModalVisible: false,
    confirmDoctorAddModalLoading: false
  };

  //翻页
  changeDoctorPager = (pager) =>  this.handleSearchDoctorList(pager.current)

  handleSearchDoctorList = (pageNow) => {

    this.refs.doctorSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ doctorTableLoading: true});

        console.log('拉取第'+ pageNow + "页医师信息", values);

        $.ajax({
            url : SERVER + '/api/doctor/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   salaryNum : values.salaryNum,
                                   level : values.level === "全部" ? "" : values.level,
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
                const doctorPager = this.state.doctorPager;
                doctorPager.total = result.content.rowTotal;
                doctorPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  doctorData: result.content.data,
                  doctorPager
                });

                this.setState({ doctorTableLoading: false});
            }
        });
      }
    });
  }

  //删除医师
  handleDeleteDoctor(record) {

    console.log('删除医师', record);

    $.ajax({
        url : SERVER + '/api/doctor/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchDoctorList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询doctorId医师信息显示到对话框内
  requestDoctor = (doctorId) => {

    console.log('查询医师', doctorId);

    $.ajax({
        url : SERVER + '/api/doctor/' + doctorId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let doctor = result.content;

                if(this.refs.doctorEditForm == null) return;
                this.refs.doctorEditForm.setFieldsValue({name: doctor.name,
                                                         salaryNum: doctor.salaryNum,
                                                         level: doctor.level});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showDoctorEditModal = (record) => {

    this.setState({doctorEditModalVisible: true});

    this.doctorId = record.id //保存当前正在编辑的医师医师名方便提交用
    this.requestDoctor(this.doctorId);
  }

  closeDoctorEditModal = () => this.setState({ doctorEditModalVisible: false })

  //确认更新信息
  confirmDoctorEditModal = () => {

    //请求修改医师
    this.refs.doctorEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改医师', values);

        //显示加载圈
        this.setState({ confirmDoctorLoading: true });

        $.ajax({
            url : SERVER + '/api/doctor',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({doctorId: this.doctorId, name: values.name, salaryNum: values.salaryNum, level: values.level}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchDoctorList(this.state.doctorPager.current);

                //关闭加载圈、对话框
                this.setState({
                  doctorEditModalVisible: false,
                  confirmDoctorLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmDoctorLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  /**
  * 添加医师对话框
  **/
  showDoctorAddModal = (record) => this.setState({ doctorAddModalVisible: true})

  closeDoctorAddModal = () => this.setState({ doctorAddModalVisible: false})

  confirmDoctorAddModal = () => {

    this.refs.doctorAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加医师', values);

        //显示加载圈
        this.setState({ confirmDoctorAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/doctor',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   salaryNum: values.salaryNum,
                                   level: values.level
                                   }),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchDoctorList(this.state.doctorPager.current);

                //关闭加载圈、对话框
                this.setState({
                  doctorAddModalVisible: false,
                  confirmDoctorAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmDoctorAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  componentDidMount = () => {

    this.handleSearchDoctorList(1);
  }

  render(){


    //doctor表头//////////
    const doctorColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '工资号',
      dataIndex: 'salaryNum',
      key: 'salaryNum'
    }, {
      title: '医师级别',
      dataIndex: 'level',
      key: 'level',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showDoctorEditModal(record)}>查看</a>
          <span className="ant-divider" />
          <a onClick={() => this.showDoctorEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该医师吗?" onConfirm={() => this.handleDeleteDoctor(record)}>
                <a className='doctor-table-delete'>删除</a>
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
                tabBarExtraContent={<Button type="primary" onClick={this.showDoctorAddModal}>添加医师</Button>}>
            <TabPane tab="医师管理" key="1">
              <DoctorSearchForm ref="doctorSearchForm" handleSearchDoctorList={this.handleSearchDoctorList}/>
              <Table className='doctor-table' columns={doctorColumns} dataSource={this.state.doctorData} pagination={this.state.doctorPager} onChange={this.changeDoctorPager} rowKey='id' loading={this.state.doctorTableLoading}/>
            </TabPane>
            <TabPane tab="工作量系数管理" key="2">
              <DoctorLevelForm />
            </TabPane>
          </Tabs>
          <DoctorEditModal ref="doctorEditForm" visible={this.state.doctorEditModalVisible} confirmLoading={this.state.confirmDoctorLoading} onCancel={this.closeDoctorEditModal} onConfirm={this.confirmDoctorEditModal} />
          <DoctorAddModal ref="doctorAddForm" visible={this.state.doctorAddModalVisible} confirmLoading={this.state.confirmDoctorAddModalLoading} onCancel={this.closeDoctorAddModal} onConfirm={this.confirmDoctorAddModal}  />
        </div>
    );
  }
}

export default DoctorManage;
