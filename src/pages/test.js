/**
 * @module 测试页面2
 */
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './test.css'
/**
 * Class 测试页面2
 * @extends Component
 */
class Test extends Component {
  static propTypes = {
    // openLoginModal: PropTypes.func
  }

  render () {
    const { resultNumber } = this.props
    return (
      <div>
        <span className={styles.ly}>测试测试</span>
        <span>{resultNumber}</span>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { resultNumber } = state

  return {
    resultNumber
  }
}

export default connect(mapStateToProps)(Test)

