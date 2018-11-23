class Widget {}

export default class Gamblegram extends Widget {
  constructor(configuration) {
    super(configuration, 'chart')
  }

  updateComponent() {
    super.updateComponent()
    this.initData()
    this.initPlotly()
  }

  sort(obj) {
    return Object.values(obj).sort((a, b) => a.position - b.position)
  }

  setValueProvider(attribute, id, target) {
    const attr = this.parseAttribute(attribute)

    if (attr == null) {
      return super.setValueProvider(attribute, id, target)
    }
    target.registerValueListener(this, id, attribute)
  }

  generateSetters() {
    this.setters = {
      enabled: () => {
        if (this.enabled.function !== null) {
          this.enabled.value = this.enabled.function(this.enabled.value)
        }
      },
    }
  }

  setValue(attribute, value, time) {
    // when we have an JSON encoded attribute specifier
    if (attribute.startsWith('{')) {
      const { id } = JSON.parse(attribute)
      const { c, i } = this.items[id]

      // apply function (if any)
      if (this.columns[c].items[i].value.function !== null) {
        value = this.columns[c].items[i].value.function(value)
      }
      this.setItem(id, value)
      return
    }

    super.setValue(attribute, value, time)
  }

  setItem(id, value) {
    const { c, trace } = this.items[id]
    const y = Array(this.columns.length)
    y[c] = value

    Plotly.restyle(this.plotly, { y: [y] }, [trace])
  }

  initData() {
    // sort columns in order
    this.columns = this.sort(this.columns)

    // x axis - names of the bars common for all traces
    this.x = Array(this.columns.length)
    // all items by id
    this.items = {}

    let trace = 0
    for (let c = 0; c < this.columns.length; c++) {
      // sort items in column in order
      this.columns[c].items = this.sort(this.columns[c].items)
      // create X axis values
      this.x[c] = this.columns[c].name

      // fill this.items and register providers
      const column = this.columns[c]
      for (let i = 0; i < column.items.length; i++) {
        const item = column.items[i]
        const id = item.id
        this.items[id] = { id, trace, item, c, i }
        this.addValueProvider(JSON.stringify({ id }), item.value.provider)
        trace++
      }
    }
  }

  initPlotly() {
    if (this.plotly != null) {
      return
    }

    const d3 = Plotly.d3
    const div = d3.select(this.component).append('div').style({ width: '100%', height: '100%' })
    this.plotly = div.node()

    const traces = []

    Object.values(this.items).forEach(item => {
      const x = this.x
      const y = Array(this.columns.length)
      traces.push({ x, y, name: item.name, type: 'bar' })
    })

    const layout = {
      //xaxis: this.xaxis,
      //yaxis: this.yaxis,
      barmode: 'relative',
      margin: { l: 50, r: 20, b: 20, t: 20, pad: 4 },
    }
    const config = {
      displayModeBar: false
    }

    Plotly.newPlot(this.plotly, traces, layout, config)
    this.initialized = true
  }


  parseAttribute(attribute) {
    if (attribute.startsWith('{')) {
      return JSON.parse(attribute)
    }
    return null
  }
}