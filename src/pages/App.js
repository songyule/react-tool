import React, { Component } from 'react'
import '../styles/App.css'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { getHomeData } from 'api/shop'

class App extends Component {
  state = {
    current: 'mail'
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }

  componentDidMount() {
    getHomeData({
      body: 123
    }).then(res => {
      console.log(res)
    })
  }

  render() {
    return (
        <div className="App">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="mail">
              <Link to="/tacos">Tacos</Link>
            </Menu.Item>
            <Menu.Item key="app">
              <Link to="/sandwiches">Sandwiches</Link>
            </Menu.Item>
            <Menu.Item key="what">
              <Link to="/what/123">what/123</Link>
            </Menu.Item>
          </Menu>
        </div>
    )
  }
}

export default App;