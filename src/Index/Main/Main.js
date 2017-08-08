import './../Index.css';
import {LOADING_DELAY_TIME} from './../../App/PublicConstant.js';
import React from 'react';
import { Layout,Carousel, Spin, Card, BackTop} from 'antd';
import IndexHeader from './../IndexHeader.js';
const { Header, Content} = Layout;

class Login extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    loading: false
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }

  handleLoading = (onoff) => {
    // e.preventDefault();
    this.setState({
      loading : onoff
    })
  }

  render() {

    return (

        <Spin spinning={this.state.loading} delay={LOADING_DELAY_TIME} tip='登录中'>
          <BackTop visibilityHeight="200"/>
          <Layout>
            <IndexHeader />
            <Content>
              <Carousel autoplay effect="fade">
                <div style={{height:450}}><img src='/Index/carousel_1.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:450}}><img src='/Index/carousel_2.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:450}}><img src='/Index/carousel_3.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
                <div style={{height:450}}><img src='/Index/carousel_4.jpeg' style={{width:'100%', height:'100%'}} alt=""/></div>
              </Carousel>

              <div style={{paddingLeft:80, paddingRight:80}}>
                <div className='introduce-text' style={{textAlign:'center'}}>
                  <h1>眼科工作量统计系统简介</h1>
                  <div style={{minHeight: 500}}></div>
                </div>
              </div>
            </Content>
            <Header className='footer'>
              同仁医院 ©2017 Created by BUPT
            </Header>
          </Layout>
        </Spin>
    );
  }
}

export default Login;
