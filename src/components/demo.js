/**
 * @module 测试页面1
 */
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { add } from 'actions'
import { Button } from 'antd';

import styles from './demo.css'

/**
 * Class 测试页面
 * @extends Component
 */
// @CSSModules(styles)
class Demo extends PureComponent {
  static propTypes = {
    text: PropTypes.string
  }

  handlerClick () {
    this.props.history.push('/tacos')
  }

  render () {
    return (
      <div>
        <span onClick={this.handlerClick.bind(this)}>go</span>
        <Button type="primary" onClick={e => {
          const { dispatch } = this.props
          dispatch(add(2))
        }}>加一</Button>
        <span className={styles.what}>这里是一个页面 </span>
      </div>
    )
  }
}

export default connect()(Demo)

