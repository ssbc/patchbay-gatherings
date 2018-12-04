const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')
const pull = require('pull-stream')
const getTimezone = require('../lib/get-timezone')
const getTimezoneOffset = require('../lib/get-timezone-offset')
const imageString = require('../lib/image-string')

module.exports = function GatheringShow (opts) {
  const {
    gathering,
    scuttle,
    avatar = i => h('div', i),
    blobUrl = i => i,
    markdown = i => i,
    editBtn,
    updateStream,
    myKey
  } = opts

  const state = Value()
  const isPublishing = Value(false)
  refreshState()

  if (updateStream) pull(updateStream, pull.drain(refreshState))

  return h('GatheringShow', computed(state, state => {
    if (!state) return h('div.loading', 'Loading...')

    const {
      title,
      description,
      location,
      startDateTime,
      image,
      isAttendee,
      attendees,
      notAttendees
    } = state

    return [
      Banner(image),
      h('section.about', [
        h('h1', title),
        h('div.description', markdown(description)),
        editBtn ? h('div.edit', editBtn) : null
      ]),
      h('section.spacetime', [
        startDateTime && startDateTime.epoch ? [ h('label', 'time'), Time(new Date(startDateTime.epoch)) ] : null,
        location ? [ h('label', 'location'), h('div.location', markdown(location)) ] : null
      ]),
      h('section.attendance', [
        h('div.attendanceButtons', [
          AttendBtn(isAttendee, attendees),
          CantAttendBtn(myKey, notAttendees)
        ]),
        h('label', `Attending (${attendees.length})`),
        h('div.attendees', attendees.map(avatar)),
        h('label', `Not Attending (${notAttendees.length})`),
        h('div.notAttendees', notAttendees.map(avatar))
      ])
    ]
  }))

  function Banner (image) {
    if (!(image && image.link)) return

    const url = blobUrl(imageString(image))

    return h('section.image', { style: { 'background-image': `url('${url}')` } }, [
      h('img', { src: url, style: { visibility: 'hidden' } })
    ])
  }

  function AttendBtn (isAttendee, attendees) {
    return h('button',
      {
        'disabled': computed([isPublishing], isPublishing => isPublishing || isAttendee),
        'className': isAttendee ? '' : '-primary',
        'ev-click': () => {
          isPublishing.set(true)
          scuttle.attending(gathering.key, true, (err, data) => {
            if (err) return console.error(err) // TODO display error

            refreshState()
          })
        }
      },
      'Attend'
    )
  }

  function CantAttendBtn (myKey, notAttendees) {
    const isNotAttendee = notAttendees.includes(myKey)
    return h('button',
      {
        'disabled': computed([isPublishing], isPublishing => isPublishing || isNotAttendee),
        'ev-click': () => {
          isPublishing.set(true)
          scuttle.attending(gathering.key, false, (err, data) => {
            if (err) return console.error(err) // TODO display error

            refreshState()
          })
        }
      },
      'Can\'t Attend'
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
    t.format('nice-day'),
    h('div.zone', { title: 'timezone' }, [
      getTimezone() || '??',
      h('span', ['(UTC ', getTimezoneOffset(), ')'])
    ])
  ])
}
