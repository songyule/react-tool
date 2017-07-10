import React, { PureComponent } from 'react'
import Card from './card'
import { connect } from 'react-redux'
import style from './detail.css'
import { isEmptyObject } from 'utils/index'

@connect(state => state)

export default class ClassesDetail extends PureComponent {

  render () {
    const attr = this.props.currentAttributeDetail

    return (
      !isEmptyObject(attr)
        ? (
          <div style={{paddingTop: '38px'}}>
            <Card title={`属性 - ${attr}`}>
              <div className={style['attr']}>
              </div>
            </Card>
          </div>
        )
        : null
    )
  }
}
