/**
 * @module 测试页面2
 */
// import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import Item01 from 'components/item1'
import Item02 from 'components/item2'
import * as shopActions from 'actions/shop';

import styles from './what.css'

/**
 * Class 测试页面2
 * @extends Component
 */
@connect(
  state => ({ resultNumber: state.resultNumber }),
  dispatch => bindActionCreators(shopActions, dispatch)
)
export default class extends PureComponent {
  static propTypes = {
    // openLoginModal: PropTypes.func
  }

  componentWillMount() {
    this.props.getHomeData()
  }

  render () {
    const { resultNumber } = this.props
    return (
      <div>
        <span className={styles.ly}>测试测试</span>
        <Link to="/main/tacos/item01">item1</Link>
        <Link to="/main/tacos/item02">item2</Link>
        <p>{resultNumber}</p>
        <Route path='/main/tacos/:id' component={Item01} />
        <Route path='/main/tacos/item02' component={Item02} />
      </div>
    )
  }
}
