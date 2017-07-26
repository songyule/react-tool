import React, { PureComponent } from 'react'
import { Modal, Select, Input, Radio, Button, Table, Pagination } from 'antd'
import style from './css/selectReq.css'
import { getRequirementList } from 'actions/sampling'
import { clientOrgSearch } from 'actions/org'
import { format } from 'utils'
const Option = Select.Option
const Search = Input.Search
const RadioGroup = Radio.Group
export default class extends PureComponent {
  state = {
    visible: false,
    selectedRowKeys: [],
    statusValue: 0,
    page: 1,
    kw: '',
    reqOrgMes: [],
    selectOrgValue: '',
    reqResult: {}
  }
  onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys)
    selectedRowKeys = selectedRowKeys.splice(selectedRowKeys.length - 1, 1)
    this.setState({ selectedRowKeys });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    }, () => {
      let data = {}
      let a = this.state.selectedRowKeys
      let b = this.state.reqResult.sampling[a[a.length - 1]]
      data.visible = false
      data.select = this.state.selectedRowKeys
      data.name = 'req'
      data.reqMes = b
      this.props.callbackParent(data)
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    }, () => {
      let data = {}
      data.visible = false
      data.select = []
      data.name = 'req'
      this.props.callbackParent(data)
    })
  }
  componentWillReceiveProps (nextProps) { // props 更新时候触发
    this.setState({
      visible: nextProps.visible
    })
  }

  // 修改搜索的类型
  changeSearchType = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        type: e,
        content: ''
      }
    })
    document.querySelector('.ant-input-search').value = ''
  }
  pagClick = (index) => {
    this.setState({page: index}, () => {
      this.getReq()
    })
    console.log(document.querySelector('.ant-input-search').value)
  }
  stateChange = (e) => {
    this.setState({statusValue: e.target.value})
  }
  getReq () {
    let data = {
      offset: (this.state.page - 1) * 10,
      state: this.state.statusValue,
      applicant_org_id: this.state.kw,
      limit: 10
    }
    getRequirementList(data).then(res => {
      if (res.code !== 200) return
      let samplingData = res.data
      samplingData.sampling.map(item => {
        return item.created_at = format(item.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')
      })
      this.setState({reqResult: samplingData})
    })
  }

  getClentOrg () {
    if (this.state.kw.length > 10) return
    let data = {
      offset: 0,
      limit: 10
    }
    if (this.state.kw) {
      data.name_cn = this.state.kw
      data.name_official = this.state.kw
    }
    clientOrgSearch(data).then(res => {
      if (res.code === 200) this.setState({reqOrgMes: res.data.org})
    })
  }
  searchReq = () => {
    this.getReq()
  }
  selectOrg = (e) => {
    console.log(e)
    let index = this.state.reqOrgMes.findIndex(item => item.id === e)
    console.log(index)
    if (index >= 0) {
      this.setState({selectOrgValue: this.state.reqOrgMes[index].name_cn, kw: e}, () => {
        this.getClentOrg()
        this.getReq()
      })
    } else {
      this.setState({selectOrgValue: e, kw: e}, () => {
        this.getClentOrg()
      })
    }
    // this.setState({kw: e}, () => {
    //   this.getClentOrg()
    // })
  }
  componentWillMount () {
    this.getClentOrg()
  }
  render () {
    const { selectedRowKeys } = this.state;

    const columns = [{
      title: '图片',
      render: (text, record) => (<img style={{width: 50}} src={record.img_arr[0]}/>)
    }, {
      title: '需求单号',
      dataIndex: 'id',
    }, {
      title: '客户名称',
      dataIndex: 'applicant_org[name_cn]',
    }, {
      title: '提交人',
      dataIndex: 'applicant_user[name_cn]',
    }, {
      title: '提交时间',
      dataIndex: 'created_at',
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const options = this.state.reqOrgMes.map(item => <Option key={item.id} value={item.id}>{item.name_cn}</Option>)
    return (
      <div className={style.selectReq}>
        <Modal
          title="选择需求单"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width= '800'
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <p>选择组织：</p>
            <Select
            style={{width: 200}}
            mode="combobox"
            value={this.state.selectOrgValue}
            placeholder='suibian'
            notFoundContent=""
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onChange={this.selectOrg}
            ref='what'
            >
              {options}
            </Select>
            <div style={{marginLeft: 20}}>
              <span style={{marginRight: 10}}>单据状态:</span>
              <RadioGroup value={this.state.statusValue} onChange={this.stateChange}>
                <Radio value={0}>刚创建</Radio>
                <Radio value={1}>已完成</Radio>
                <Radio value={-1}>已关闭</Radio>
              </RadioGroup>
            </div>
            <Button type="primary" onClick={this.searchReq}>搜索</Button>
          </div>
          <div style={{marginTop: 10}}>
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.reqResult.sampling} pagination={false}/>
          </div>
          <div className={style.pagination}>
            <Pagination defaultCurrent={1} total={this.state.reqResult.total} onChange={this.pagClick}></Pagination>
          </div>
        </Modal>
      </div>
    )
  }
}