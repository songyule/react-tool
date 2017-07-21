import React, { Component } from 'react'
import moment from 'moment'
import HomeBox from 'components/home/box'
import MyUpload from 'components/common/img-upload.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as managementActions from 'actions/management'
import { Modal, Form, Input, DatePicker, Button } from 'antd'
import { groupBy, find } from 'lodash'
import Slider from 'react-slick'
import BoxHeader from 'components/home/box-header'

const FormItem = Form.Item
const { RangePicker } = DatePicker;


const numberObj = {
  pc_index_top_banner: -1,
  pc_index_top_topic: 4,
  pc_index_latest_trends: 3,
  pc_index_category_trend_1: 3,
  pc_index_category_trend_2: 3,
  pc_index_category_trend_3: 4,
  pc_index_category_trend_4: 4,
  pc_index_recommend_product: -1
}

const indexObj = {}
Object.keys(numberObj).forEach(key => {
  let number = numberObj[key]
  const list = []
  if (number !== -1) {
    while (number--) {
      list.push({
        id: '',
        title: '',
        subtitle: '',
        image_url: '',
        time: [],
        active_at: +new Date() * 0.001,
        deactive_at: +new Date() * 0.001,
        weight: numberObj[key] - number,
        link: '',
        section_code: key
      })
    }
  }
  indexObj[key] = list
})

@connect(
  state => state,
  dispatch => bindActionCreators(managementActions, dispatch)
)
class HomeSettings extends Component {
  constructor () {
    super()

    this.state = {
      editVisible: false,
      fileList: [],
      indexObj,
      editIndex: -1,
      edit: {
        id: '',
        title: '',
        subtitle: '',
        image_url: '',
        time: [],
        active_at: +new Date() * 0.001,
        deactive_at: +new Date() * 0.001,
        link: '',
        section_code: ''
      },
      imageObj: {
        'latest': [
          [],[],[]
        ]
      }
    }
  }

  handleUpload = (fileList) => {
    this.setState({
      fileList: fileList
    })
  }

  editImage = (code, index) => {
    const obj = index !== -1 ? {...this.state.indexObj[code][index]} : {
      id: '',
      title: '',
      subtitle: '',
      image_url: '',
      time: [],
      active_at: +new Date() * 0.001,
      deactive_at: +new Date() * 0.001,
      link: '',
      section_code: code
    }
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
    this.props.updateIndexConfig(editObj.id, {
      section_code: editObj.section_code,
      section_name: editObj.section_name,
      title: editObj.title,
      subtitle: editObj.subtitle,
      image_url: this.state.fileList[0].response,
      link: editObj.link,
      weight: editObj.weight,
      active_at: +new Date(editObj.time[0]) * 0.001,
      deactive_at: +new Date(editObj.time[1]) * 0.001
    }).then(res => {
      this.renderData()
    })
  }

