import React, { PureComponent } from 'react'
import { Tabs, Input, Select, Button, Table, Pagination, Spin } from 'antd'
import style from './css/enquiry-list.css'
import { Link } from 'react-router-dom'
import { sellerInquirySearch } from 'actions/sampling'
import { format } from 'utils/index'

const TabPane = Tabs.TabPane
const Search = Input.Search
const Option = Select.Option
export default class extends PureComponent {
// created = 0
// # 刚创建
// assigned = 1
// # 已认领
// completed = 2
// # 完成
// offer_withdrawal = 3
// # 销售退回报价
// has_offer = 4
// # 采购有报价提供

// canceled = -1
// # 销售关闭了询价单
// no_supplier_withdrawal = -2
// # 采购退回询价单
  state = {
    enquiryData: [],
    kw: '',
    statusValue: 0,
    page: 1,
    limit: 10,
    count: {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    },
    loading: false,
    tip: '加载中....'
  }
  tabCallback = (key) => {
    this.setState({
      statusValue: key,
      page: 1
    }, () => {
      this.getEnquiryData()
    })
  }
  getEnquiryData () {
    this.setState({ loading: true, tip: '加载中……' })
    let data = {
      offset: (this.state.page - 1) * this.state.limit,
      limit: this.state.limit,
      state: this.state.statusValue
    }
    if (this.state.kw) data.id = this.state.kw
    sellerInquirySearch(data).then(res => {
      console.log(res)
      this.setState({
        enquiryData: res.data,
        loading: false
      })
    })
  }
  paginationChange = (e) => {
    this.setState({page: e}, () => {this.getEnquiryData()})
  }
  searchChange = (val) => {
    this.setState({kw: val}, () => {this.getEnquiryData()})
  }
  checkDetail = (index) => {
    console.log(index)
    let id = this.state.enquiryData.inquiry[index].id
    this.props.history.push(`/main/enquiry-detail/${id}`)
  }
  statusText = (val) => {
    if (val === 0) {
      return '待认领'
    } else if (val === 4) {
      return '待确认'
    } else if ([1,3].indexOf(val) !== -1) {
      return '报价中'
    } else if (val === 2) {
      return '已完成'
    } else if (val === -1) {
      return '关闭订单'
    } else {
      return '被退回'
    }
  }
  componentWillMount () {
    let initData = {
      limit: 0,
      offset: 0,
      state: 5
    }
    sellerInquirySearch(initData).then(res => {
      console.log(res.code)
      if (res.code !== 200) return
      this.setState({count: res.data.agg.state})
    })
    this.getEnquiryData()
  }
  render () {
    const selectBefore = (
      <Select defaultValue="work_number"  disabled style={{ width: 80 }}>
        <Option value="work_number">工单号</Option>
      </Select>
    )
    const operations = (
      <div className={style.operations}>
        <Search
          addonBefore={selectBefore}
          placeholder="请输入工单号"
          style={{ width: 240 }}
          onSearch={value => this.searchChange(value)}
        />
        <Button type="primary" style={{marginLeft: 20}}><Link to="/main/new-enquiry">新建工单</Link></Button>
      </div>
    )
    const status = [{
      name: `待认领(${this.state.count[2]})`,
      value: 2
    },{
      name: `被退回(${this.state.count[1]})`,
      value: 1
    },{
      name: `待确定(${this.state.count[0]})`,
      value: 0
    },{
      name: `报价中(${this.state.count[3]})`,
      value: 3
    },{
      name: `已完成(${this.state.count[4]})`,
      value: 4
    },{
      name: `全部(${this.state.count[5]})`,
      value: 5
    }]
    const columns = [{
      title: '单号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <p>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</p>
      )
    }, {
      title: '客户简称',
      dataIndex: 'client_org[name_cn]',
      key: 'client_org',
    }, {
      title: '名称',
      dataIndex: 'sku_snapshot[name_cn]',
      key: 'sku_snapshot',
    }, {
      title: '发起人',
      dataIndex: 'creator_user[name_cn]',
      key: 'creator_user'
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <p>{this.statusText(text)}</p>
      )
    }, {
      title: '操作',
      dataIndex: 'eidt',
      key: 'edit',
      render: (text, record, index) => (
        <div>
          <Button type="primary" onClick={() => this.checkDetail(index)}>查看详情</Button>
          {
            // Number(this.state.statusValue) === 3 && (<Button type="primary">催促</Button>)
          }
        </div>
      )
    }];
    const { enquiryData, loading, tip } = this.state
    return (
      <div className={style.content}>
        <div>
          <Tabs onChange={this.tabCallback} tabBarExtraContent={operations}>
            {
              status.map(item => {
                return (
                  <TabPane tab={item.name} key={item.value}>
                    <Spin spinning={loading} tip={tip}>
                      <Table columns={columns} dataSource={enquiryData.inquiry} pagination={false} rowKey="uid"/>
                    </Spin>
                  </TabPane>
                )
              })
            }
          </Tabs>
          <div style={{marginTop: 20}}>
            <Pagination current={this.state.page} total={enquiryData.total} onChange={this.paginationChange} pageSize={this.state.limit}/>
          </div>
        </div>
      </div>
    )
  }
}
