import './Welcome.css'
import React from 'react';
import {Card, BackTop} from 'antd';
import $ from 'jquery';

class Welcome extends React.Component {

  test = () => {
    $.ajax({
        url : 'https://10.109.247.97:8443/email/user/register.action?user.username=alice&user.password=1234&user.password2=1234&user.pwdEmail=690559724@qq.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt',
        type : 'POST'
    });
    //window.location.href = 'https://10.109.247.97:8443/email/user/login.action?username=ken3&password=123';
  }


  render(){
    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <div className='introduce-text'>
          <h1>眼科工作量统计系统</h1>
        </div>
        <div>
          <Card className='card' bodyStyle={{ padding: 0 }} onClick={this.test}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/user_card.svg" />
            </div>
            <div className="custom-card">
              <h3>用户管理</h3>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/doctor_card.svg"/>
            </div>
            <div className="custom-card">
              <h3>医师管理</h3>
              <p></p>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/health_card.svg" />
            </div>
            <div className="custom-card">
              <h3>手术医嘱管理</h3>
            </div>
          </Card>
          <Card className='card' bodyStyle={{ padding: 0 }}>
            <div className="custom-image">
              <img alt="example" src="/Home/Welcome/record_card.svg" />
            </div>
            <div className="custom-card">
              <h3>工作量统计</h3>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default Welcome;
