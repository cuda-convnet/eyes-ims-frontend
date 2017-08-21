import './DoctorManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE, ROUTE, FILE_SERVER} from './../../App/PublicConstant.js'
import React from 'react';
import {formatDate} from './../../App/PublicUtil.js';
import {Tabs, Table, message, Popconfirm, BackTop, Button, Breadcrumb, Badge} from 'antd';
import {Link} from 'react-router';
import DoctorDetailSearchForm from './DoctorDetailSearchForm.js';
import $ from 'jquery';


class DoctorDetail extends React.Component {

  state = {

    //手术记录相关
    doctorDetailData: [],
    doctorDetailPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},
    doctorDetailTableLoading: false,

    totalScore: 0
  };

  //翻页
  changeDoctorDetailPager = (pager) =>  this.handleSearchDoctorDetailList(pager.current)

  handleSearchDoctorDetailList = (pageNow) => {

    this.refs.doctorDetailSearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ doctorDetailTableLoading: true});

        console.log('拉取第'+ pageNow + "页手术记录信息", values);

        $.ajax({
            url : SERVER + '/api/record/detail',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({doctorId: this.props.params.doctorId,
                                   historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   place: values.place,
                                   beginTime: values.date !== undefined ? formatDate(values.date[0]) : undefined,
                                   endTime: values.date !== undefined ? formatDate(values.date[1]) : undefined,
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
                const doctorDetailPager = this.state.doctorDetailPager;
                doctorDetailPager.total = result.content.rowTotal;
                doctorDetailPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  doctorDetailData: result.content.data,
                  doctorDetailPager
                });

                this.setState({ doctorDetailTableLoading: false});

                //获取累计工作量积分
                this.requestTotalScoreOfMember();
            }
        });
      }
    });
  }

  requestTotalScoreOfMember = () => {

    this.refs.doctorDetailSearchForm.validateFields((err, values) => {
      if(!err) {

        console.log('获取'+ this.props.params.doctorName + "的累计工作量积分");
        $.ajax({
            url : SERVER + '/api/record/total_score',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({doctorId: this.props.params.doctorId,
                                   historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   place: values.place,
                                   beginTime: values.date !== undefined ? formatDate(values.date[0]) : undefined,
                                   endTime: values.date !== undefined ? formatDate(values.date[1]) : undefined}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //更新获取到的数据到状态中
                this.setState({
                  totalScore: result.content === null ? 0 : result.content
                });
            }
        });
      }
    });
  }

  //导出
  handleExportDoctorDetailList = () => {

    this.refs.doctorDetailSearchForm.validateFields((err, values) => {
      if(!err) {

        console.log('导出医师手术记录信息', values);
        $.ajax({
            url : SERVER + '/api/record/export_detail',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({doctorId: this.props.params.doctorId,
                                   historyNum : values.historyNum,
                                   patientName : values.patientName,
                                   place: values.place,
                                   beginTime: values.date !== undefined ? formatDate(values.date[0]) : undefined,
                                   endTime: values.date !== undefined ? formatDate(values.date[1]) : undefined}),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {

                console.log(result);
                if(result.code !== RESULT.SUCCESS) {
                    message.error(result.reason, 2);
                    return;
                }

                //下载
                window.location.href = FILE_SERVER + result.content;

                //查询
                this.handleSearchDoctorDetailList(1);
            }
        });
      }
    });
  }



  componentDidMount = () => {

    this.handleSearchDoctorDetailList(1);
  }

  render(){


    const role = sessionStorage.getItem(SESSION.ROLE);
    //doctorDetail表头//////////
    const doctorDetailColumns = [{
      title: '病历号',
      dataIndex: 'historyNum',
      key: 'historyNum'
    },{
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },{
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },{
      title: '眼别',
      dataIndex: 'eye',
      key: 'eye',
    },{
      title: '地点',
      dataIndex: 'place',
      key: 'place',
    },{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date)
    },
    role === ROLE.EMPLOYEE_ADMIN
    ?
    {
      title: '本场工作量',
      dataIndex: 'doctorScore',
      key: 'doctorScore',
      render: (doctorScore) => doctorScore + ' 分'
    }
    :
    {}];

    return (
      <div>
        <BackTop visibilityHeight="200"/>

        {
          role === ROLE.EMPLOYEE_ADMIN
          ?
          <Breadcrumb separator=">" className="doctor-detail-path">
            <Breadcrumb.Item><Link to={ROUTE.DOCTOR_MANAGE.URL_PREFIX + "/" + ROUTE.DOCTOR_MANAGE.MENU_KEY}>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.params.doctorName}</Breadcrumb.Item>
          </Breadcrumb>
          :
          null
        }

        <DoctorDetailSearchForm ref="doctorDetailSearchForm" handleSearchDoctorDetailList={this.handleSearchDoctorDetailList} handleExportDoctorDetailList={this.handleExportDoctorDetailList} />
        {role === ROLE.EMPLOYEE_ADMIN ? <Badge count={'累计工作量: ' + this.state.totalScore + ' 分'} style={{backgroundColor: '#f78e3d', marginTop: 20}}/> : null }
        <Table className='doctor-table' columns={doctorDetailColumns} dataSource={this.state.doctorDetailData} pagination={this.state.doctorDetailPager} onChange={this.changeDoctorDetailPager} rowKey='id' loading={this.state.doctorDetailTableLoading}/>
      </div>
    );
  }
}

export default DoctorDetail;
