import update from 'immutability-helper'
import {
  CONFIG_BUTTON_UPDATE,
  CONFIG_BUTTON_REMOVE,
  RENAME_BUTTON,
  REMOVE_BUTTON
} from '@actions/types'

import ButtonMode from '@helpers/enum/ButtonMode'

const defaultConfig = {
  name: null,
  mode: ButtonMode.CLICK,
  target: {
    value: null,
    provider: null,
    function: null,
    typeof: 'number'
  },

  attributes: [
    'label',
    'enabled',
    'onClick',
    'onPress',
    'onRelease'
  ],

  label: {
    typeof: 'string',
    value: 'button',
    complex: false,
    provider: null,
    function: null
  },

  enabled: {
    typeof: 'boolean',
    value: true,
    complex: false,
    provider: null,
    function: null
  },

  visible: {
    typeof: 'boolean',
    value: true,
    complex: false,
    provider: null,
    function: null
  },

  onClick: {
    typeof: 'number',
    value: 1,
    complex: false,
    provider: null,
    function: null
  },

  onPress: {
    typeof: 'number',
    value: 1,
    complex: false,
    provider: null,
    function: null
  },

  onRelease: {
    typeof: 'number',
    value: 0,
    complex: false,
    provider: null,
    function: null
  }

}

const remove = (state, name) => {
  return update(state, {
    $unset: [name]
  })
}

const setConfig = (state, name, config) => {
  return update(state, {
    [name]: {$set: config}
  })
}

const checkUndefined = (state, name) => {
  if (state[name] === undefined) {
    state = update(state, { [name]: {$set: defaultConfig} })
    state = update(state, { [name]: {name: {$set: name}} })
  }
  return state
}

const updateKeyValue = (state, name, key, value) => {
  state = checkUndefined(state, name)
  return update(state, {
    [name]: {[key]: {$set: value}}
  })
}

const updateKeyKeyValue = (state, name, key1, key2, value) => {
  state = checkUndefined(state, name)
  return update(state, {
    [name]: {[key1]: {[key2]: {$set: value}}}
  })
}

export default function (state = {}, action) {
  if (action.type === CONFIG_BUTTON_UPDATE) {
    const { button, key, value } = action.payload
    const keys = key.split('.')
    if (keys.length === 1) {
      state = updateKeyValue(state, button.name, keys[0], value)
    } else if (keys.length === 2) {
      state = updateKeyKeyValue(state, button.name, keys[0], keys[1], value)

      // setting complex to false, means we have to clean up provider and function
      if (keys[1] === 'complex' && value === false) {
        state = updateKeyKeyValue(state, button.name, keys[0], 'provider', null)
        state = updateKeyKeyValue(state, button.name, keys[0], 'function', null)
      }
    }
    return state
  }

  if (action.type === RENAME_BUTTON) {
    const name = action.payload.button.name
    const newname = action.payload.newname
    const config = state[name]

    if (state[newname] !== undefined) {
      return state
    }

    state = remove(state, name)
    state = setConfig(state, newname, config)
    state = updateKeyValue(state, newname, 'name', newname)

    return state
  }

  return state
}

export const getConfigForButton = state => state
export const getDefaultConfigForButton = () => defaultConfig