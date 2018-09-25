const nest = require('depnest')
const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')
const Scuttle = require('scuttle-gathering')
const { isGathering } = require('ssb-gathering-schema')

exports.gives = nest('message.html.layout')

exports.needs = nest({
  'about.html.image': 'first',
  'about.obs.color': 'first',
  'app.sync.goTo': 'first',
  // 'message.html.author': 'first',
  // 'message.html.meta': 'map',
  'message.html.action': 'map',
  'message.html.backlinks': 'first',
  'message.html.markdown': 'first',
  'message.html.timestamp': 'first',
  'blob.sync.url': 'first',
  // 'gathering.obs.gathering': 'first', // TODO rework
  // 'gathering.html': {
  //   'location': 'first',
  //   'startDateTime': 'first'
  // }
  'sbot.obs.connection': 'first'
})


//// >>>>>> UP NEXT - plug this in and see it works! <<<<<<


exports.create = (api) => {
  return nest('message.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts = { layout: 'card' }) {
    if (!(opts.layout === undefined || opts.layout === 'card')) return
    if (!isGathering(msg)) return

    const state = Value()
    Scuttle(api.sbot.obs.connection).get(msg.key, (err, data) => {
      if (err) throw (err)

      state.set(data)
    })

    const { timestamp, backlinks, action } = api.message.html

    return h('Message -gathering-card', {
      'ev-click': () => api.app.sync.goTo(msg.key),
      attributes: { tabindex: '0' } // needed to be able to navigate and show focus()
    }, [
      h('section.avatar', api.about.html.image(msg.value.author)),
      h('section.top', [
        // h('div.author', author(msg)),
        // h('div.title'),
        // h('div.meta', meta(msg))
      ]),
      h('section.content', computed(state, state => {
        if (!state) return 'Loading...' // TODO - make nicer

        const { title, description, startDateTime, image } = state
        const background = image && image.link ? `url(${api.blob.sync.url(image.link)})` : ''
        var date
        if (startDateTime && startDateTime.epoch) {
          const t = spacetime(startDateTime.epoch)
          date = `${t.format('date')} ${t.format('month-short')}`
        }

        return [
          h('div.details', [
            h('h2', title),
            h('div.description', api.message.html.markdown(description))
          ]),
          h('div.date-splash',
            {
              style: {
                'background-image': background,
                'background-color': api.about.obs.color(msg.key)
              }
            },
            [
              h('div', date)
            ]
          )
        ]
      })),
      h('section.raw-content'), //, rawMessage),
      h('section.bottom', [
        h('div.timestamp', timestamp(msg)),
        h('div.actions', action(msg))
      ]),
      h('footer.backlinks', backlinks(msg))
    ])
  }
}
