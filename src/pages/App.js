import React, { Component } from 'react'
import CustomRoute from 'router'
import '../styles/App.css'
import { Menu } from 'antd'
import { Link,   BrowserRouter as Router } from 'react-router-dom'

class App extends Component {
  state = {
    current: 'mail'
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  }
      // <ul>
      //   <li><Link to="/tacos">Tacos</Link></li>
      //   <li><Link to="/sandwiches">Sandwiches</Link></li>
      // </ul>

  render() {
    return (
      <Router>
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
          <CustomRoute/>
      </div>
      </Router>
    )
  }
}

export default App;