const { Struct } = require('mutant')

module.exports = {
  initialiseState,
  buildState,
  emptyState
}

function initialiseState (givenState) {
  return Struct(buildState(givenState))
}

function buildState (givenState) {
  const state = emptyState()
  if (!givenState) return state

  const { title, description, location, startDateTime, progenitor } = givenState

  if (title) state.title = title
  if (description) state.description = description
  if (location) state.location = location
  if (startDateTime && startDateTime.epoch) {
    const date = new Date(startDateTime.epoch)

    state.monthIndex = date.getMonth()
    state.day = date
    state.time = date
  }
  if (progenitor) state.progenitor = progenitor

  return state
}

function emptyState () {
  const now = new Date()
  return {
    title: '',
    description: '',
    location: '',
    monthIndex: now.getMonth(),
    day: false,
    time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14),
    image: null,
    progenitor: null
  }
}
