import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity'
import { Modal } from 'antd'
import BomCard from './bom-card'

/**
 * @export
 * @page
 * @module 新建 BOM 弹框
 */
@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
export default class extends PureComponent {
  constructor () {
    super()

    this.state = {
      bom: {
        name: '',
        classesSelected: [],
        amount: '',
        unit: '',
        quality_req: '',
        quality_testing_req: '',
        attributes: []
      }
    }
  }

  changeBom = (bomPart) => {
    const bom = this.state.bom
    this.setState({
      bom: {
        ...bom, ...bomPart
      }
    })
  }

  componentWillMount = () => {
    this.props.getClasses()
  }

  render () {
    return (
      <div className="commodity-selection">
        <Modal
          visible={this.props.visible}
          title="新建 BOM"
          width={800}
          onOk={() => this.props.callback(this.state.bom)}
          onCancel={this.props.onCancel}>
          <BomCard bom={this.state.bom} changeBom={this.changeBom}></BomCard>
        </Modal>
      </div>
    )
  }
}
