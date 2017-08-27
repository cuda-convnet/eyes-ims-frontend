import './DoctorManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE} from './../../App/PublicConstant.js'
import React from 'react';
import {Link} from 'react-router';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import DoctorEditModal from './DoctorEditModal.js';
import DoctorSearchForm from './DoctorSearchForm.js';
import DoctorAddModal from './DoctorAddModal.js';
import DoctorLevelForm from './DoctorLevelForm.js';
import DoctorGroupEditModal from './DoctorGroupEditModal.js';
import DoctorGroupAddModal from './DoctorGroupAddModal.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class DoctorManage extends React.Component {

  state = {

    //当前选中选项卡
    curTabKey: "1",

    //医师相关
    doctorData: [],
    doctorPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},

    doctorTableLoading: false,
    doctorEditModalVisible: false,
    confirmDoctorLoading: false,

    //职员添加对话框
    doctorAddModalVisible: false,
    confirmDoctorAddModalLoading: false,

    //医师组
    doctorGroupAllData: [],
    doctorGroupData: [],
    doctorGroupPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},
    doctorGroupTableLoading: false,
    doctorGroupAddModalVisible: false,
    confirmDoctorGroupAddModalLoading: false
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
                                   level : values.level === "所有医师级别" ? "" : values.level,
                                   doctorGroupId: values.doctorGroupId === "所有医师组" ? "" : values.doctorGroupId,
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
                                                         level: doctor.level,
                                                         doctorGroupId: doctor.groupId.toString()});

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
            data : JSON.stringify({doctorId: this.doctorId, name: values.name, level: values.level, doctorGroupId: Number(values.doctorGroupId)}),
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
                                   level: values.level,
                                   doctorGroupId: Number(values.doctorGroupId)}),
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

  /**
  * 医师组相关
  */
  changeDoctorGroupPager = (pager) =>  this.handleSearchDoctorGroupList(pager.current)
  handleSearchDoctorGroupList = (pageNow) => {

    this.setState({ doctorGroupTableLoading: true});

    console.log('拉取第'+ pageNow + "页医师组信息");
    $.ajax({
        url : SERVER + '/api/doctor_group/list',
        type : 'POST',
        contentType: 'application/json',
        data : JSON.stringify({pageNow: pageNow,
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
            const doctorGroupPager = this.state.doctorGroupPager;
            doctorGroupPager.total = result.content.rowTotal;
            doctorGroupPager.current = pageNow;

            //更新获取到的数据到状态中
            this.setState({
              doctorGroupData: result.content.data,
              doctorGroupPager
            });

            this.setState({ doctorGroupTableLoading: false});
        }
    });
  }

  //添加对话框
  showDoctorGroupAddModal = (record) => this.setState({ doctorGroupAddModalVisible: true})
  closeDoctorGroupAddModal = () => this.setState({ doctorGroupAddModalVisible: false})
  confirmDoctorGroupAddModal = () => {

    this.refs.doctorGroupAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加医师组', values);

        //显示加载圈
        this.setState({ confirmDoctorGroupAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/doctor_group',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchDoctorGroupList(this.state.doctorGroupPager.current);
                this.requestAllDoctorGroups();

                //关闭加载圈、对话框
                this.setState({
                  doctorGroupAddModalVisible: false,
                  confirmDoctorGroupAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmDoctorGroupAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //编辑对话框
  //打开编辑对话框
  showDoctorGroupEditModal = (record) => {

    this.setState({doctorGroupEditModalVisible: true});

    this.doctorGroupId = record.id //保存当前正在编辑的医师医师名方便提交用
    this.requestDoctorGroup(this.doctorGroupId);
  }

  closeDoctorGroupEditModal = () => this.setState({ doctorGroupEditModalVisible: false })

  //确认更新信息
  confirmDoctorGroupEditModal = () => {

    //请求修改医师
    this.refs.doctorGroupEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改医师组', values);

        //显示加载圈
        this.setState({ confirmDoctorGroupLoading: true });

        $.ajax({
            url : SERVER + '/api/doctor_group',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({doctorGroupId: this.doctorGroupId, name: values.name}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchDoctorGroupList(this.state.doctorPager.current);
                this.requestAllDoctorGroups();

                //关闭加载圈、对话框
                this.setState({
                  doctorGroupEditModalVisible: false,
                  confirmDoctorGroupLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmDoctorGroupLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  //查询doctorId医师信息显示到对话框内
  requestDoctorGroup = (doctorGroupId) => {

    console.log('查询医师组', doctorGroupId);
    $.ajax({
        url : SERVER + '/api/doctor_group/' + doctorGroupId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let doctorGroup = result.content;

                if(this.refs.doctorGroupEditForm === null) return;
                this.refs.doctorGroupEditForm.setFieldsValue({name: doctorGroup.name});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
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

  //删除医师组
  handleDeleteDoctorGroup = (record) => {

    console.log('删除医师组', record);
    $.ajax({
        url : SERVER + '/api/doctor_group/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchDoctorGroupList(1);
                this.requestAllDoctorGroups();

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }


  changeTabItem = (tabKey) => {

    this.setState({curTabKey: tabKey});
  }


  componentDidMount = () => {

    //医师
    this.handleSearchDoctorList(1);

    //医师组
    this.handleSearchDoctorGroupList(1);
    this.requestAllDoctorGroups();
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
      title: '所属医师组',
      dataIndex: 'groupName',
      key: 'groupName',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <Link to={ROUTE.DOCTOR_DETAIL.URL_PREFIX + "/" + ROUTE.DOCTOR_DETAIL.MENU_KEY + "/" + record.id + "/" + record.name}>查看</Link>
          <span className="ant-divider" />
          <a onClick={() => this.showDoctorEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该医师吗?系统会自动删除其关联的账号" onConfirm={() => this.handleDeleteDoctor(record)}>
                <a className='doctor-table-delete'>删除</a>
              </Popconfirm>
            </span>
            :
            null
          }
        </span>
      )
    }];

    //doctor表头//////////
    const doctorGroupColumns = [{
      title: '组名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showDoctorGroupEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该医师组吗?" onConfirm={() => this.handleDeleteDoctorGroup(record)}>
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
                tabBarExtraContent={this.state.curTabKey === "1" ? <Button type="primary" onClick={this.showDoctorAddModal}>添加医师</Button> : (this.state.curTabKey === "2" ? <Button type="primary" onClick={this.showDoctorGroupAddModal}>添加医师组</Button> : null)}
                onChange={this.changeTabItem}>
            <TabPane tab="医师管理" key="1">
              <DoctorSearchForm ref="doctorSearchForm" handleSearchDoctorList={this.handleSearchDoctorList} doctorGroupAllData={this.state.doctorGroupAllData}/>
              <Table className='doctor-table' columns={doctorColumns} dataSource={this.state.doctorData} pagination={this.state.doctorPager} onChange={this.changeDoctorPager} rowKey='id' loading={this.state.doctorTableLoading}/>
            </TabPane>
            <TabPane tab="医师组管理" key="2">
              {/* <DoctorSearchForm ref="doctorSearchForm" handleSearchDoctorList={this.handleSearchDoctorList}/> */}
              <Table className='doctor-table-center' columns={doctorGroupColumns} dataSource={this.state.doctorGroupData} pagination={this.state.doctorGroupPager} onChange={this.changeDoctorGroupPager} rowKey='id' loading={this.state.doctorGroupTableLoading}/>
            </TabPane>
            <TabPane tab="工作量系数管理" key="3">
              <DoctorLevelForm />
            </TabPane>
          </Tabs>
          <DoctorEditModal ref="doctorEditForm" visible={this.state.doctorEditModalVisible} confirmLoading={this.state.confirmDoctorLoading} onCancel={this.closeDoctorEditModal} onConfirm={this.confirmDoctorEditModal} doctorGroupAllData={this.state.doctorGroupAllData}/>
          <DoctorAddModal ref="doctorAddForm" visible={this.state.doctorAddModalVisible} confirmLoading={this.state.confirmDoctorAddModalLoading} onCancel={this.closeDoctorAddModal} onConfirm={this.confirmDoctorAddModal} doctorGroupAllData={this.state.doctorGroupAllData}/>

          <DoctorGroupEditModal ref="doctorGroupEditForm" visible={this.state.doctorGroupEditModalVisible} confirmLoading={this.state.confirmDoctorGroupLoading} onCancel={this.closeDoctorGroupEditModal} onConfirm={this.confirmDoctorGroupEditModal} />
          <DoctorGroupAddModal ref="doctorGroupAddForm" visible={this.state.doctorGroupAddModalVisible} confirmLoading={this.state.confirmDoctorGroupAddModalLoading} onCancel={this.closeDoctorGroupAddModal} onConfirm={this.confirmDoctorGroupAddModal}  />
        </div>
    );
  }
}

export default DoctorManage;
