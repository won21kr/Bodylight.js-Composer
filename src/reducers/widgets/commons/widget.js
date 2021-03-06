import update from 'immutability-helper'

export const addWidget = (state, payload, type) => {
  if (type !== payload.type) { return state }

  const widget = {
    id: payload.id,
    name: 'unnamed',
    type: payload.type
  }

  return update(state, { [payload.id]: {$set: widget} })
}

export const removeWidget = (state, payload, type) => {
  if (type !== payload.type) { return state }
  return update(state, { $unset: [payload.id] })
}

export const renameWidget = (state, payload, type) => {
  if (type !== payload.widget.type) { return state }

  return update(state, {
    [payload.widget.id]: {
      name: {$set: payload.name}
    }
  })
}

export const getWidget = (state, id) => {
  if (state[id] === undefined) {
    return null
  }
  return state[id]
}

export const getWidgetsForDropdown = (state) => {
  const options = []
  Object.entries(state).forEach(([id, widget]) => {
    options.push({
      key: id,
      text: widget.name,
      value: id
    })
  })
  return options
}
