export default function play () {
  this.perf.start(this.config.id, 'play')
  const values = []
  const time = []

  this.flushSetQueues()

  for (let i = 0; i < this.outputValuesLength; i++) {
    values[i] = []
  }

  while (this.currentStep <= this.config.stopTime) {
    // fill batched outputs
    for (let i = 0; i < this.outputValuesLength; i++) {
      values[i].push(this.outputValues[i])
    }

    time.push(this.currentStep)

    // step
    this.fmi2DoStep(this.inst, this.currentStep, this.config.stepSize, 1)
    this.currentStep = parseFloat(parseFloat(this.currentStep + this.config.stepSize).toPrecision(8))
    this.updateOutputValues()
  }

  this.batch = { values, time }
  this.updateValueListeners()
  this.perf.stop(this.config.id, 'play')
}
