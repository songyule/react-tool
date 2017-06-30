import React, { PureComponent } from 'react'
import { Modal } from 'antd'
// import { Input, Icon, Table, Button, Switch, Modal } from 'antd'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  marginRight: '.5rem',
  backgroundColor: 'white',
  cursor: 'pointer',
  width: '200px',
  height: '100px',
}

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
    }
  }

  showModal = () => this.setState({visible: true})
  hideModal = () => this.setState({visible: false})

  render () {
    const { text, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      <div>
        <div style={{ ...style, opacity }} onClick={this.showModal}>
          {text}
        </div>
        <Modal
          title="Modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </Modal>
      </div>
    )
  }
}
