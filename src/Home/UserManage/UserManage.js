import './UserManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import UserEditModal from './UserEditModal.js';
import UserSearchForm from './UserSearchForm.js';
import UserAddModal from './UserAddModal.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class UserManage extends React.Component {

  state = {

    //员工相关
    userData: [],
    userPager: {pageSize: PAGE_SIZE, total: 0},
    adviserAndManagerData: [],

    userTableLoading: false,
    userEditModalVisible: false,
    confirmUserLoading: false,

    //职员添加对话框
    userAddModalVisible: false,
    confirmUserAddModalLoading: false
  };

  //翻页
  changeUserPager = (pager) =>  this.handleSearchUserList(pager.current)

  handleSearchUserList = (pageNow) => {

    this.refs.userSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ userTableLoading: true});

        console.log('拉取第'+ pageNow + "页员工信息", values);

        $.ajax({
            url : SERVER + '/api/user/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({username: values.username,
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
                const userPager = this.state.userPager;
                userPager.total = result.content.rowTotal;
                userPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  userData: result.content.data,
                  userPager
                });

                this.setState({ userTableLoading: false});
            }
        });
      }
    });
  }

  //删除员工
  handleDeleteUser(record) {

    console.log('删除员工', record);

    $.ajax({
        url : SERVER + '/api/user/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchUserList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询userId员工信息显示到对话框内
  requestUser = (userId) => {

    console.log('查询员工', userId);

    $.ajax({
        url : SERVER + '/api/user/' + userId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let user = result.content;

                if(this.refs.userEditForm == null) return;
                this.refs.userEditForm.setFieldsValue({name: user.name,
                                                       username: user.username,
                                                       role: user.role});

                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showUserEditModal = (record) => {

    this.setState({userEditModalVisible: true});

    this.userId = record.id //保存当前正在编辑的员工用户名方便提交用
    this.requestUser(this.userId);
  }

  closeUserEditModal = () => this.setState({ userEditModalVisible: false })

  //确认更新信息
  confirmUserEditModal = () => {

    //请求修改员工
    this.refs.userEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改员工', values);

        //显示加载圈
        this.setState({ confirmUserLoading: true });

        $.ajax({
            url : SERVER + '/api/user',
            type : 'PUT',
            contentType: 'application/json',
            data : JSON.stringify({userId: this.userId, role: values.role}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchUserList(this.state.userPager.current);

                //关闭加载圈、对话框
                this.setState({
                  userEditModalVisible: false,
                  confirmUserLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmUserLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  /**
  * 添加员工对话框
  **/
  showUserAddModal = (record) => this.setState({ userAddModalVisible: true})

  closeUserAddModal = () => this.setState({ userAddModalVisible: false})

  confirmUserAddModal = () => {

    //请求修改职员
    this.refs.userAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加员工', values);

        //显示加载圈
        this.setState({ confirmUserAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/user',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({name: values.name,
                                   username: values.username,
                                   role: values.role
                                   }),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchUserList(this.state.userPager.current);

                //关闭加载圈、对话框
                this.setState({
                  userAddModalVisible: false,
                  confirmUserAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmUserAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  componentDidMount = () => {

    this.handleSearchUserList(1);
  }

  render(){


    //user表头//////////
    const userColumns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: '角色级别',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showUserEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该员工吗?" onConfirm={() => this.handleDeleteUser(record)}>
                <a className='user-table-delete'>删除</a>
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
                tabBarExtraContent={<Button type="primary" onClick={this.showUserAddModal}>添加员工</Button>}>
            <TabPane tab="员工管理" key="1">
              <UserSearchForm ref="userSearchForm" handleSearchUserList={this.handleSearchUserList}/>
              <Table className='user-table' columns={userColumns} dataSource={this.state.userData} pagination={this.state.userPager} onChange={this.changeUserPager} rowKey='id' loading={this.state.userTableLoading}/>
            </TabPane>
          </Tabs>
          <UserEditModal ref="userEditForm" visible={this.state.userEditModalVisible} confirmLoading={this.state.confirmUserLoading} onCancel={this.closeUserEditModal} onConfirm={this.confirmUserEditModal} adviserAndManagerData={this.state.adviserAndManagerData} />
          <UserAddModal ref="userAddForm" visible={this.state.userAddModalVisible} confirmLoading={this.state.confirmUserAddModalLoading} onCancel={this.closeUserAddModal} onConfirm={this.confirmUserAddModal}  adviserAndManagerData={this.state.adviserAndManagerData}/>
        </div>
    );
  }
}

export default UserManage;
