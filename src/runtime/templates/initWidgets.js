export default function initWidgets () {
  const promises = []

  promises.push(initAnimateAnimsControlled())
  promises.push(initAnimateAnimsContinuous())
  promises.push(initAnimateTexts())
  promises.push(initAnimatePlays())
  promises.push(initLabels())
  promises.push(initRanges())
  promises.push(initButtons())
  promises.push(initToggles())
  promises.push(initCharts())

  return promises
}
