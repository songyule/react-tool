import React, { Component } from 'react'
import { Form, Button } from 'antd'
import Title from 'components/title'
import SameForm from 'pages/topic/components/sameForm'

import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragItem from './components/drag-item';
import TrendItem from './components/trend-item';

const FormItem = Form.Item

const style = {
  display: 'flex',
  'flex-wrap': 'wrap',
}

/**
 *
 * @export
 * @page
 * @module 趋势文章列表页面
 */
@Form.create()
@DragDropContext(HTML5Backend)
export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library',
      }, {
        id: 2,
        text: 'Make it generic enough',
      }, {
        id: 3,
        text: 'Write README',
      }, {
        id: 4,
        text: 'Create some examples',
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      }, {
        id: 6,
        text: '???',
      }, {
        id: 7,
        text: 'PROFIT',
      }],
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', fieldsValue);
    });
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }));
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cards } = this.state

    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 12,
        },
      },
    }

    return (
      <div>
        <Title title="创建趋势文章"></Title>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <div>
              {/* 通用的 formItem 内容 */}
              <SameForm getFieldDecorator={getFieldDecorator}></SameForm>
            </div>
            <FormItem
              {...formItemLayout}
              label='内容'
            >
              <div style={style}>
                {cards.map((card, i) => (
                  <DragItem
                    key={card.id}
                    index={i}
                    id={card.id}
                    text={card.text}
                    moveCard={this.moveCard}
                  >
                    <TrendItem></TrendItem>
                  </DragItem>
                ))}
              </div>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large">保存并创建</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
