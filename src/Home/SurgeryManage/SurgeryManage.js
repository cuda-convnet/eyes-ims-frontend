import './SurgeryManage.css'
import {SERVER, SESSION, RESULT, PAGE_SIZE, ROLE, STYLE} from './../../App/PublicConstant.js'
import React from 'react';
import {Tabs, Table, message, Popconfirm, BackTop, Button} from 'antd';
import SurgeryEditModal from './SurgeryEditModal.js';
import SurgerySearchForm from './SurgerySearchForm.js';
import SurgeryAddModal from './SurgeryAddModal.js';
import SurgeryLevelForm from './SurgeryLevelForm.js';
import $ from 'jquery';
const TabPane = Tabs.TabPane;


class SurgeryManage extends React.Component {

  state = {

    //手术医嘱相关
    surgeryData: [],
    surgeryPager: {pageSize: PAGE_SIZE, total: 0, showTotal: (total) => '共 ' + total + ' 条'},
    adviserAndManagerData: [],

    surgeryTableLoading: false,
    surgeryEditModalVisible: false,
    confirmSurgeryLoading: false,

    //职员添加对话框
    surgeryAddModalVisible: false,
    confirmSurgeryAddModalLoading: false,

    surgeryLevelData: {}
  };

  //翻页
  changeSurgeryPager = (pager) =>  this.handleSearchSurgeryList(pager.current)

