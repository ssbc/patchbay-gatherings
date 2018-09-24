const { h, computed } = require('mutant')
const Marama = require('marama')

module.exports = function DayPicker (state) {
  // needs state: monthIndex, day
  const startOfToday = startOfDay()

  return h('GatheringDayPicker', [
    h('div.month-picker', [
      h('button', { 'ev-click': () => setMonth(-1) }, '<'),
      MonthTitle(state.monthIndex),
      h('button', { 'ev-click': () => setMonth(+1) }, '>')
    ]),
    computed(state, ({ monthIndex, day }) => {
      return Marama({
        monthIndex,
        events: day ? [day] : [],
        onSelect,
        styles: {
          weekFormat: 'rows',
          showNumbers: true,
          tileRadius: 16,
          tileGap: 8
        }
      })
    })
  ])

  function setMonth (d) {
    state.monthIndex.set(state.monthIndex() + d)
  }

  function onSelect ({ gte, lt, events: dayEvents }) {
    if (gte < startOfToday) return

    if (!dayEvents.length) addEmptyEvent()
    else clearDay()

    function addEmptyEvent () {
      state.day.set(Event(gte))
    }
    function clearDay () {
      state.day.set()
    }
  }
}

function MonthTitle (monthIndex) {
  const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

  return computed(monthIndex, mi => {
    const now = new Date()
    const view = new Date(now.getFullYear(), mi, 1)

    return `${MONTHS[view.getMonth()]} ${view.getFullYear()}`

    // while (monthIndex < 0) { monthIndex += 12 }
    // return `${MONTHS[(monthIndex) % 12]} ${year}`
  })
}

function Event (date) {
  return {
    date,
    data: { attending: true }
  }
}

function startOfDay (d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
