import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import { Table, Input, Select, Cascader, Button, Icon } from 'antd'
import { showClasses } from 'utils'
import LazyImage from 'lazyimage'
import arrayToTree from 'array-to-tree'
import style from './spu-list.css'

const Option = Select.Option
const Search = Input.Search

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
        class_id: '',
        status: '',
        check_status: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      list: [],
      classes: []
      // selectedRowKeys: []
    }
  }

  selectBefore = () => {
    return (
      <Select defaultValue={this.state.spu.condition} onChange={this.changeCondition}>
        <Option value="name_cn">商品名称</Option>
        <Option value="code">商品编号</Option>
      </Select>
    )
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
      spu: { ...this.state.spu, condition: value, kw: '' }
    })
    document.querySelector('.ant-input-search').value = ''
  }

  handleSearch = (value) => {
    this.setState({
      spu: { ...this.state.spu, kw: value, currentPage: 1 }
    }, () => {
      this.getGoodsData()
    })
  }

  getGoodsData = async () => {
    const params = {}
    params.offset = (this.state.spu.currentPage - 1) * this.state.spu.pageSize
    params.limit = this.state.spu.pageSize
    params.order_by = 1
    // params.as_supplier = 1
    if (this.state.spu.check_status) params.check_status = this.state.spu.check_status
    if (this.state.spu.status) params.status = this.state.spu.status
    if (this.state.spu.class_id && this.state.spu.class_id[0]) params.class_id = this.state.spu.class_id
    if (this.state.spu.condition && this.state.spu.kw) params[this.state.spu.condition] = this.state.spu.kw
    const res = await this.props.getSpuList(params)
    this.setState({
      list: res.data.spu,
      spu: { ...this.state.spu, total: res.data.total }
    })
  }

  getColumns = () => {
    return [
      {
        title: '',
        dataIndex: 'image_url',
        render: text => <LazyImage width={48} height={48} src={text[0]||'https://test.fuliaoyi.com/static/img/goods-img.1063b9e.png'}></LazyImage>
      },
      {
        title: '商品名称',
        dataIndex: 'name_cn',
        render: text => <span>{text}</span>
      },
      {
        title: <Cascader options={this.state.classes} onChange={this.changeClass}><span>分类 <Icon type="filter" /></span></Cascader>,
        dataIndex: 'commodity_class',
        render: text => <span>{showClasses(text)} </span>
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <Button onClick={() => this.props.select(record)}>选择</Button>
        )
      }
    ]
  }

  getClasses = async () => {
    const res = await this.props.getClasses()
    let classes = res.data.filter(item => [undefined, 1, 2].indexOf(item.level) > -1)
    classes = classes.map(item => {
      item = { ...item, value: item.id, label: item.name_cn }
      return item
    })
    classes.forEach(item => {
      item.disabled = item.status !== 1
    })
    const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
    matchClass.parent_id = null
    const sortClass = arrayToTree(classes)[0].children
    sortClass.unshift({ value: '', label: '全部' })
    sortClass.forEach(classItem => {
      if (classItem.children) classItem.children.unshift({ value: classItem.id, label: `全部${classItem.name_cn}` })
    })
    this.setState({
      classes: sortClass
    })
    return res
  }

  pageChange = (value) => {
    this.setState({
      spu: {...this.state.spu, currentPage: value }
    }, () => {
      this.getGoodsData()
    })
  }

  changeClass = (value) => {
    const classId = value.slice(-1)
    this.setState({
      spu: {...this.state.spu, class_id: classId }
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
        <div className={style['goods-list__operate-row']}>
          <Search addonBefore={this.selectBefore()} placeholder="搜索商品名称" onSearch={this.handleSearch}/>
        </div>
        <Table rowKey="id" columns={this.getColumns()} dataSource={this.state.list} pagination={{ current: this.state.spu.currentPage, pageSize: this.state.spu.pageSize, total: this.state.spu.total, onChange: this.pageChange }}></Table>
      </div>
    )
  }
}

export default CommodityList
