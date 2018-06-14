import {ROUTE} from './../App/PublicConstant.js';
import React from 'react';
import {Link, browserHistory} from 'react-router';
import { Layout, Affix, Menu, Button} from 'antd';
import $ from 'jquery';
const {Header} = Layout;

class IndexHeader extends React.Component{

  handleClick = () => {

    // $.ajax({
    //     url : 'http://localhost:8081/api/oauth/access_token',
    //     type : 'POST',
    //     contentType: 'application/json',
    //     dataType : 'json',
    //     data : JSON.stringify({grant_type: 'client_credentials',
    //                            client_id : '2016273333331117128396',
    //                            client_secret : '904b98aaaaaaac1c92381d2'}),
    //     success : (result) =>
    //         console.log(result);
    //     }
    // });
    $.ajax({
        url : 'http://localhost:8080/restapi/nlp/v1/word_pos',
        type : 'POST',
        contentType: 'application/json',
        dataType : 'json',
        data : JSON.stringify({text: '我的梦想是当个科学家'}),
        beforeSend: (request) => request.setRequestHeader("ACCESS_TOKEN", "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwiaWF0IjoxNTExNzY1NTM1LCJzdWIiOiIxLzQwZmUwZGYyODNhYTU1ZjgyMGIyOWJkNy90ZXh0X2tleXdvcmRzLHdvcmRfcG9zLHdvcmRfc2VnIiwiaXNzIjoiYWlvcF9wbGF0Zm9ybSIsImV4cCI6MTUxNDM1NzUzNX0.q4wHo72SYPInXEDLXtGRwIeqGQdqXoWNOXxSJ5Fxlqs"),
        success : (result) => {
            console.log(result);
        },
        error: (result, code, msg) => {
          console.log(result.status); //404
          console.log(msg); //Not Found
        }
    });
  }


  render() {
    return (
      <Affix>
        <Header>
          <div className="index-header-logo" onClick={this.handleClick}/>
          {/* <div className="index-header-logo" onClick={() => browserHistory.push(ROUTE.MAIN.URL)}/> */}
          <Menu
             theme="dark"
             mode="horizontal"
             style={{ lineHeight: '64px' , float:'left'}}
          >
            <Menu.Item key="1"><Link to={ROUTE.MAIN.URL}>首页</Link></Menu.Item>
            <Menu.Item key="2">功能详情</Menu.Item>
            <Menu.Item key="3">帮助</Menu.Item>
          </Menu>
          <div style={{ lineHeight: '64px' , float: 'right'}}>
           <Button ghost onClick={() => browserHistory.push(ROUTE.LOGIN.URL)}>用户登录</Button>
           {/* <Button ghost onClick={() => browserHistory.push(ROUTE.REGISTER.URL)}>用户注册</Button> */}
          </div>
        </Header>
      </Affix>)
  }
}

export default IndexHeader;
