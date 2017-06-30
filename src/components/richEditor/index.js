import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { ContentState, EditorState } from 'draft-js'
import { wrapperUploadQiniu } from 'api/common'

// https://github.com/applesstt/moe/blob/075358400793565b8b881471db0310eeea0284ef/src/components/RichEditor/RichEditor.js

export default class RichEditor extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      contentState: this.props.contentState
    }
  }
  static propTypes = {
    onChange: PropTypes.func.isRequired
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
    require('../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css')
    const style = require('./editor.css')
    const contentState = EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(this.state.contentState)))

    // const toolbar = {
    //   options: ['inline', 'colorPicker', 'textAlign', 'link',
    //     'emoji', 'image', 'embedded', 'history'],
    //   inline: {
    //     options: ['bold', 'italic', 'strikethrough'],
    //   },
    //   textAlign: {
    //     options: ['left', 'center', 'right']
    //   }
    // }
        // toolbar={toolbar}
    return (
      <Editor
        defaultEditorState={contentState}
        wrapperClassName={style.wrapper}
        editorClassName={style.editor}
        onContentStateChange={this.onChange}
        uploadCallback={this.uploadImageCallBack}
        />
    )
  }
}