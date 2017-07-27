import React, { Component } from 'react'
import moment from 'moment'
import MyUpload from 'components/common/img-upload.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as managementActions from 'actions/management'
import { Modal, Form, Input, DatePicker, Button } from 'antd'
import { groupBy, find } from 'lodash'
import { emptyItem, numberObj, dataObj as indexObj } from './utils'
import Banner from './components/mobile/banner.js'
import Nav from './components/mobile/nav.js'
import Topic from './components/mobile/topic'
import LatestTrends from './components/mobile/latest-trends'
import CommonTrends from './components/mobile/common-trends'
import Recommended from './components/mobile/recommended'
import TrendList from './components/trend-list'
import { MOBILE_URL } from 'api/config'
import './mobile-settings.css'

const FormItem = Form.Item
const { RangePicker } = DatePicker

@connect(
  state => state,
  dispatch => bindActionCreators(managementActions, dispatch)
)
class HomeSettings extends Component {
  constructor () {
    super()

    this.state = {
      editVisible: false,
      articleVisible: false,
      fileList: [],
      indexObj,
      editIndex: -1,
      edit: { ...emptyItem }
    }
  }

  handleUpload = (fileList) => {
    this.setState({
      fileList: fileList
    })
  }

  editImage = (code, index) => {
    const obj = index !== -1 ? {...this.state.indexObj[code][index]} : { ...emptyItem, section_code: code }
    obj.time = [moment(obj.active_at * 1000).format('YYYY/MM/DD HH:mm:ss'), moment(obj.deactive_at * 1000).format('YYYY/MM/DD HH:mm:ss')]
    const fileList = []
    if (obj.image_url) fileList.push({
      uid: 1,
      name: 'sdhjkfhsyuiweyrnn222.png',
      status: 'done',
      url: obj.image_url,
      response: obj.image_url,
      thumbUrl: obj.image_url,
    })
    this.setState({
      edit: obj,
      editIndex: index,
      editVisible: true,
      fileList
    })
  }

  handleUpdate = () => {
    const editObj = this.state.edit
    const data = {
      section_code: editObj.section_code,
      section_name: editObj.section_name,
      title: editObj.title,
      subtitle: editObj.subtitle,
      image_url: this.state.fileList[0].response,
      link: editObj.link,
      weight: editObj.weight,
      active_at: +new Date(editObj.time[0]) * 0.001,
      deactive_at: +new Date(editObj.time[1]) * 0.001
    }
    if (editObj.obj_id) data.obj_id = editObj.obj_id
    this.props.updateIndexConfig(editObj.id, data).then(res => this.renderData())
  }

  handleCreate = () => {
    const editObj = this.state.edit
    const data = {
      section_code: editObj.section_code,
      section_name: editObj.section_name,
      title: editObj.title,
      subtitle: editObj.subtitle,
      image_url: this.state.fileList[0].response,
      link: editObj.link,
      weight: editObj.weight,
      active_at: +new Date(editObj.time[0]) * 0.001,
      deactive_at: +new Date(editObj.time[1]) * 0.001
    }
    if (editObj.obj_id) data.obj_id = editObj.obj_id
    this.props.setIndexConfig(editObj).then(res => this.renderData())
  }

  handleOk = async () => {
    this.state.edit.id ? await this.handleUpdate() : await this.handleCreate()
    this.setState({
      editVisible: false
    })
  }

  handleCancel = () => {
    this.setState({
      editVisible: false
    })
  }

  handleDelete = () => {
    this.props.removeIndexConfig(this.state.edit.id).then(res => {
      this.renderData()
      this.setState({
        editVisible: false
      })
    })
  }

  changeTitle = (e) => {
    const edit = {...this.state.edit}
    this.setState({
      edit: { ...edit, title: e.target.value }
    })
  }

  changeSubtitle = (e) => {
    const edit = {...this.state.edit}
    this.setState({
      edit: { ...edit, subtitle: e.target.value }
    })
  }

  changeLink = (e) => {
    const edit = {...this.state.edit}
    this.setState({
      edit: { ...edit, link: e.target.value }
    })
  }

  changeTime = (dates, dateStrings) => {
    const edit = {...this.state.edit}
    this.setState({
      edit: { ...edit, time: dateStrings }
    })
  }

