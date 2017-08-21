import {SESSION, ROUTE} from './App/PublicConstant.js';
import {clearSession, containsElement} from './App/PublicMethod.js'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App.js';
import Main from './Index/Main/Main.js';
import FindPassword from './Index/FindPassword/FindPassword.js';
import Login from './Index/Login/Login.js';
import Register from './Index/Register/Register.js';
import Home from './Home/Home.js';
import Welcome from './Home/Welcome/Welcome.js';
import UserManage from './Home/UserManage/UserManage.js';
import DoctorManage from './Home/DoctorManage/DoctorManage.js';
import DoctorDetail from './Home/DoctorManage/DoctorDetail.js';
import SurgeryManage from './Home/SurgeryManage/SurgeryManage.js';
import RecordManage from './Home/RecordManage/RecordManage.js';
import {message} from 'antd'
import {Router, Route, browserHistory, IndexRoute} from 'react-router';


//页面进入认证
const certifyAccess = function(nextState, replace){

    let token = sessionStorage.getItem(SESSION.TOKEN);
    let role = sessionStorage.getItem(SESSION.ROLE);

    //判断有没有token存在
    if(token == null || role == null) {
        message.error('请先登录');
        replace({ pathname: ROUTE.LOGIN.URL })
        return false;
    }

    //判断token时效性
    let expiredTime = sessionStorage.getItem(SESSION.EXPIRED_TIME); //获取过期时间戳
    let now = new Date().getTime();
    if(now > expiredTime) {
        clearSession();
        message.error('已过期请重新登录');
        replace({ pathname: ROUTE.LOGIN.URL });
        return false;
    }

    //判断当前用户的role是否能进入targetUrl页面
    let targetUrl = "/" + nextState.location.pathname.split('/')[1];
    switch(targetUrl) {
      case ROUTE.LOGIN.URL_PREFIX:certifyRole(replace, role, ROUTE.LOGIN.PERMISSION);break;
      case ROUTE.REGISTER.URL_PREFIX:certifyRole(replace, role, ROUTE.REGISTER.PERMISSION);break;
      case ROUTE.FIND_PASSWORD.URL_PREFIX:certifyRole(replace, role, ROUTE.FIND_PASSWORD.PERMISSION);break;
      case ROUTE.HOME.URL_PREFIX:certifyRole(replace, role, ROUTE.HOME.PERMISSION);break;
      case ROUTE.USER_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.USER_MANAGE.PERMISSION);break;
      case ROUTE.DOCTOR_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.DOCTOR_MANAGE.PERMISSION);break;
      case ROUTE.DOCTOR_DETAIL.URL_PREFIX:certifyRole(replace, role, ROUTE.DOCTOR_DETAIL.PERMISSION);break;
      case ROUTE.SURGERY_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.SURGERY_MANAGE.PERMISSION);break;
      case ROUTE.RECORD_MANAGE.URL_PREFIX:certifyRole(replace, role, ROUTE.RECORD_MANAGE.PERMISSION);break;

      default:clearSession(); replace({ pathname: ROUTE.LOGIN.URL }); message.error('暂无该页面，请重新登录');break;
    }

    //放行
    return true;
};

//角色认证(legalRoles == []表示所有角色均可以通过)
const certifyRole = function(replace, role, legalRoles) {

  if(legalRoles.length === 0)
    return true;

  if(containsElement(role, legalRoles)) //包含
    return true;

  //定位到登录页面
  clearSession();
  message.error('权限不够，请更换账号登录');
  replace({ pathname: ROUTE.LOGIN.URL });
  return false;
};


class AppRouter extends React.Component {
  render() {
    return (<Router history={browserHistory}>
              <Route component={App}>

                <Route onEnter={certifyAccess}>
                  <Route path={ROUTE.HOME.URL} component={Home}>
                      <IndexRoute component={Welcome} />
                      <Route path={ROUTE.USER_MANAGE.URL} component={UserManage}/>
                      <Route path={ROUTE.DOCTOR_MANAGE.URL} component={DoctorManage}/>
                      <Route path={ROUTE.DOCTOR_DETAIL.URL} component={DoctorDetail}/>
                      <Route path={ROUTE.SURGERY_MANAGE.URL} component={SurgeryManage}/>
                      <Route path={ROUTE.RECORD_MANAGE.URL} component={RecordManage}/>
                  </Route>
                </Route>

                <Route path={ROUTE.ROOT.URL} component={Main}/>
                <Route path={ROUTE.MAIN.URL} component={Main}/>
                <Route path={ROUTE.LOGIN.URL} component={Login}/>
                <Route path={ROUTE.REGISTER.URL} component={Register}/>
                <Route path={ROUTE.FIND_PASSWORD.URL} component={FindPassword}/>

                <Route path="*"  onEnter={certifyAccess} />
              </Route>
          </Router>);
  }
}



ReactDOM.render(<AppRouter />, document.getElementById('root'));
