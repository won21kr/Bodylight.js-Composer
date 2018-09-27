class Widget {}

export default class AnimateAnimContinuous extends Widget {
  constructor (configuration) {
    super(configuration, 'AnimateAnimContinuous')

    // duration: 100 -> 0 - 99
    this.framecount = this.component.timeline.duration - 1
    this.position = 0

    this.tick = this.tick.bind(this)
    createjs.Ticker.addEventListener('tick', this.tick)
  }

  tick () {
    let value = this.value.value
    const min = this.min.value
    const max = this.max.value
    const maxspeed = this.maxspeed.value
    const minspeed = this.minspeed.value
    const reversed = this.reversed.value

    value = (((value - min) / (max - min)) * (maxspeed - minspeed)) + minspeed
    value = parseFloat(value) // FIXME: add parseFloat to config builders

    if (reversed) {
      this.position = (this.position - value)
      if (this.position < 0) {
        this.position = this.framecount + this.position
      }
    } else {
      this.position = (this.position + value) % this.framecount
    }

    this.component.gotoAndStop(Math.floor(this.position))
  }

  generateSetters () {
    this.setters = {
      value: () => {
        if (this.value.function !== null) {
          this.value.value = this.value.function(this.value.value)
        }
      },
      min: () => {
        if (this.min.function !== null) {
          this.min.value = this.min.function(this.min.value)
        }
      },
      max: () => {
        if (this.max.function !== null) {
          this.max.value = this.max.function(this.max.value)
        }
      },
      minspeed: () => {
        if (this.minspeed.function !== null) {
          this.minspeed.value = this.minspeed.function(this.minspeed.value)
        }
      },
      maxspeed: () => {
        if (this.maxspeed.function !== null) {
          this.maxspeed.value = this.maxspeed.function(this.maxspeed.value)
        }
      },
      reversed: () => {
        if (this.reversed.function !== null) {
          this.reversed.value = this.reversed.function(this.reversed.value)
        }
      }
    }
  }

  locateComponent () {
    if (typeof this.animate === 'function') {
      throw new ReferenceError(
        `Widget (${this.name}) of type (${this.typeIdentifier}) with ` +
        `name="${this.name}" could not be initialised because the relevant ` +
        `Animate is not loaded.`)
    }
    return this.animate.components.anim[this.name]
  }
}
