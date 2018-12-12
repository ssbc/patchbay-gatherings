const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')
const imageString = require('../lib/image-string')

module.exports = function gatheringCard (opts) {
  const {
    gathering,
    scuttle,
    blobUrl = () => '',
    markdown = i => i,
    color = () => `hsl(${Math.random() * 360}, 100%, 70%)`
  } = opts

  const state = Value()
  scuttle.get(gathering.key, (err, data) => {
    if (err) throw (err)

    state.set(data)
  })

  return h('GatheringCard', computed(state, state => {
    if (!state) return 'Loading...' // TODO - make nicer

    const { title, description, startDateTime, image } = state
    const background = image && image.link ? `url('${blobUrl(imageString(image))}')` : ''

    var date, t
    if (startDateTime && startDateTime.epoch) {
      t = spacetime(startDateTime.epoch)
      date = `${t.format('date')} ${t.format('month-short')}`
    }

    const relativeTimeToEvent = Value(showRelativeTime(t))

    return [
      h('div.details', [
        h('h2', title), h('div.description', markdown(description)) ]),
      h('div.date-splash',
        {
          style: {
            'background-image': background,
            'background-color': color(gathering.key)
          },
          'title': relativeTimeToEvent,
          'ev-mouseenter': () => relativeTimeToEvent.set(showRelativeTime(t))
        },
        [
          h('div', date)
        ]
      )
    ]
  }))
}

function showRelativeTime(t) {
    if (t) {
      return spacetime.now().since(t).rounded
    }
    return ''
}
