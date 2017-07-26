import React, { Component } from 'react'
import HomeBox from './box'

class LatestTrend extends Component {
  render () {
    return (
      <HomeBox className="home-box--latest" title="最新趋势" subhead="Latest trends">
        <div className="home-box__content-left">
          <div className="home-box__content-box">
            <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_latest_trends', 0)}>
            { this.props.list[0].image_url ? <img src={this.props.list[0].image_url} alt=""/> : '+'}
            </div>
            <div className="home-box__introduce-wrapper">
              <div className="home-box__introduce">
                <div className="home-box__introduce-bar-wrapper">
                  <div className="home-box__introduce-bar"></div>
                </div>
                <h3 className="home-box__introduce-title">{this.props.list[0].title}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="home-box__content-right">
          <div className="home-box__content-box">
            <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_latest_trends', 1)}>
            { this.props.list[1].image_url ? <img src={this.props.list[1].image_url} alt=""/> : '+'}
            </div>
            <div className="home-box__introduce-wrapper">
              <div className="home-box__introduce">
                <div className="home-box__introduce-bar-wrapper">
                  <div className="home-box__introduce-bar"></div>
                </div>
                <h3 className="home-box__introduce-title">{this.props.list[1].title}</h3>
              </div>
            </div>
          </div>
          <div className="home-box__content-box">
            <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_latest_trends', 2)}>
              { this.props.list[2].image_url ? <img src={this.props.list[2].image_url} alt=""/> : '+'}
            </div>
            <div className="home-box__introduce-wrapper">
              <div className="home-box__introduce">
                <div className="home-box__introduce-bar-wrapper">
                  <div className="home-box__introduce-bar"></div>
                </div>
                <h3 className="home-box__introduce-title">{this.props.list[2].title}</h3>
              </div>
            </div>
          </div>
        </div>
      </HomeBox>
    )
  }
}

export default LatestTrend
