import './SurgeryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
// import SurgeryEditModal from './SurgeryEditModal.js';
// import SurgerySearchForm from './SurgerySearchForm.js';
// import SurgeryAddModal from './SurgeryAddModal.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class SurgeryManage extends React.Component {

  state = {

    //手术相关
    surgeryData: [],
    surgeryPager: {pageSize: PAGE_SIZE, total: 0},
    adviserAndManagerData: [],

    surgeryTableLoading: false,
    surgeryEditModalVisible: false,
    confirmSurgeryLoading: false,

    //职员添加对话框
    surgeryAddModalVisible: false,
    confirmSurgeryAddModalLoading: false
  };

  //翻页
  changeSurgeryPager = (pager) =>  this.handleSearchSurgeryList(pager.current)

  handleSearchSurgeryList = (pageNow) => {

    this.refs.surgerySearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ surgeryTableLoading: true});

        console.log('拉取第'+ pageNow + "页手术信息", values);

        $.ajax({
            url : SERVER + '/api/surgery/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({surgeryname: values.surgeryname,
                                   name : values.name,
                                   role : values.role === "全部" ? "" : values.role,
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
                const surgeryPager = this.state.surgeryPager;
                surgeryPager.total = result.content.rowTotal;
                surgeryPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  surgeryData: result.content.data,
                  surgeryPager
                });

                this.setState({ surgeryTableLoading: false});
            }
        });
      }
    });
  }

  //删除手术
  handleDeleteSurgery(record) {

    console.log('删除手术', record);

    $.ajax({
        url : SERVER + '/api/surgery/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchSurgeryList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询surgeryId手术信息显示到对话框内
  requestSurgery = (surgeryId) => {

    console.log('查询手术', surgeryId);

    $.ajax({
        url : SERVER + '/api/surgery/' + surgeryId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let surgery = result.content;

                if(this.refs.surgeryEditForm == null) return;
                this.refs.surgeryEditForm.setFieldsValue({name: surgery.name,
                                                       surgeryname: surgery.surgeryname,
                                                       role: surgery.role});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showSurgeryEditModal = (record) => {

    this.setState({surgeryEditModalVisible: true});

    this.surgeryId = record.id //保存当前正在编辑的手术手术名方便提交用
    this.requestSurgery(this.surgeryId);
  }

  closeSurgeryEditModal = () => this.setState({ surgeryEditModalVisible: false })

  //确认更新信息
  confirmSurgeryEditModal = () => {

    //请求修改手术
    this.refs.surgeryEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改手术', values);

        //显示加载圈
        this.setState({ confirmSurgeryLoading: true });

        $.ajax({
            url : SERVER + '/api/surgery',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({surgeryId: this.surgeryId, role: values.role}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchSurgeryList(this.state.surgeryPager.current);

                //关闭加载圈、对话框
                this.setState({
                  surgeryEditModalVisible: false,
                  confirmSurgeryLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmSurgeryLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  /**
  * 添加手术对话框
  **/
  showSurgeryAddModal = (record) => this.setState({ surgeryAddModalVisible: true})

  closeSurgeryAddModal = () => this.setState({ surgeryAddModalVisible: false})

  confirmSurgeryAddModal = () => {

    //请求修改职员
    this.refs.surgeryAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加手术', values);

        //显示加载圈
        this.setState({ confirmSurgeryAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/surgery',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   surgeryname: values.surgeryname,
                                   role: values.role
                                   }),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchSurgeryList(this.state.surgeryPager.current);

                //关闭加载圈、对话框
                this.setState({
                  surgeryAddModalVisible: false,
                  confirmSurgeryAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmSurgeryAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  componentDidMount = () => {

    this.handleSearchSurgeryList(1);
  }

  render(){


    //surgery表头//////////
    const surgeryColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '手术名',
      dataIndex: 'surgeryname',
      key: 'surgeryname'
    }, {
      title: '角色级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showSurgeryEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该手术吗?" onConfirm={() => this.handleDeleteSurgery(record)}>
                <a className='surgery-table-delete'>删除</a>
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
          手术管理
          {/* <BackTop visibilityHeight="200"/>
          <Tabs defaultActiveKey={"1"}
                tabBarExtraContent={<Button type="primary" onClick={this.showSurgeryAddModal}>添加手术</Button>}>
            <TabPane tab="手术管理" key="1">
              <SurgerySearchForm ref="surgerySearchForm" handleSearchSurgeryList={this.handleSearchSurgeryList}/>
              <Table className='surgery-table' columns={surgeryColumns} dataSource={this.state.surgeryData} pagination={this.state.surgeryPager} onChange={this.changeSurgeryPager} rowKey='id' loading={this.state.surgeryTableLoading}/>
            </TabPane>
          </Tabs>
          <SurgeryEditModal ref="surgeryEditForm" visible={this.state.surgeryEditModalVisible} confirmLoading={this.state.confirmSurgeryLoading} onCancel={this.closeSurgeryEditModal} onConfirm={this.confirmSurgeryEditModal}  />
          <SurgeryAddModal ref="surgeryAddForm" visible={this.state.surgeryAddModalVisible} confirmLoading={this.state.confirmSurgeryAddModalLoading} onCancel={this.closeSurgeryAddModal} onConfirm={this.confirmSurgeryAddModal}  /> */}
        </div>
    );
  }
}

export default SurgeryManage;
