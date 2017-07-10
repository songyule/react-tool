import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'antd'
import SameForm from 'pages/topic/components/sameForm'

import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragItem from './drag-item';
import TrendItem from './trend-item';

const FormItem = Form.Item

const style = {
  display: 'flex',
  'flexWrap': 'wrap',
}

/**
 *
 * @export
 * @page
 * @module 趋势文章列表页面
 */
@Form.create()
@DragDropContext(HTML5Backend)
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      pages: [],
      fileList: '',
      isFirst: true
    }
  }
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }
  static defaultProps = {
    fileList: ''
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.isFirst) return

    this.setState({
      isFirst: false
    })
    if (nextProps.trend_image) {
      let temp = nextProps.trend_image.map(item => {
        return ({
          fileList: [{
            uid: -1,
            name: 'sdhjkf123333hsyuiweyrnn.png',
            status: 'done',
            url: item.trend_image,
            response: item.trend_image,
            thumbUrl: item.trend_image,
          }],
          selectedRowObjs: item.spu || []
        })
      })
      this.setState({
        pages: temp
      })
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return
      let trend = this.state.pages.map(item => {
        return ({
          trend_image: item.fileList[0].response,
          spu_id: item.selectedRowObjs.map(val => val.id) || []
        })
      })
      let obj = {
        'article_type': 2,
        'title': fieldsValue.title,
        'cover_image': fieldsValue.image[0].response,
        'weight': fieldsValue.weight || 0,
        'status': fieldsValue.display ? 2 : 1,
        'article_tag': this.refs.common.state.tags,
        'trend_image': trend
      }

      this.props.handleSubmit(obj)
    })
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { pages } = this.state;
    const dragCard = pages[dragIndex];

    this.setState(update(this.state, {
      pages: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }))
  }

  changeItem = (fileList, selectedRowObjs, index) => {
    let { pages } = this.state
    pages[index].fileList = fileList
    pages[index].selectedRowObjs = selectedRowObjs
    this.setState({pages})
  }

  addItem = (fileList, selectedRowObjs) => {
    let { pages } = this.state
    let temp = {}
    temp.fileList = fileList
    temp.selectedRowObjs = selectedRowObjs
    this.refs.addItem.clear()

    if (fileList && fileList.length) {
      this.setState({
        pages: [...pages, temp]
      })
    }
  }

  showModal = () => {
    this.refs.addItem.showModal()
  }

  handleChange = (fileList) => {
    this.setState({fileList})
  }

  delPage = (index, e) => {
    e.stopPropagation()
    let { pages } = this.state
    pages.splice(index, 1)
    this.setState({pages: [...pages]})
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { pages, fileList } = this.state
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 12,
        },
      },
    }

    return (
      <div style={{width: '1000px'}}>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <div>
              {/* 通用的 formItem 内容 */}
              <SameForm
                onChange={this.handleChange}
                ref="common"
                fileList={fileList}
                getFieldDecorator={getFieldDecorator}
                {...this.props}
              ></SameForm>
            </div>
            <FormItem
              {...formItemLayout}
              label='内容'
            >
              <div style={style}>
                {pages.map((page, i) => (
                  <DragItem
                    key={i + Math.random()}
                    index={i}
                    id={i}
                    moveCard={this.moveCard}
                  >
                    <TrendItem
                      onChange={(...arg) => this.changeItem(...arg, i)}
                      delPage={(e) => this.delPage(i, e)}
                      fileList={page.fileList}
                      selectedRowObjs={[...page.selectedRowObjs]}
                    ></TrendItem>
                  </DragItem>
                ))}
              </div>
              <div>
                <Button type="primary" ghost onClick={this.showModal}>添加一页</Button>
                <TrendItem
                  isAdd
                  ref="addItem"
                  onChange={this.addItem}
                ></TrendItem>
              </div>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large" onClick={this.submit}>保存并创建</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
