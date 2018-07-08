import React, { Component } from 'react'
import { Grid, Form } from 'semantic-ui-react'

import Mode from './options/Mode'
import ContinuousMode from './options/ContinuousMode'

import Docs from './Docs'

class ModelOptions extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'options': props.options,
      'optionKeyHovered': null
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.handleOptionsChange = this.handleOptionsChange.bind(this)
  }

  onMouseEnter (optionKeyHovered) {
    this.setState({ optionKeyHovered: optionKeyHovered })
  }

  handleOptionsChange (options) {
    this.setState({ options })
  }

  render () {
    if (!this.props.visible) {
      return null
    }

    return (
      <Form>
        <Grid columns={2} stretched>
          <Grid.Row>

            <Grid.Column>
              <Mode
                options={this.props.options}
                onChange={this.handleOptionsChange}
                onMouseEnter={this.onMouseEnter}
              />

              <ContinuousMode
                options={this.props.options}
                onChange={this.handleOptionsChange}
                onMouseEnter={this.onMouseEnter}
              />
            </Grid.Column>

            <Grid.Column>
              <Docs index={this.state.optionKeyHovered} />
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}

export default ModelOptions