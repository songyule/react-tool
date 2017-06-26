import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import { Table, Input, Select, Menu, Cascader } from 'antd'
// import { spu as spuList } from './commodity.json'
import { showClasses, showPrice, showShelvesStatus, showReviewStatus, format } from 'utils'
import LazyImage from 'lazyimage'
const Option = Select.Option
const Search = Input.Search

const shelvesList = [
  {
    value: '1',
    text: '已上架'
  },
  {
    value: '2',
    text: '未上架'
  }
]
const reviewList = [
  {
    value: '2',
    text: '审核中'
  },
  {
    value: '3',
    text: '审核通过'
  },
  {
    value: '4',
    text: '审核不通过'
  },
  {
    value: '5',
    text: '免审核'
  }
]

const columns = [
  {
    title: '',
    dataIndex: 'image_url',
    render: text => <LazyImage width={48} height={48} src={text||'https://test.fuliaoyi.com/static/img/goods-img.1063b9e.png'}></LazyImage>
  },
  {
    title: '商品名称',
    dataIndex: 'name_cn',
    render: text => <span>{text}</span>
  },
  {
    title: '分类',
    dataIndex: 'commodity_class',
    filterDropdown: (
      <div className="classes-filter-dropdown"></div>
    ),
    render: text => <span>{showClasses(text)}</span>
  },
  {
    title: '价格',
    dataIndex: 'sku',
    render: text => <span>{showPrice(text)}</span>
  },
  {
    title: '上架状态',
    dataIndex: 'status',
    filterDropdown: (
      <div className="classes-filter-dropdown">
        <Menu>
          { shelvesList.map(shelves => <Menu.Item>{shelves.text}</Menu.Item>) }
        </Menu>
      </div>
    ),
    render: text => <span>{showShelvesStatus(text)}</span>
  },
  {
    title: '审核状态',
    dataIndex: 'check_status',
    filterDropdown: (
      <div className="classes-filter-dropdown">
        <Menu>
          { reviewList.map(review => <Menu.Item>{review.text}</Menu.Item>) }
        </Menu>
      </div>
    ),
    render: text => <span>{showReviewStatus(text)}</span>
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    render: text => <span>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    render: text => <span>{format(text * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>
  }
]

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
class CommodityList extends PureComponent {
  constructor () {
    super()
    this.state = {
      spu: {
        condition: 'name_cn',
        kw: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      list: []
    }

    this.changeCondition = this.changeCondition.bind(this)
  }

  selectBefore = () => {
    return (
      <Select defaultValue={this.state.spu.condition} onChange={this.changeCondition}>
        <Option value="name_cn">商品名称</Option>
        <Option value="code">商品编号</Option>
      </Select>
    )
  }

  clickCode = (e) => {
    // console.log(this)
    // this.props.sendVerify({ mobile: this.state.mobile })
  }

  changeMobile = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }

  changeCode = (e) => {
    this.setState({
      code: e.target.value
    })
  }

  changeCondition = (value) => {
    this.setState({
      spu: { ...this.state.spu, condition: value }
    })
  }

  handleSearch = (value) => {
    this.setState({
      spu: { ...this.state.spu, kw: value }
    }, () => {
      this.getGoodsData()
    })
  }

  getGoodsData = async () => {
    const params = {}
    params.offset = this.state.spu.currentPage * this.state.spu.pageSize
    params.limit = this.state.spu.pageSize
    if (this.state.spu.condition && this.state.spu.kw) params[this.state.spu.condition] = this.state.spu.kw
    const res = await this.props.getSpuList(params)
    this.setState({
      list: res.data.spu,
      spu: { ...this.state.spu, total: res.data.total }
    })
  }

  getClasses = async () => {
    const res = await this.props.getClasses()
    console.log(res)
  }
  
  pageChange = (value) => {
    this.setState({
      spu: {...this.state.spu, currentPage: value }
    }, () => {
      this.getGoodsData()
    })
  }

  componentWillMount () {
    this.getGoodsData()
    this.getClasses()
  }

  render () {
    return (
      <div className="page_goods-list">
        <Search addonBefore={this.selectBefore()} placeholder="搜索商品名称" onSearch={this.handleSearch}/>
        <Table rowKey="id" columns={columns} dataSource={this.state.list} pagination={{ current: this.state.spu.currentPage, pageSize: this.state.spu.pageSize, total: this.state.spu.total, onChange: this.pageChange }}></Table>
      </div>
    )
  }
}

export default CommodityList
