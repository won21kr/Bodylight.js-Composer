export default function createModelRuntime(Model, config, functions) {
  return new Promise((resolve, reject) => {
    Model()().ready.then(model => {
      // save configuration information about this instance
      model.config = config

      model.modelIsSetup = false

      // cwrap functions for their use in this module
      model.cwrapFunctions = functions.cwrapFunctions.bind(model)
      model.cwrapFunctions()

      // bind a consoleLogger instance function
      model.consoleLogger = functions.consoleLogger.bind(model)
      model.consoleLoggerPtr = model.addFunction(model.consoleLogger, 'viiiiii')

      model.init = functions.init.bind(model)
      model.instantiate = functions.instantiate.bind(model)
      model.setup = functions.setup.bind(model)
      model.reset = functions.reset.bind(model)

      model.gettersAndSetters = functions.gettersAndSetters.bind(model)
      model.gettersAndSetters()

      model.outputValues = new functions.OutputValues(model)

      model.valueListeners = []
      model.initialValueListeners = []
      model.initialValues = {}
      model.valueSetters = []
      model.lastInputValues = {}

      model.registerValueListener = functions.registerValueListener.bind(model)
      model.registerArrayListener = functions.registerArrayListener.bind(model)
      model.registerInitialValueListener = functions.registerInitialValueListener.bind(model)

      model.registerValueSetter = functions.registerValueSetter.bind(model)
      model.updateInitialValueListeners = functions.updateInitialValueListeners.bind(model)
      model.setInitialValues = functions.setInitialValues.bind(model)
      model.setInitialValueByName = functions.setInitialValueByName.bind(model)
      model.updateValueByName = functions.updateValueByName.bind(model)
      model.getValueByName = functions.getValueByName.bind(model)

      model.getReferenceFromName = functions.getReferenceFromName.bind(model)
      model.setSpeed = functions.setSpeed.bind(model)

      model.perf = perf
      model.config.type = WidgetType.MODEL

      if (model.config.mode === 'continuous') {
        model.play = functions.continuous.play.bind(model)
        model.pause = functions.continuous.pause.bind(model)
        model.setValue = functions.continuous.setValue.bind(model)
        model.modelTick = functions.continuous.modelTick.bind(model)
        model.stageTick = functions.continuous.stageTick.bind(model)
        model.updateValueListeners = functions.continuous.updateValueListeners.bind(model)
      }

      if (model.config.mode === 'oneshot') {
        model.play = functions.oneshot.play.bind(model)
        model.pause = functions.oneshot.pause.bind(model)
        model.setValue = functions.oneshot.setValue.bind(model)
        model.updateValueListeners = functions.oneshot.updateValueListeners.bind(model)
      }

      console.log(`Model ${model.config.name} ready.`)
      resolve(model)
    }).catch(err => {
      reject(err)
    })
  })
}
