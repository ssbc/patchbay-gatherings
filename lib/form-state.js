const { Struct } = require('mutant')
const pick = require('lodash.pick')

module.exports = {
  emptyState,
  buildState,
  initialiseState
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

function buildState (givenState) {
  if (!givenState) return emptyState()

  const state = Object.assign(
    emptyState(),
    permittedOpts(givenState),
    buildTimes(givenState)
  )

  return state
}

function initialiseState (givenState) {
  return Struct(buildState(givenState))
}

function permittedOpts (opts) {
  const permitted = 'title description location progenitor mentions'.split(' ')

  return pick(opts, permitted)
}

function buildTimes (opts) {
  if (opts.startDateTime && opts.startDateTime.epoch) {
    const date = new Date(opts.startDateTime.epoch)

    return {
      monthIndex: date.getMonth(),
      day: date,
      time: date
    }
  } else {
    return {}
  }
}
