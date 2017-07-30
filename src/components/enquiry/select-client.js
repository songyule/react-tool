import React, { PureComponent } from 'react'
import { Modal, Select, Input, Button, Table, Pagination } from 'antd'
import { clientOrgSearch, searchClientUser } from 'actions/org'
import style from './css/selectReq.css'
const Option = Select.Option
const Search = Input.Search
export default class extends PureComponent {
  state = {
    visible: false,
    selectedRowKeys: [],
    selectedRowKeysA: [],
    searchData:{
      offset: 0,
      limit: 10,
      kw: ''
    },
    clientNameType: 'name_official',
    clientData: [],
    staffData: [],
    total: '',
    page: '',
    clickStaff: false,
    client_id: ''
  }
  onSelectChange = (selectedRowKeys) => {
    selectedRowKeys = selectedRowKeys.splice(selectedRowKeys.length - 1, 1)
    this.setState({ selectedRowKeys });
  }
  onSelectChangeA = (selectedRowKeysA) => {
    selectedRowKeysA = selectedRowKeysA.splice(selectedRowKeysA.length - 1, 1)
    this.setState({ selectedRowKeysA });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
      clickStaff: false,
      selectedRowKeys: [],
      selectedRowKeyA: []
    }, () => {
      let data = {}
      let a = this.state.selectedRowKeysA
      let b = this.state.staffData[a[a.length - 1]]
      data.visible = false
      data.select = this.state.selectedRowKeys
      data.name = 'client'
      data.clientOrgMes = b
      this.props.callbackParent(data)
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      clickStaff: false,
      selectedRowKeys: [],
      selectedRowKeyA: []
    }, () => {
      let data = {}
      data.visible = false
      data.select = []
      data.name = 'client'
      this.props.callbackParent(data)
    })
  }
  handleNext = () => {
    let a = this.state.selectedRowKeys
    let b = this.state.clientData[a[a.length - 1]].id
    this.setState({
      clickStaff: true,
      client_id: b,
      clientNameType: 'mobile'
    }, () => {
      this.getClientOrgSearch ('', 1)
    })
  }
  componentWillReceiveProps (nextProps) { // props 更新时候触发
    this.setState({
      visible: nextProps.visible
    })
  }
  getReqMess (value) {
    this.setState({
      searchData: {
        offset: 0,
        limit: 10,
        kw: value
      }
    }, () => {
      this.getClientOrgSearch(this.state.searchData.kw, 1)
    })
  }
  // 修改搜索的类型
  changeSearchType = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        type: e,
        content: ''
      },
      clientNameType: e
    })
    document.querySelector('.ant-input-search').value = ''
  }
  pagClick = (index) => {
    this.setState({page: index, selectedRowKeys: []}, () => {
      this.getClientOrgSearch(this.state.searchData.kw, this.state.page)
    })
  }
  getClientOrgSearch (kw, current) {
    if (!this.state.clickStaff) {
      let data = {
        'offset': (current - 1) * 10,
        'limit': 10
      }
      kw ? data[this.state.clientNameType] = kw : data
      clientOrgSearch(data).then(res => {
        if (res.code === 200) this.setState({clientData: res.data.org, total: res.data.total})
      })
    } else {
      let data = {
        'offset': (current - 1) * 10,
        'limit': 10,
        'client_id': this.state.client_id
      }
      kw ? data[this.state.clientNameType] = kw : data
      searchClientUser(data).then(res => {
        if (res.code === 200) this.setState({staffData: res.data.user, total: res.data.total})
      })
    }

  }

  componentWillMount() {
    this.getClientOrgSearch('', 1)
  }
  render () {
    const { selectedRowKeys, selectedRowKeysA } = this.state;
    const selectBefore = (
      <Select defaultValue="name_official" style={{ width: 80 }} onChange={this.changeSearchType}>
        <Option value="name_official">客户全称</Option>
        <Option value="name_cn">客户简称</Option>
      </Select>
    )
    const selectBeforeA = (
      <Select defaultValue="mobile" style={{ width: 80 }} onChange={this.changeSearchType}>
        <Option value="mobile">电话</Option>
        <Option value="name_cn">姓名</Option>
      </Select>
    )
    const columns = [{
      title: '客户名称',
      dataIndex: 'name_official',
    }];
    const columnsA = [{
      title: '手机号',
      dataIndex: 'mobile',
    },{
      title: '名称',
      dataIndex: 'name_cn',
    }];
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const rowSelectionA = {
      selectedRowKeysA,
      onChange: this.onSelectChangeA,
    };
    return (
      <div className={style.selectReq}>
      {
        !this.state.clickStaff &&  <Modal
                                    title="选择客户"
                                    visible={this.state.visible}
                                    width= '800'
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    footer={[
                                      <Button key="back" onClick={this.handleCancel}>取消</Button>,
                                      <Button  type="primary" disabled={this.state.selectedRowKeys.length <= 0} key="backs" onClick={this.handleNext}>下一步</Button>,
                                    ]}
                                  >
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                      <Search
                                        addonBefore={selectBefore}
                                        placeholder="input search text"
                                        style={{ width: 300 }}
                                        onSearch={value => this.getReqMess(value)}
                                      />
                                    </div>
                                    <div style={{marginTop: 10}}>
                                      <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.clientData} pagination={false} rowKey="uid"/>
                                    </div>
                                    <div className={style.pagination}>
                                      <Pagination defaultCurrent={1} total={this.state.total} onChange={this.pagClick}></Pagination>
                                    </div>
                                  </Modal>
      }
      {
        this.state.clickStaff &&  <Modal
                                  title="选择客户--提交人"
                                  visible={this.state.visible}
                                  width= '800'
                                  onOk={this.handleOk}
                                  onCancel={this.handleCancel}
                                  footer={[
                                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                                    <Button disabled={this.state.selectedRowKeysA.length <= 0} key="submit" type="primary" onClick={this.handleOk}>确认</Button>
                                  ]}
                                >
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Search
                                      addonBefore={selectBeforeA}
                                      placeholder="input search text"
                                      style={{ width: 300 }}
                                      onSearch={value => this.getReqMess(value)}
                                    />
                                  </div>
                                  <div style={{marginTop: 10}}>
                                    <Table rowSelection={rowSelectionA} columns={columnsA} dataSource={this.state.staffData} pagination={false} rowKey="uid2"/>
                                  </div>
                                  <div className={style.pagination}>
                                    <Pagination defaultCurrent={1} total={this.state.total} onChange={this.pagClick}></Pagination>
                                  </div>
                                </Modal>
      }
      </div>
    )
  }
}