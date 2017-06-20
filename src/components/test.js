/**
 * @module 测试页面2
 */
// import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styles from './test.css'
import { Link, Route } from 'react-router-dom'
import Item01 from './item1'
import Item02 from './item2'

/**
 * Class 测试页面2
 * @extends Component
 */
@connect(
  state => ({ resultNumber: state.resultNumber })
)
class Test extends PureComponent {
  static propTypes = {
    // openLoginModal: PropTypes.func
  }

  render () {
    const { resultNumber } = this.props
    return (
      <div>
        <span className={styles.ly}>测试测试</span>
        <Link to="/tacos/item01">item1</Link>
        <Link to="/tacos/item02">item2</Link>
        <p>{resultNumber}</p>
        <Route path='/tacos/item01' component={Item01} />
        <Route path='/tacos/item02' component={Item02} />
      </div>
    )
  }
}



export default Test

