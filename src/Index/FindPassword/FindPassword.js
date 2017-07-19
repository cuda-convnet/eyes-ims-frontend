import React from 'react';
import {ROUTE, SESSION, SERVER, RESULT} from './../../App/PublicConstant';
import { Layout, Card, Steps, Button, message, Alert} from 'antd';
import IndexHeader from './../IndexHeader.js';
import IndexFooter from './../IndexFooter.js';
import ValidateUsernameForm from './ValidateUsernameForm.js';
import NewPasswordForm from './NewPasswordForm.js';
import { browserHistory} from 'react-router';
import $ from 'jquery';
const { Header, Content} = Layout;
const Step = Steps.Step;


class FindPassword extends React.Component {

  state = {
    currentStep: 0,
    jumpCountDown: 5 ,//倒计时
    nextStepBtnLoading: false,

    //找回密码的用户ID
    userId: -1
  };

  /**
  * 验证手机号
  */

  validateUsername = () => {

    this.refs.validateUsernameForm.validateFields(['username', 'inputCode'], (err, values) => {
      if (!err) {

        console.log('验证用户手机号', values);

        this.setState({nextStepBtnLoading: true});
        $.ajax({
            url : SERVER + '/api/auth/check_code',
            type : 'POST',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({username: values.username, inputCode: values.inputCode}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //杀死发送验证码的定时器


                //关闭加载圈、对话框
                this.setState({ userId: result.content, nextStepBtnLoading: false, currentStep: this.state.currentStep + 1});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ nextStepBtnLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  /**
  * 提交新密码
  */
  submitPasswordChange = () => {

    this.refs.newPasswordForm.validateFields((err, values) => {
      if (!err) {
        console.log('修改用户'+ this.state.userId +'的密码', values);

        this.setState({nextStepBtnLoading: true});
        $.ajax({
            url : SERVER + '/api/user/password/' + this.state.userId,
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({newPassword: values.newPassword}),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //启动第三步的定时跳转
                var timer = setInterval(() => {
                    this.setState({ jumpCountDown: (--this.state.jumpCountDown)});

                    if(this.state.jumpCountDown === 0) {

                        //停止倒计时
                        clearInterval(timer);

                        //跳转到登录页面
                        browserHistory.push(ROUTE.LOGIN.URL);
                    }
                }, 1000);

                //关闭加载圈、对话框
                this.setState({nextStepBtnLoading: false, currentStep: this.state.currentStep + 1});
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ nextStepBtnLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  //下一步
  next = () => {

    const currentStep = this.state.currentStep;
    switch(currentStep){
      case 0:this.validateUsername();break;
      case 1:this.submitPasswordChange();break;
      default:browserHistory.push(ROUTE.LOGIN.URL);break;
    }
  }

  render() {

    //步骤数组
    const steps = [{

      title: '验证用户名',
      content: <ValidateUsernameForm ref="validateUsernameForm"/>,
      }, {
        title: '设置新密码',
        content: <NewPasswordForm ref="newPasswordForm"/>,
      }, {
        title: '重置完成',
        content:  <div style={{textAlign:'center'}}>
          <div style={{fontSize: 20}}>恭喜您已成功重置密码！</div>
          <div style={{marginTop: 10}}><span style={{fontSize: 17, fontWeight: 'bold'}}>{this.state.jumpCountDown}</span>&nbsp;秒钟后自动跳转至登录页面...</div>
        </div>,
    }];



    return (
      <Layout>
        <IndexHeader />
        <Content className="index-content">
          <Card className="index-card" bodyStyle={{ paddingTop:10, paddingLeft: 50, paddingRight: 50}} style={{width: '50%'}}>

            <div className="index-card-welcome" style={{marginBottom: 30}}>
              <span>密码重置</span>
            </div>

            <Steps current={this.state.currentStep} >
             {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>

            <div className="steps-content">{steps[this.state.currentStep].content}</div>


            <div className="steps-action">
             {
               this.state.currentStep < steps.length - 1
               &&
               <Button type="primary" size="large" onClick={() => this.next()} loading={this.state.nextStepBtnLoading}>下一步</Button>
             }
             {
               this.state.currentStep === steps.length - 1
               &&
               <Button style={{ marginLeft: 8 }} type="primary" size="large" onClick={() => browserHistory.push(ROUTE.LOGIN.URL)}>马上登录</Button>
             }
            </div>
          </Card>
        </Content>
        <IndexFooter />
      </Layout>
    );
  }
}

export default FindPassword;
