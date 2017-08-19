import './Welcome.css'
import React from 'react';
import {Card, BackTop, Calendar} from 'antd';
import $ from 'jquery';

class Welcome extends React.Component {

  // test = () => {
  //   $.ajax({
  //       url : 'https://10.109.247.97:8443/email/user/register.action?user.username=alice&user.password=1234&user.password2=1234&user.pwdEmail=690559724@qq.com&user.question=&user.answer=none&user.alias=&user.gender=MAN&user.phoneNum=&user.address=&user.mark=&user.authCode=bupt',
  //       type : 'POST'
  //   });
  //   //window.location.href = 'https://10.109.247.97:8443/email/user/login.action?username=ken3&password=123';
  // }


  render(){
    return (
      <div>
        <BackTop visibilityHeight="200"/>
        <div className='introduce-text'>
          <h2>眼科工作量统计系统</h2>
        </div>
        <div style={{width: '100%', border: '1px solid #d9d9d9', borderRadius: 4 ,textAlign: 'center'}}>
          <Calendar fullscreen={false}/>
        </div>
      </div>
    );
  }
}

export default Welcome;
