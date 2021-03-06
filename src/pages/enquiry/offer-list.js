import React, { PureComponent } from 'react'
import { format } from 'utils'
import { getOfferList, claimOffer } from 'actions/sampling'
import { Link } from 'react-router-dom'
import Title from 'components/title'
import { Tabs, Table, Button, Select, Input, Spin, message } from 'antd'
const [Option, Search, ButtonGroup, TabPane] = [Select.Option, Input.Search, Button.Group, Tabs.TabPane]

export default class OfferList extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      state: 2,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      search: {
        type: 'id',
        content: ''
      },
      loading: false,
      tip: '加载中……',
      count: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    }
  }
  componentWillMount () {
    this.getList()
    this.getStateCount()
  }

  handleSearch = e => {
    this.setState({ search: { ...this.state.search, content: e } }, this.getList)
  }

  handleSearchTypeChange = e => {
    this.setState({ search: { type: e, content: '' } })
    document.querySelector('.ant-input-search').value = ''
  }

  handleTabsChange = e => {
    this.setState(
      {
        state: e,
        pagination: {
          current: 1,
          pageSize: 10
        }
      },
      this.getList
    )
  }

  handleTableChange = e => {
    this.setState({ pagination: { ...e } }, this.getList)
  }

  handleClaim = async (id) => {
    this.setState({ loading: true, tip: '认领中……' })
    const res = await claimOffer(id)
    if (res.code === 200) {
      setTimeout(() => {
        message.success('认领成功')
        this.getStateCount()
        this.getList()
      }, 2000)
    }
  }

  getList = async () => {
    this.setState({ loading: true, tip: '加载中……' })

    const { current, pageSize } = this.state.pagination
    const { type, content } = this.state.search
    const { state } = this.state

    const params = {
      state,
      limit: pageSize,
      offset: (current - 1) * pageSize
    }
    if (content) params[type] = content

    const { data } = await getOfferList(params)
    console.log(data)
    this.setState({
      loading: false,
      list: data.inquiry,
      pagination: { ...this.state.pagination, total: data.total }
    })
  }

  getStateCount = async () => {
    this.setState({ loading: true, tip: '加载中……' })
    const params = {
      limit: 0,
      offset: 0,
      state: 5
    }

    const { data } = await getOfferList(params)
    this.setState({
      loading: false,
      count: data.agg.state
    })
  }

  render () {
    const { list, pagination, loading, tip, count } = this.state

    const tabsMapping = (countMapping) => [
      { name: `待认领(${countMapping[2]})`, key: 2 },
      { name: `报价中(${countMapping[3]})`, key: 3 },
      { name: `全部(${countMapping[5]})`, key: 5 },
    ]

    const statusMapping = {
      0: '待认领',
      1: '报价中',
      2: '已完成',
      3: '销售退回报价',
      4: '采购有报价提供',
      [-1]: '销售关闭了询价单',
      [-2]: '采购退回询价单'
    }

    const STATUS_WAITING_FOR_CLAIM = 0

    const columns = [
      {
        title: '单号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: text => <span>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>
      },
      {
        title: '商品名称',
        dataIndex: 'sku_snapshot',
        render: (text, record) => <span>{record.sampling_type !== 2 ? record.sku_snapshot.spu_name_cn : record.custom_commodity_name}</span>
      },
      {
        title: '发起人',
        dataIndex: 'creator_user',
        render: text => <span>{text.name_cn}</span>
      },
      {
        title: '认领人',
        dataIndex: 'buyer[name_cn]',
        key: 'buyer'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{statusMapping[text]}</span>
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'action',
        render: (text, record) => (
          <ButtonGroup>
            <Button>
              <Link to={`/main/offer-info/${record.id}`}>查看</Link>
            </Button>
            {text === STATUS_WAITING_FOR_CLAIM ? <Button type="primary" onClick={(id) => this.handleClaim(record.id)}> 认领 </Button> : null}
          </ButtonGroup>
        )
      }
    ]

    const selectBefore = (
      <Select defaultValue="id" style={{ width: 80 }} onChange={this.handleSearchTypeChange}>
        <Option value="id"> 单号 </Option>
      </Select>
    )

    return (
      <div>
        <Title title="报价单列表">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Search
              addonBefore={selectBefore}
              placeholder='搜索'
              onSearch={value => this.handleSearch(value)}
            />
          </div>
        </Title>
        <Spin spinning={loading} tip={tip}>
          <Tabs onChange={this.handleTabsChange}>
            {tabsMapping(count).map(tab => <TabPane tab={tab.name} key={tab.key} />)}
          </Tabs>
          <Table
            rowKey="id"
            dataSource={list}
            columns={columns}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </Spin>
      </div>
    )
  }
}
