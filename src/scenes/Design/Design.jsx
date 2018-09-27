import React, { Component } from 'react'

import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'

import gjsPresetWebsite from 'grapesjs-preset-webpage'
import gjsBlocksBasic from 'grapesjs-blocks-basic'
import gjsBlocksFlexbox from 'grapesjs-blocks-flexbox'
import gjsReduxStorage from './storage/redux'

import animateBlock from './blocks/Animate'
import buttonBlock from './blocks/Button'
import rangeBlock from './blocks/Range'
import toggleBlock from './blocks/Toggle'
import chartBlock from './blocks/Chart'
import labelBlock from './blocks/Label'

import configureStore from '@src/configureStore'
import { editorStorageClear } from '@actions/actions'

class Design extends Component {
  constructor (props) {
    super(props)

    this.editor = React.createRef()
  }

  componentDidMount () {
    const editor = grapesjs.init({
      container: this.editor.current,

      components: '',
      fromElement: false,

      height: '100vh',
      width: 'auto',

      autorender: 0,

      storageManager: {
        id: '',
        type: 'redux',
        stepsBeforeSave: 1
      },

      plugins: [
        'gjs-redux-storage',
        'gjs-blocks-basic',
        'gjs-blocks-flexbox'
      ]
    })

    const cmdCanvasClear = 'canvas-clear'
    editor.Commands.add(cmdCanvasClear,
      e => confirm('This will clear the entire design, continue?') &&
      e.runCommand('core:canvas-clear'))
    editor.Panels.addButton('options', {
      id: cmdCanvasClear,
      className: 'fa fa-trash',
      command: e => {
        e.runCommand(cmdCanvasClear)
        const {store} = configureStore()
        store.dispatch(editorStorageClear())
      }
    })

    animateBlock(editor)
    rangeBlock(editor)
    buttonBlock(editor)
    toggleBlock(editor)
    chartBlock(editor)
    labelBlock(editor)

    editor.render()
    editor.Panels.getButton('views', 'open-blocks').set('active', true)
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div ref={this.editor} />
    )
  }
}

export default Design
