import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'

import { Menu } from 'semantic-ui-react'

class ScreenSelector extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.forceUpdate()
  }

  render () {
    return <Fragment>
      <NavLink to={`${process.env.PATH}/`} exact activeClassName="active" onClick={this.handleClick}>
        <Menu.Item className='link'>Design</Menu.Item>
      </NavLink>
      <NavLink to={`${process.env.PATH}/preview`} activeClassName="active" onClick={this.handleClick}>
        <Menu.Item className='link'>Preview</Menu.Item>
      </NavLink>
    </Fragment>
  }
}

export default ScreenSelector
