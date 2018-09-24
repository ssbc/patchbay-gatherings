const { h, computed, Value, when, resolve } = require('mutant')
const printTime = require('../../lib/print-time')

module.exports = function TimePicker ({ time }) {
  var active = Value(false)

  return h('GatheringTimePicker', [
    computed(time, t => TimeEntry(t, active)),
    NewTimeEntry(time, active)
  ])
}

function NewTimeEntry (time, active) {
  const options = Array(96).fill(0).map((_, i) => {
    var t = new Date()
    t.setHours(0)
    t.setMinutes(15 * i)
    return t
  })

  const el = h('div.add-more', [
    when(active,
      h('div.dropdown', options.map((t, i) => {
        return h('div',
          {
            'ev-click': () => select(t),
            className: t.getMinutes() === 0 ? 'hour' : '',
            attributes: { 'data-time': dataId(t) }
          },
          printTime(t)
        )
      }))
    )
  ])

  active(onActivate)

  return el

  function onActivate (active) {
    if (!active) return

    const target = el.querySelector(`[data-time='${dataId(resolve(time))}']`)
    target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop + 4
  }

  function select (_time) {
    time.set(_time)
    active.set(false)
  }
}

function TimeEntry (t, active) {
  return h('div.time-entry',
    { 'ev-click': () => active.set(!active()) },
    [ h('div.time', printTime(t)) ]
  )
}

function dataId (t) {
  return printTime(t)
}
