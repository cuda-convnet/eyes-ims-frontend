
//服务器地址
const SERVER = 'http://localhost:8080' //yaochenkun
//const SERVER = 'http://192.168.118.131:8080' //lab

//文件服务器地址
const FILE_SERVER = 'http://localhost:8088' //yaochenkun
//const FILE_SERVER = 'http://192.168.118.131:8088' //lab



const LOADING_DELAY_TIME = 500 //加载延迟时间，若在0.5s内加载完毕则不显示
const PAGE_SIZE = 10 //每页条数
const DATE_FORMAT = 'YYYY-MM-DD'

//角色
const ROLE = {
  EMPLOYEE_ADMIN : '系统管理员',
  EMPLOYEE_INPUTER : '数据录入员',
  EMPLOYEE_DOCTOR : '医师'
}

//路由(跳转地址 和 可访问的角色,[]表示所有角色均可访问)
const ROUTE = {
  ROOT: {URL: '/', PERMISSION: []},
  MAIN: {URL: '/main', PERMISSION: []},
  HELP: {URL: '/help', PERMISSION: []},
  LOGIN: {URL: '/login', URL_PREFIX:'/login', PERMISSION: []},
  REGISTER: {URL: '/register', URL_PREFIX:'/register', PERMISSION: []},
  FIND_PASSWORD: {URL: '/find_password', URL_PREFIX:'/find_password', PERMISSION: []},

  HOME: {URL:'/home/:menuKey', URL_PREFIX:'/home', MENU_KEY: '1', PERMISSION: []},

    WELCOME: {URL:'/home/:menuKey', URL_PREFIX:'/home', MENU_KEY: '1', PERMISSION: []},
    USER_MANAGE: {URL:'/user_manage/:menuKey', URL_PREFIX:'/user_manage', MENU_KEY: '2', PERMISSION: [ROLE.EMPLOYEE_ADMIN]},
    DOCTOR_MANAGE: {URL:'/doctor_manage/:menuKey', URL_PREFIX:'/doctor_manage', MENU_KEY: '3', PERMISSION: [ROLE.EMPLOYEE_ADMIN]},
    DOCTOR_DETAIL: {URL:'/doctor_detail/:menuKey/:doctorId/:doctorName', URL_PREFIX:'/doctor_detail', MENU_KEY: '6', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_DOCTOR]},
    SURGERY_MANAGE: {URL:'/surgery_manage/:menuKey', URL_PREFIX:'/surgery_manage', MENU_KEY: '4', PERMISSION: [ROLE.EMPLOYEE_ADMIN]},
    RECORD_MANAGE: {URL:'/record_manage/:menuKey', URL_PREFIX:'/record_manage', MENU_KEY: '5', PERMISSION: [ROLE.EMPLOYEE_ADMIN, ROLE.EMPLOYEE_INPUTER, ROLE.EMPLOYEE_DOCTOR]}
}

//医师级别
const DOCTOR_LEVEL = [
  '一级主任医师',
  '二级主任医师',
  '三级主任医师',

  '一级副主任医师',
  '二级副主任医师',
  '三级副主任医师',

  '一级主治医师',
  '二级主治医师',
  '三级主治医师',

  '一级医师',
  '二级医师',
  '三级医师',

  '一级卫生主任技师',
  '二级卫生主任技师',
  '三级卫生主任技师',

  '一级卫生副主任技师',
  '二级卫生副主任技师',
  '三级卫生副主任技师',

  '一级卫生主管技师',
  '二级卫生主管技师',
  '三级卫生主管技师',

  '一级卫生技师',
  '二级卫生技师',
  '三级卫生技师',

  '一级副主任护师',
  '二级副主任护师',
  '三级副主任护师',

  '一级主管护师',
  '二级主管护师',
  '三级主管护师',

  '一级护师',
  '二级护师',
  '三级护师',

  '护士'
]

//手术级别
const SURGERY_LEVEL = [
  '一级',
  '二级',
  '三级',
  '四级',
  '五级'
]

//session中常量
const SESSION = {
  TOKEN: 'TOKEN',
  USER_ID: 'USER_ID',
  USERNAME: 'USERNAME',
  ROLE: 'ROLE',
  NAME: 'NAME',
  AVATAR: 'AVATAR',
  EXPIRED_TIME: 'EXPIRED_TIME',
  DOCTOR_ID: 'DOCTOR_ID'
}

//result
const RESULT = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  FAILURE_LOGIN: 'FAILURE_LOGIN',
  FAILURE_AUTH: 'FAILURE_AUTH'
}

//css样式常量
const STYLE = {
  BLOCK: 'block',
  NONE: 'none'
}

//颜色
const COLOR = {
  RED: 'red',
  PINK: 'pink',
  ORANGE: 'orange',
  GREEN: 'green',
  CYAN: 'cyan',
  BLUE: 'blue'
}

////////////////////////导出
export {
  SERVER,
  LOADING_DELAY_TIME,
  ROLE,
  SESSION,
  RESULT,
  PAGE_SIZE,
  STYLE,
  COLOR,
  ROUTE,
  FILE_SERVER,
  DOCTOR_LEVEL,
  SURGERY_LEVEL,
  DATE_FORMAT
};
