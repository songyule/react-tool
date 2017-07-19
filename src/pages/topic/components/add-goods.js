import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'

import Goods from './goods-dialog'
import style from './topic-form.css'

import { showPrice } from 'utils'

/**
 *
 * @export
 * @component
 * @module 添加商品 组件
 */
export default class AddGoods extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      selectedRowObjs: props.selectedRowObjs || [],
      visible: false
    }
  }

  static propTypes = {
    onChange:  PropTypes.func.isRequired
  }

  componentWillReceiveProps (e) {
    console.log(4)
    this.setState({
      selectedRowObjs: e.selectedRowObjs || []
    })
  }

  clear () {
    setTimeout(() => {
      let instant = this.refs.goods.wrappedInstance
      instant.clear()
    }, 0)
  }

  // dialog 点击 ok
  handleOk = (e) => {
    let instant = this.refs.goods.wrappedInstance
    instant.clear()
    let arr = [...this.state.selectedRowObjs, ...instant.state.selectedRowObjs]
    // this.clear()
    this.setState({
      visible: false,
      selectedRowObjs: []
    })
    this.props.onChange(arr)
  }

  // dialog 点击取消
  handleCancel = (e) => {
    let instant = this.refs.goods.wrappedInstance
    instant.clear()
    this.setState({
      visible: false,
    })
  }

  showModal = () => {
    this.setState({ visible: true }, () => {
      let instant = this.refs.goods.wrappedInstance
      instant.getGoodsData()
    })
  }

  // 删除商品
  closeGoods = (index) => {
    let objs = this.state.selectedRowObjs
    objs.splice(index, 1)
    this.setState({
      visible: false,
      selectedRowObjs: [...objs]
    })
    this.props.onChange([...objs])
  }

  render() {
    const { selectedRowObjs } = this.state
    console.log(selectedRowObjs)
    // console.log(selectedRowObjs)
    return (
      <div>
        <Button type="primary" size="small" onClick={this.showModal}><h6>添加商品</h6></Button>
        {
          selectedRowObjs.length ? (
            <div>
              <h2>已选商品</h2>
              <div className={style['goods-wrapper']}>
                {
                  selectedRowObjs.map((obj,index) => (
                    <div className={style.item} key={index}>
                      <Icon type="close-circle" onClick={() => this.closeGoods(index)} className={style.item__close} />
                      <img className={style.item__img} src={obj.image_url} alt=""/>
                      <p  className={style.item__name}>{obj.name_cn}</p>
                      <p  className={style.item__price}>{showPrice(obj.sku)}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : null
        }

        <Modal
          title="添加商品"
          width={700}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Goods ref="goods"/>
        </Modal>

      </div>
    )
  }
}
