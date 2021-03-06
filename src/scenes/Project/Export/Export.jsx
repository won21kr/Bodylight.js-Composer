import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Grid, Input, Button, Checkbox } from 'semantic-ui-react'
import { getExportOptions } from '@reducers'
import { updateExportOption } from '@actions'
import { toast } from 'react-toastify'
import { saveAs } from 'file-saver'
import Builder from '@runtime'

import BusySignal from '@components/BusySignal'

class Export extends Component {
  constructor(props) {
    super(props)

    let pending = false
    if (props.match.params.option === 'quick') {
      this.quickExport()
      pending = true
      this.props.history.goBack()
    }

    this.state = {
      pending
    }

    this.handleExport = this.handleExport.bind(this)
    this.minifiedExport = this.minifiedExport.bind(this)
    this.handleUpdateExportOption = this.handleUpdateExportOption.bind(this)
  }

  minifiedExport() {
    const builder = new Builder(true, this.props.export.performance)
    try {
      const html = new Blob([builder.build()], { type: 'text/html;charset=utf-8' })
      const filename = `${this.props.export.name}.html`
      saveAs(html, filename)
      toast.success(`Project exported as ${filename}`)
      this.setState({ pending: false })
    } catch (err) {
      toast.error(`Could not optimize project: ${err}, trying quick export`)
      this.quickExport()
      this.setState({ pending: false })
    }
  }

  handleExport() {
    this.setState({ pending: true })
    window.setTimeout(this.minifiedExport, 100)
  }

  handleUpdateExportOption(e, { name, value, checked }) {
    value = value || checked
    this.props.updateExportOption(name, value)
  }

  quickExport() {
    const builder = new Builder(false, true)
    const html = new Blob([builder.build()], { type: 'text/html;charset=utf-8' })
    const filename = `${this.props.export.name}.html`
    saveAs(html, filename)
    toast.success(`Project exported as ${filename} without optimizations. Do not use in production.`)
  }

  render() {
    return <Fragment>
      <div id='topBar' className='header'> </div>

      <BusySignal
        busy={this.state.pending}
        description="Exporting minified code, this will take a while..."
      />

      <Grid padded centered className='leftShadow topPadded'>
        <Grid.Row centered style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid.Column style={{ marginTop: '2em', width: '100%' }}>
            <Checkbox
              label='Export performance block in the final application'
              name='performance'
              checked={this.props.export.performance}
              onClick={this.handleUpdateExportOption}
            />
          </Grid.Column>
          <Grid.Column style={{ marginTop: '2em', width: '100%' }}>
            <Input
              name='name'
              value={this.props.export.name}
              onChange={this.handleUpdateExportOption}
            />
            <Button onClick={this.handleExport}>Export</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  }
}

export default connect(
  state => ({
    export: getExportOptions(state)
  }),
  dispatch => bindActionCreators({
    updateExportOption
  }, dispatch)
)(Export)