  handleSearchSurgeryList = (pageNow) => {

    this.refs.surgerySearchForm.validateFields((err, values) => {
      if(!err) {

        this.setState({ surgeryTableLoading: true});

        console.log('拉取第'+ pageNow + "页手术医嘱信息", values);

        $.ajax({
            url : SERVER + '/api/surgery/list',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({code: values.code,
                                   name : values.name,
                                   alias : values.alias,
                                   level : values.level === '所有手术级别' ? '' : values.level,
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
                const surgeryPager = this.state.surgeryPager;
                surgeryPager.total = result.content.rowTotal;
                surgeryPager.current = pageNow;

                //更新获取到的数据到状态中
                this.setState({
                  surgeryData: result.content.data,
                  surgeryPager
                });

                this.setState({ surgeryTableLoading: false});
            }
        });
      }
    });
  }

  //删除手术医嘱
  handleDeleteSurgery(record) {

    console.log('删除手术医嘱', record);

    $.ajax({
        url : SERVER + '/api/surgery/' + record.id,
        type : 'DELETE',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                //删除后重查一遍
                this.handleSearchSurgeryList(1);

                message.success(result.reason, 2);
                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //查询surgeryId手术医嘱信息显示到对话框内
  requestSurgery = (surgeryId) => {

    console.log('查询手术医嘱', surgeryId);

    $.ajax({
        url : SERVER + '/api/surgery/' + surgeryId,
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code === RESULT.SUCCESS) {

                let surgery = result.content;

                if(this.refs.surgeryEditForm == null) return;
                this.refs.surgeryEditForm.setFieldsValue({ code: surgery.code,
                                                           name: surgery.name,
                                                           alias: surgery.alias,
                                                           price: surgery.price,
                                                           category: surgery.category,
                                                           chargeCode: surgery.chargeCode,
                                                           chargeName: surgery.chargeName,
                                                           chargeCount: surgery.chargeCount,
                                                           chargePrice: surgery.chargePrice,
                                                           extraPrice: surgery.extraPrice,
                                                           level: surgery.level});


                return;
            } else {
                message.error(result.reason, 2);
                return;
            }
        }
    });
  }

  //打开编辑对话框
  showSurgeryEditModal = (record) => {

    this.setState({surgeryEditModalVisible: true});

    this.surgeryId = record.id //保存当前正在编辑的手术医嘱手术医嘱名方便提交用
    this.requestSurgery(this.surgeryId);
  }

  closeSurgeryEditModal = () => this.setState({ surgeryEditModalVisible: false })

  //确认更新信息
  confirmSurgeryEditModal = () => {

    //请求修改手术医嘱
    this.refs.surgeryEditForm.validateFields((err, values) => {
      if(!err) {
        console.log('修改手术医嘱', values);

        //显示加载圈
        this.setState({ confirmSurgeryLoading: true });

        $.ajax({
            url : SERVER + '/api/surgery',
            type : 'PUT',
            contentType: 'application/json',
            dataType : 'json',
            data : JSON.stringify({surgeryId: this.surgeryId,
                                   code: values.code,
                                   name: values.name,
                                   alias: values.alias,
                                   price: values.price.toFixed(2),
                                   category: values.category,
                                   chargeCode: values.chargeCode,
                                   chargeName: values.chargeName,
                                   chargeCount: values.chargeCount.toFixed(2),
                                   chargePrice: values.chargePrice.toFixed(2),
                                   extraPrice: values.extraPrice.toFixed(2),
                                   level: values.level }),
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchSurgeryList(this.state.surgeryPager.current);

                //关闭加载圈、对话框
                this.setState({
                  surgeryEditModalVisible: false,
                  confirmSurgeryLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmSurgeryLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }


  /**
  * 添加手术医嘱对话框
  **/
  showSurgeryAddModal = (record) => this.setState({ surgeryAddModalVisible: true})

  closeSurgeryAddModal = () => this.setState({ surgeryAddModalVisible: false})

  confirmSurgeryAddModal = () => {

    //请求修改职员
    this.refs.surgeryAddForm.validateFields((err, values) => {
      if(!err) {
        console.log('添加手术医嘱', values);

        //显示加载圈
        this.setState({ confirmSurgeryAddModalLoading: true });

        $.ajax({
            url : SERVER + '/api/surgery',
            type : 'POST',
            contentType: 'application/json',
            data : JSON.stringify({code: values.code,
                                   name: values.name,
                                   alias: values.alias,
                                   price: values.price.toFixed(2),
                                   category: values.category,
                                   chargeCode: values.chargeCode,
                                   chargeName: values.chargeName,
                                   chargeCount: values.chargeCount.toFixed(2),
                                   chargePrice: values.chargePrice.toFixed(2),
                                   extraPrice: values.extraPrice.toFixed(2),
                                   level: values.level }),
            dataType : 'json',
            beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
            success : (result) => {
              console.log(result);
              if(result.code === RESULT.SUCCESS) {

                //重查刷新一遍
                this.handleSearchSurgeryList(this.state.surgeryPager.current);

                //关闭加载圈、对话框
                this.setState({
                  surgeryAddModalVisible: false,
                  confirmSurgeryAddModalLoading: false,
                });
                message.success(result.reason, 2);
              } else {

                //关闭加载圈
                this.setState({ confirmSurgeryAddModalLoading: false });
                message.error(result.reason, 2);
              }
            }
        });
      }
    });
  }

  requestSurgeryLevel = () => {

    console.log('拉取手术级别对应的工作量系数');

    $.ajax({
        url : SERVER + '/api/surgery/level',
        type : 'GET',
        dataType : 'json',
        beforeSend: (request) => request.setRequestHeader(SESSION.TOKEN, sessionStorage.getItem(SESSION.TOKEN)),
        success : (result) => {

            console.log(result);
            if(result.code !== RESULT.SUCCESS) {
                message.error(result.reason, 2);
                return;
            }

            this.setState({surgeryLevelData: result.content});
        }
    });
  }


  componentDidMount = () => {

    this.handleSearchSurgeryList(1);
    this.requestSurgeryLevel(); //拉取手术系数供添加/编辑手术医嘱用
  }

  render(){


    //surgery表头//////////
    const surgeryColumns = [{
      title: '代码',
      dataIndex: 'code',
      key: 'code'
    },{
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },{
      title: '收费代码',
      dataIndex: 'chargeCode',
      key: 'chargeCode',
    },{
      title: '收费名称',
      dataIndex: 'chargeName',
      key: 'chargeName',
    },{
      title: '数量',
      dataIndex: 'chargeCount',
      key: 'chargeCount',
    },{
      title: '价格',
      dataIndex: 'chargePrice',
      key: 'chargePrice',
    },{
      title: '特需价格',
      dataIndex: 'extraPrice',
      key: 'extraPrice',
    },{
      title: '手术级别',
      dataIndex: 'level',
      key: 'level',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <span>
          <a onClick={() => this.showSurgeryEditModal(record)}>修改</a>
          {
            sessionStorage.getItem(SESSION.ROLE) === ROLE.EMPLOYEE_ADMIN
            ?
            <span>
              <span className="ant-divider" />
              <Popconfirm title="您确定要删除该手术医嘱吗?" onConfirm={() => this.handleDeleteSurgery(record)}>
                <a className='surgery-table-delete'>删除</a>
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
                tabBarExtraContent={<Button type="primary" onClick={this.showSurgeryAddModal}>添加手术医嘱</Button>}>
            <TabPane tab="手术医嘱管理" key="1">
              <SurgerySearchForm ref="surgerySearchForm" handleSearchSurgeryList={this.handleSearchSurgeryList}/>
              <Table className='surgery-table' columns={surgeryColumns} dataSource={this.state.surgeryData} pagination={this.state.surgeryPager} onChange={this.changeSurgeryPager} rowKey='id' loading={this.state.surgeryTableLoading}/>
            </TabPane>
            <TabPane tab="工作量系数管理" key="2">
              <SurgeryLevelForm />
            </TabPane>
          </Tabs>
          <SurgeryEditModal ref="surgeryEditForm" visible={this.state.surgeryEditModalVisible} confirmLoading={this.state.confirmSurgeryLoading} onCancel={this.closeSurgeryEditModal} onConfirm={this.confirmSurgeryEditModal}  surgeryLevelData={this.state.surgeryLevelData}/>
          <SurgeryAddModal ref="surgeryAddForm" visible={this.state.surgeryAddModalVisible} confirmLoading={this.state.confirmSurgeryAddModalLoading} onCancel={this.closeSurgeryAddModal} onConfirm={this.confirmSurgeryAddModal} surgeryLevelData={this.state.surgeryLevelData} />
        </div>
    );
  }
}

export default SurgeryManage;
