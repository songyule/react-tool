import React, { PureComponent } from 'react'
import { Modal, Icon } from 'antd'
// import Goods from 'pages/topic/components/goods-dialog'
import AddGoods from 'pages/topic/components/add-goods'
import MyUpload from 'pages/topic/components/img-upload'
import styles from './trend-item.css'
// import { Button, Icon } from 'antd'

/**
 *
 * @export
 * @page
 * @module 专题文章列表页面
 */
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      pageVisible: false,
      goodsVisible: false,
      fileList: props.fileList || '',
      selectedRowObjs: props.fileList || []
    }
  }

  static defaultProps = {
    isAdd: false
  }

  componentWillReceiveProps (e) {
    this.setState({
      fileList: e.fileList || '',
      selectedRowObjs: e.selectedRowObjs || []
    })
  }

  clear = () => {
    this.setState({
      fileList: '',
      selectedRowObjs: []
    })
  }


  goodsChange = (selectedRowObjs) => this.setState({ selectedRowObjs })
  handleChange = (fileList) => {
    this.setState({ fileList: [...fileList] })
  }

  showModal = () => this.setState({pageVisible: true})
  hideModal = () => this.setState({pageVisible: false})

  clickOkModal = () => {
    const { fileList, selectedRowObjs } = this.state
    this.hideModal()
    this.props.onChange(fileList, selectedRowObjs)
  }

  goodsShowModal = () => this.setState({goodsVisible: true})
  goodsHideModal = () => this.setState({goodsVisible: false})


  render () {
    const { isDragging, isAdd } = this.props
    const { selectedRowObjs, fileList } = this.state
    const opacity = isDragging ? 0 : 1

    return (
      <div>
        {
          (fileList && !isAdd && fileList.length) ? (
            <div  className={styles.box} style={{ opacity }} onClick={this.showModal}>
              <Icon className={styles.box__close} type="close-square" onClick={this.props.delPage} />
              <img src={fileList[0].response} alt="" style={{width: '100%'}} />
            </div>
          ) : null
        }
        <Modal
          title="上传内容"
          width={800}
          visible={this.state.pageVisible}
          onOk={this.clickOkModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <MyUpload
            fileList={fileList}
            className={styles.upload}
            onChange={ this.handleChange }
          ></MyUpload>
          <AddGoods selectedRowObjs={selectedRowObjs} onChange={this.goodsChange}></AddGoods>
        </Modal>
      </div>
    )
  }
}
