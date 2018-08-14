export default function init () {
  const fmi2CoSimulation = 1

  // transform getIds to Int32Array
  this.outputValuesIds = this.heapArray(new Int32Array(this.outputValuesIds))
  // create outputValues array for getting values from FMU
  this.outputValuesBuffer = this.heapArray(new Float64Array(this.outputValuesLength))
  this.outputValues = Array(this.outputValuesLength).fill(0)

  let fmi2CallbackFunctionsPtr = this.createFmi2CallbackFunctions(this.consoleLoggerPtr)
  this.inst = this.fmi2Instantiate(
    this.config.name,
    fmi2CoSimulation,
    this.config.guid,
    '',
    fmi2CallbackFunctionsPtr,
    0,
    0 // debug
  )

  this.startTime = 0.0
  this.currentStep = this.startTime
  // TODO: configure precision
  this.fmi2SetupExperiment(this.inst, 1, 0.000001, this.startTime, 0)

  this.fmi2EnterInitializationMode(this.inst)

  this.updateInitialValueListeners()

  this.fmi2ExitInitializationMode(this.inst)

  this.modelTickInterval = window.setInterval(
    this.modelTick,
    this.config.interval
  )

  createjs.Ticker.addEventListener('tick', this.stageTick)
}
