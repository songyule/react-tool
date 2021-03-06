import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { ContentState, EditorState } from 'draft-js'
import { wrapperUploadQiniu } from 'api/common'
import cs from 'classnames'//引入classnames依赖库

// https://github.com/applesstt/moe/blob/075358400793565b8b881471db0310eeea0284ef/src/components/RichEditor/RichEditor.js

export default class RichEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      contentState: this.props.contentState,
      then: !!props.contentState
    }
  }
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      contentState: nextProps.contentState,
      then: true
    })
  }

  uploadImageCallBack = async (e) => {
    const url = await wrapperUploadQiniu(e)
    return Promise.resolve({data: {link: url}})
  }

  onChange = (contentState) => {
    this.props.onChange(draftToHtml(contentState));
    this.setState(contentState);
  }

  render() {
    const { then } = this.state
    require('../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css')
    const style = require('./editor.css')
    var contentState = ''
    contentState = this.state.contentState && EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(this.state.contentState)))
    return (
      <div>
        {
          (then && contentState) ? ( <Editor
          defaultEditorState={contentState}
          wrapperClassName={cs({
            [style.wrapper]: true,
            [this.props.wrapperClass]: this.props.wrapperClass
          })}
          editorClassName={cs({
            [style.editor]: true,
            [this.props.editClass]: this.props.editClass
          })}
          onContentStateChange={this.onChange}
          uploadCallback={this.uploadImageCallBack}
          />) : null
        }
      </div>
    )
  }
}
