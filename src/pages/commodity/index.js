import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import { Table, Input, Select } from 'antd'
import { spu as spuList } from './commodity.json'
import { showClasses, showPrice, showShelvesStatus, showReviewStatus, format } from 'utils'
import LazyImage from 'lazyimage'
const Option = Select.Option
const Search = Input.Search

const columns = [
  {
    title: '',
    dataIndex: 'image_url',
    render: text => <LazyImage width={48} height={48} src={text}></LazyImage>
  },
  {
    title: '商品名称',
    dataIndex: 'name_cn',
    render: text => <span>{text}</span>
  },
  {
    title: '分类',
    dataIndex: 'commodity_class',
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
    render: text => <span>{showShelvesStatus(text)}</span>
  },
  {
    title: '审核状态',
    dataIndex: 'check_status',
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
        condition: 'name',
        kw: ''
      },
      list: []
    }

    this.changeCondition = this.changeCondition.bind(this)
  }

  selectBefore = () => {
    return (
      <Select defaultValue={this.state.spu.condition} onChange={this.changeCondition}>
        <Option value="name">商品名称</Option>
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

  getGoodsData = () => {
    this.props.getSpuList({ [this.state.spu.condition]: this.state.spu.kw })
  }

  componentDidMount () {
    // this.props.getSpuList().then(res => {
    //   console.log(res)
    // })
  }

  render () {
    return (
      <div className="page_goods-list">
        <Search addonBefore={this.selectBefore()} placeholder="搜索商品名称" onSearch={this.handleSearch}/>
        <Table rowKey="id" columns={columns} dataSource={spuList}></Table>
      </div>
    )
  }
}

export default CommodityList
