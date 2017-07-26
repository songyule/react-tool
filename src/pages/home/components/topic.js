import React, { Component } from 'react'

class HomeTopic extends Component {
  render () {
    const classList = ['topic__list-item--first', 'topic__list-item--second', 'topic__list-item--third', 'topic__list-item--fourth']

    return (
      <div className="topic">
        <div className="wrapper">
          <ul className="topic__list">
            { this.props.list.map((item, index) => (
              <li className={`topic__list-item ${classList[index]}`} key={index}>
                <div className="topic__list-item-border-wrapper">
                  <div className="topic__list-item-border"></div>
                  <div className="topic__list-item-border-title">进 入 专 题</div>
                </div>
                { index === 0 && <div className="topic__list-item-square--first"></div> }
                { index === 2 && <div className="topic__list-item-square--third"></div> }
                <div className="home-box__image-edit" onClick={() => this.props.editImage('pc_index_top_topic', index)}>
                { item.image_url ? <img src={item.image_url} alt=""/> : '+'}
                </div>
              </li>
            )) }
          </ul>
        </div>
      </div>
    )
  }
}

export default HomeTopic