  handleCreate = () => {
    const editObj = this.state.edit
    this.props.setIndexConfig({
      section_code: editObj.section_code,
      section_name: editObj.section_name,
      title: editObj.title,
      subtitle: editObj.subtitle,
      image_url: this.state.fileList[0].response,
      link: editObj.link,
      weight: editObj.weight,
      active_at: +new Date(editObj.time[0]) * 0.001,
      deactive_at: +new Date(editObj.time[1]) * 0.001
    }).then(res => {
      this.renderData()
    })
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
    const classList = ['topic__list-item--first', 'topic__list-item--second', 'topic__list-item--third', 'topic__list-item--fourth']

    const bannerSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: 420
    }
    const recommendedSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: 420
    }

    return (
      <div className="home-settings">
        <div className="home__banner">
          <Slider {...bannerSettings}>
            { this.state.indexObj.pc_index_top_banner.map((item, index) => (
            <div key={index}>
              <div className="home__banner-item" onClick={() => this.editImage('pc_index_top_banner', index)}>
                <div className="banner__carousel-slide-content" style={{ backgroundImage: `url(${item.image_url})` }}></div>
              </div>
            </div>
            )) }
            <div>
              <div className="home__banner-item">
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_top_banner', -1)}>
                +
                </div>
              </div>
            </div>
          </Slider>
        </div>

        <div className="topic">
          <div className="wrapper">
            <ul className="topic__list">
              { this.state.indexObj.pc_index_top_topic.map((item, index) => (
                <li className={`topic__list-item ${classList[index]}`} key={index}>
                  <div className="topic__list-item-border-wrapper">
                    <div className="topic__list-item-border"></div>
                    <div className="topic__list-item-border-title">进 入 专 题</div>
                  </div>
                  { index === 0 && <div className="topic__list-item-square--first"></div> }
                  { index === 2 && <div className="topic__list-item-square--third"></div> }
                  <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_top_topic', index)}>
                  { this.state.indexObj.pc_index_top_topic[index].image_url ? <img src={this.state.indexObj.pc_index_top_topic[index].image_url} alt=""/> : '+'}
                  </div>
                </li>
              )) }
            </ul>
          </div>
        </div>

        { this.state.indexObj.pc_index_latest_trends &&
          <HomeBox className="home-box--latest" title="最新趋势" subhead="Latest trends">
            <div className="home-box__content-left">
              <div className="home-box__content-box">
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_latest_trends', 0)}>
                { this.state.indexObj.pc_index_latest_trends[0].image_url ? <img src={this.state.indexObj.pc_index_latest_trends[0].image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <h3 className="home-box__introduce-title">{this.state.indexObj.pc_index_latest_trends[0].title}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-box__content-right">
              <div className="home-box__content-box">
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_latest_trends', 1)}>
                { this.state.indexObj.pc_index_latest_trends[1].image_url ? <img src={this.state.indexObj.pc_index_latest_trends[1].image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <h3 className="home-box__introduce-title">{this.state.indexObj.pc_index_latest_trends[1].title}</h3>
                  </div>
                </div>
              </div>
              <div className="home-box__content-box">
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_latest_trends', 2)}>
                  { this.state.indexObj.pc_index_latest_trends[2].image_url ? <img src={this.state.indexObj.pc_index_latest_trends[2].image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <h3 className="home-box__introduce-title">{this.state.indexObj.pc_index_latest_trends[2].title}</h3>
                  </div>
                </div>
              </div>
            </div>
          </HomeBox>
        }


        { this.state.indexObj.pc_index_category_trend_1 &&
          <HomeBox className="home-box--embroidery" title="绣花章趋势" subhead="Embroidery trends">
            { this.state.indexObj.pc_index_category_trend_1.map((item, index) => (
              <div className="home-box__content-box" key={index}>
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_category_trend_1', index)}>
                { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <h3 className="home-box__introduce-title">{item.title}</h3>
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <div className="home-box__introduce-attributes-box">
                      <span className="home-box__introduce-date">
                        <i className="iconfont icon-biaoqian"></i> 18\07\22
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) }
          </HomeBox>
        }


        { this.state.indexObj.pc_index_category_trend_2 &&
          <HomeBox className="home-box--handmade" title="手工钉珠趋势" subhead="Handmade Bead trends">
            { this.state.indexObj.pc_index_category_trend_2.map((item, index) => (
              <div className="home-box__content-box" key={index}>
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_category_trend_2', index)}>
                { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <h3 className="home-box__introduce-title">{item.title}</h3>
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <div className="home-box__introduce-attributes-box">
                      <span className="home-box__introduce-date">
                        <i className="iconfont icon-biaoqian"></i> 18\07\22
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) }
          </HomeBox>
        }


        { this.state.indexObj.pc_index_category_trend_3 &&
          <HomeBox className="home-box--ribbon" title="织带趋势" subhead="Ribbon trends">
            { this.state.indexObj.pc_index_category_trend_3.map((item, index) => (
              <div className="home-box__content-box" key={index}>
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_category_trend_3', index)}>
                { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
                </div>
                <div className="home-box__introduce-wrapper">
                  <div className="home-box__introduce">
                    <h3 className="home-box__introduce-title">{item.title}</h3>
                    <div className="home-box__introduce-bar-wrapper">
                      <div className="home-box__introduce-bar"></div>
                    </div>
                    <div className="home-box__introduce-attributes-box">
                      <span className="home-box__introduce-date">
                        <i className="iconfont icon-biaoqian"></i> 18\07\22
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) }
          </HomeBox>
        }


        {
          // this.state.indexObj.pc_index_category_trend_4 &&
          // <HomeBox className="home-box--lace" title="花边趋势" subhead="Lace trends">
          //   { this.state.indexObj.pc_index_category_trend_4.map((item, index) => (
          //     <div className="home-box__content-box" key={index}>
          //       <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_category_trend_4', index)}>
          //       { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
          //       </div>
          //       <div className="home-box__introduce-wrapper">
          //         <div className="home-box__introduce">
          //           <h3 className="home-box__introduce-title">{item.title}</h3>
          //           <div className="home-box__introduce-bar-wrapper">
          //             <div className="home-box__introduce-bar"></div>
          //           </div>
          //           <div className="home-box__introduce-attributes-box">
          //             <span className="home-box__introduce-date">
          //               <i className="iconfont icon-biaoqian"></i> 18\07\22
          //             </span>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   )) }
          // </HomeBox>
        }
        <div className="home__recommended">
          <BoxHeader title="推荐商品" subhead="Recommended products"></BoxHeader>
          <Slider {...recommendedSettings}>
            { this.state.indexObj.pc_index_recommend_product.map((item, index) => (
            <div key={index}>
              <div className="home__recommended-item" onClick={() => this.editImage('pc_index_recommend_product', index)}>
                <img src={item.image_url}/>
              </div>
            </div>
            )) }
            <div>
              <div className="home__recommended-item">
                <div className="home-box__image-edit" onClick={() => this.editImage('pc_index_recommend_product', -1)}>
                +
                </div>
              </div>
            </div>
          </Slider>
        </div>


        <Modal visible={this.state.editVisible} title={this.state.edit.id ? '编辑内容' : '创建内容'} width={800} onOk={this.handleOk} onCancel={this.handleCancel}>
          { this.state.edit.id && <Button type="danger" onClick={this.handleDelete}>删除</Button> }
          <Form className="settings-form">
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
        </Modal>
      </div>
    )
  }
}

export default HomeSettings