  handleSelect = (trend) => {
    const editObj = this.state.edit
    editObj.title = trend.title
    editObj.image_url = trend.cover_image
    editObj.link = `${MOBILE_URL}/trend-detail/${trend.id}`
    editObj.obj_id = trend.id
    const fileList = []
    if (editObj.image_url) fileList.push({
      uid: 1,
      name: 'sdhjkfhsyuiweyrnn222.png',
      status: 'done',
      url: editObj.image_url,
      response: editObj.image_url,
      thumbUrl: editObj.image_url
    })
    this.setState({
      fileList,
      edit: { ...editObj }
    })
  }

  renderData = () => {
    this.props.getIndexConfig({ section_code: ['pc_index_top_banner', 'pc_index_latest_trends', 'pc_index_top_topic', 'pc_index_category_trend_1', 'pc_index_category_trend_2', 'pc_index_category_trend_3', 'pc_index_category_trend_4', 'pc_index_recommend_product'], limit: 9999 }).then(res => {
      const groupObj = groupBy(res.data.index_config, 'section_code')

      Object.keys(numberObj).forEach(key => {
        if (!groupObj[key]) groupObj[key] = []
        let count = numberObj[key]
        if (count === -1) {
          indexObj[key] = groupObj[key]
        } else {
          const list = []
          while (count--) {
            const matchObj = find(groupObj[key], { 'weight': count + 1 })
            list[count] = matchObj ? {...matchObj} : {...indexObj[key][count]}
          }
          indexObj[key] = list
        }
      })
      this.setState({
        indexObj
      })
    })
  }

  componentWillMount = () => {
    this.renderData()
  }

  render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      }
    }

    return (
      <div className="mobile-home-settings">
        <Banner list={this.state.indexObj.pc_index_top_banner}></Banner>

        <Nav></Nav>

        <Topic list={this.state.indexObj.pc_index_top_topic}></Topic>

        <LatestTrends list={this.state.indexObj.pc_index_latest_trends}></LatestTrends>

        <CommonTrends title="贴布绣趋势" list={this.state.indexObj.pc_index_category_trend_1}></CommonTrends>

        <CommonTrends title="纽扣趋势" list={this.state.indexObj.pc_index_category_trend_2}></CommonTrends>

        <CommonTrends title="织带趋势" list={this.state.indexObj.pc_index_category_trend_3}></CommonTrends>

        <Recommended list={this.state.indexObj.pc_index_recommend_product}></Recommended>

        <Modal visible={this.state.editVisible} title={this.state.edit.id ? '编辑内容' : '创建内容'} width={800} onOk={this.handleOk} onCancel={this.handleCancel}>
          { this.state.edit.id && <Button type="danger" onClick={this.handleDelete}>删除</Button> }
          <Form className="settings-form">
            { this.state.edit.obj_id && <FormItem {...formItemLayout} label="已选文章id">
                { this.state.edit.obj_id }
              </FormItem>
            }
            <FormItem {...formItemLayout} label="标题">
              <Input onChange={this.changeTitle} value={this.state.edit.title}></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="副标题">
              <Input onChange={this.changeSubtitle} value={this.state.edit.subtitle}></Input>
            </FormItem>
            <FormItem {...formItemLayout} label="图片">
              <MyUpload onChange={this.handleUpload} fileList={[...this.state.fileList]}></MyUpload>
            </FormItem>
            <FormItem {...formItemLayout} label="时间">
              {
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={this.changeTime}
                  size="default"
                  value={this.state.edit.time.map(item => item ? moment(item, 'YYYY/MM/DD HH:mm:ss') : '')}>
                </RangePicker>
              }
            </FormItem>
            <FormItem {...formItemLayout} label="跳转">
              <Input onChange={this.changeLink} value={this.state.edit.link}></Input>
            </FormItem>
          </Form>

          { this.state.edit.section_code !== 'pc_index_top_banner' && this.state.edit.section_code !== 'pc_index_recommend_product' && <Button onClick={() => this.setState({ articleVisible: true })}>选择文章</Button> }

          { this.state.articleVisible && <TrendList select={this.handleSelect}></TrendList> }
        </Modal>
      </div>
    )
  }
}

export default HomeSettings
