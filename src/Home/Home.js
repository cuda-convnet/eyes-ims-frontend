import './Home.css';
import {SESSION, ROUTE, ROLE, STYLE, COLOR, FILE_SERVER, SERVER, RESULT} from './../App/PublicConstant.js';
import {clearSession} from './../App/PublicMethod.js';
import React from 'react';
import { Layout, Menu, Icon, Avatar, notification, Button, Tag, message} from 'antd';
import {browserHistory} from 'react-router';
import ProfileEditModal from './ProfileEditModal.js';
import $ from 'jquery';
const { Header, Content, Footer, Sider} = Layout;

var close = () => {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
}

class Home extends React.Component {
  state = {
      collapsed: false,
      mode: 'inline',

      //个人资料编辑框
      profileEditModalVisible: false,
      userInfo: {valid: 0}

  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleLogout = (e) => {

    e.preventDefault();
    browserHistory.push(ROUTE.MAIN.URL);

    // const key = `open${Date.now()}`;
    // const btnClick = function () {
    //
    //   clearSession();
    //   notification.close(key);
    //   browserHistory.push(ROUTE.MAIN.URL);
    // };
    // const btn = (
    //   <Button type="primary" size="small" onClick={btnClick}>
    //     确定
    //   </Button>
    // );
    //
    // notification.open({
    //   message: '您确定要退出系统吗?',
    //   btn,
    //   key,
    //   onClose: close,
    // });
  }

  //根据角色决定布局
  initLayoutStyleByRole(role) {

    let layoutStyle;

    //主色调、用户管理、检查项目、原始资料、化验/医技数据、健康管理
    if(role === ROLE.EMPLOYEE_ADMIN) layoutStyle = this.getLayoutStyle(COLOR.RED, STYLE.BLOCK, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_INPUTER) layoutStyle = this.getLayoutStyle(COLOR.ORANGE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.BLOCK);
    else if(role === ROLE.EMPLOYEE_DOCTOR) layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE, STYLE.BLOCK, STYLE.NONE, STYLE.BLOCK);
    else layoutStyle = this.getLayoutStyle(COLOR.GREEN, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE, STYLE.NONE);

    return layoutStyle;
  }

  getLayoutStyle(roleTagColor,
                 userManageMenuItemDisplay,
                 doctorManageMenuItemDisplay,
                 doctorDetailMenuItemDisplay,
                 surgeryManageMenuItemDisplay,
                 recordManageMenuItemDisplay) {

      let layoutStyle = {
        roleTagColor: roleTagColor,
        userManageMenuItemDisplay: userManageMenuItemDisplay,
        doctorManageMenuItemDisplay: doctorManageMenuItemDisplay,
        doctorDetailMenuItemDisplay: doctorDetailMenuItemDisplay,
        surgeryManageMenuItemDisplay: surgeryManageMenuItemDisplay,
        recordManageMenuItemDisplay: recordManageMenuItemDisplay
      };

      return layoutStyle;
  }


  handleMenuItemClick = (e) => {

    const doctorId = sessionStorage.getItem(SESSION.DOCTOR_ID);
    const doctorName = sessionStorage.getItem(SESSION.NAME);
    let targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY;
    switch(e.key) {
      case ROUTE.WELCOME.MENU_KEY: targetUrl = ROUTE.WELCOME.URL_PREFIX + "/" + ROUTE.WELCOME.MENU_KEY; break;
      case ROUTE.USER_MANAGE.MENU_KEY: targetUrl = ROUTE.USER_MANAGE.URL_PREFIX + "/" + ROUTE.USER_MANAGE.MENU_KEY; break;
      case ROUTE.DOCTOR_MANAGE.MENU_KEY: targetUrl = ROUTE.DOCTOR_MANAGE.URL_PREFIX + "/" + ROUTE.DOCTOR_MANAGE.MENU_KEY; break;
      case ROUTE.DOCTOR_DETAIL.MENU_KEY: targetUrl = ROUTE.DOCTOR_DETAIL.URL_PREFIX + "/" + ROUTE.DOCTOR_DETAIL.MENU_KEY + "/" + doctorId + "/" + doctorName; break;
      case ROUTE.SURGERY_MANAGE.MENU_KEY: targetUrl = ROUTE.SURGERY_MANAGE.URL_PREFIX + "/" + ROUTE.SURGERY_MANAGE.MENU_KEY; break;
      case ROUTE.RECORD_MANAGE.MENU_KEY: targetUrl = ROUTE.RECORD_MANAGE.URL_PREFIX + "/" + ROUTE.RECORD_MANAGE.MENU_KEY; break;
      default:;break;
    }

    //跳转
    browserHistory.push(targetUrl);
  }

