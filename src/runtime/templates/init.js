/* global initValueProviders */
/* global resolveValueProviders */
/* global initWidgets */
/* global models */
/* global animateFps */
/* global spinner */

function init() {
  createjs.Ticker.framerate = animateFps

  Promise.all([
    Promise.all(initValueProviders()),
    Promise.all(initAnimates())
  ]).then(() => {
    Promise.all([
      initWidgets()
    ]).then(() => {
      resolveValueProviders()
      Object.entries(models).forEach(([id, model]) => model.init())
      Object.entries(widgets).forEach(([id, widget]) => widget.updateComponent())
      spinner.hide()
    })
  })
}

export default init