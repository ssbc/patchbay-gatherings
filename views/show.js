const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')
const getTimezone = require('../lib/get-timezone')
const getTimezoneOffset = require('../lib/get-timezone-offset')

module.exports = function GatheringShow (opts) {
  const {
    gathering,
    scuttle,
    avatar = i => h('div', i),
    blobUrl = i => i,
    markdown = i => i,
    editBtn
  } = opts

  const state = Value()
  const isPublishing = Value(false)
  refreshState()

  // TODO
  // - attend button
  //    - need my key, or a new iAmAttending in scuttle.get
  //    - publishing disable button
  // - edit button
  // - live update stream / obs?

  return h('GatheringShow', computed(state, state => {
    if (!state) return h('div.loading', 'Loading...')

    const {
      title,
      description,
      location,
      startDateTime,
      image,
      isAttendee,
      attendees
    } = state

    return [
      Banner(image),
      h('section.about', [
        h('h1', title),
        h('div.description', markdown(description))
      ]),
      h('section.spacetime', [
        startDateTime && startDateTime.epoch ? [ h('label', 'time'), Time(new Date(startDateTime.epoch)) ] : null,
        location ? [ h('label', 'location'), h('div.location', location) ] : null
      ]),
      h('section.attendance', [
        // h('label', 'Attendees'),
        h('div.attendees', attendees.map(avatar)),
        AttendBtn(isAttendee, attendees)
      ]),
      editBtn ? editBtn : null
    ]
  }))

  function Banner (image) {
    if (!(image && image.link)) return

    const url = blobUrl(image.link)

    return h('section.image', { style: { 'background-image': `url(${url})` } }, [
      h('img', { src: url, style: { visibility: 'hidden' } })
    ])
  }

  function AttendBtn (isAttendee, attendees) {
    return h('button',
      {
        'disabled': isPublishing,
        'className': isAttendee ? '' : '-primary',
        'ev-click': () => {
          isPublishing.set(true)
          scuttle.attending(gathering.key, !isAttendee, (err, data) => {
            if (err) return console.error(err) // TODO display error

            refreshState()
          })
        }
      },
      isAttendee ? 'Unattend' : 'Attend'
    )
  }
  // helpers

  function refreshState () {
    scuttle.get(gathering.key, (err, data) => {
      if (err) return console.error(err) // TODO display something to user

      state.set(data)
      isPublishing.set(false)
    })
  }
}

function Time (date) {
  const t = spacetime(date)
  return h('div.time', [
    t.format('nice'),
    h('div.zone', { title: 'timezone' }, [
      getTimezone() || '??',
      h('span', ['(UTC ', getTimezoneOffset(), ')'])
    ])
  ])
}