  /**
  * 弹出编辑个人信息对话框
  */
  showProfileEditModal = () => {

    this.setState({profileEditModalVisible: true});
    this.requestMember(sessionStorage.getItem(SESSION.USER_ID));
  }

  closeProfileEditModal = () => this.setState({profileEditModalVisible: false})

  //查询memberId会员信息显示到对话框内
  requestMember = (memberId) => {

    console.log('查询会员', memberId);

    $.ajax({
        url : SERVER + '/api/user/' + memberId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                this.setState({userInfo: result.content});
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  render() {

    const role = sessionStorage.getItem(SESSION.ROLE);
    const layoutStyle = this.initLayoutStyleByRole(role);

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width={170}>
          <div className="logo"/>
          <Menu theme="dark" mode="inline" selectedKeys={[this.props.params.menuKey]} onClick={this.handleMenuItemClick}>
            <Menu.Item key={ROUTE.WELCOME.MENU_KEY}>
              <Icon type="home" className="menu-item-font"/>
              <span className="nav-text menu-item-font">首页</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.USER_MANAGE.MENU_KEY} style={{display: layoutStyle.userManageMenuItemDisplay}}>
              <Icon type="team" className="menu-item-font"/>
              <span className="nav-text menu-item-font">用户管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.DOCTOR_MANAGE.MENU_KEY} style={{display: layoutStyle.doctorManageMenuItemDisplay}}>
              <Icon type="idcard" className="menu-item-font"/>
              <span className="nav-text menu-item-font">医师管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.DOCTOR_DETAIL.MENU_KEY} style={{display: layoutStyle.doctorDetailMenuItemDisplay}}>
              <Icon type="idcard" className="menu-item-font"/>
              <span className="nav-text menu-item-font">个人手术记录</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.SURGERY_MANAGE.MENU_KEY} style={{display: layoutStyle.surgeryManageMenuItemDisplay}}>
              <Icon type="medicine-box" className="menu-item-font"/>
              <span className="nav-text menu-item-font">手术医嘱管理</span>
            </Menu.Item>
            <Menu.Item key={ROUTE.RECORD_MANAGE.MENU_KEY} style={{display: layoutStyle.recordManageMenuItemDisplay}}>
              <Icon type="file-text" className="menu-item-font"/>
              <span className="nav-text menu-item-font">手术记录管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,textAlign: 'center'}}>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}/>
            <Icon type="logout" className="logout-icon" onClick={this.handleLogout}/>
            <Avatar size="large" src={FILE_SERVER + sessionStorage.getItem(SESSION.AVATAR)} className="avatar-header" style={{backgroundColor: 'white'}} onClick={this.showProfileEditModal}/>
            <ProfileEditModal ref="profileEditForm" visible={this.state.profileEditModalVisible} onCancel={this.closeProfileEditModal} userInfo={this.state.userInfo}/>

            <a className='name' onClick={this.showProfileEditModal}>{sessionStorage.getItem(SESSION.NAME)}</a>
            <Tag color={layoutStyle.roleTagColor} style={{marginLeft:7, float:'right', marginTop:21}}>{role}</Tag>

          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 800 }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            同仁医院 ©2017 Created by BUPT
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Home
