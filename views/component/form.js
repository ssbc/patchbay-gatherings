const { h, when, computed, resolve } = require('mutant')
const { parseLink } = require('ssb-ref')
const DayPicker = require('./day-picker')
const TimePicker = require('./time-picker')
const Recipients = require('./recipients')
const getTimezone = require('../../lib/get-timezone')
const getTimezoneOffset = require('../../lib/get-timezone-offset')
const imageString = require('../../lib/image-string')

module.exports = function GatheringForm (opts) {
  const {
    state,
    myKey,
    onCancel,
    publish,
    scuttleBlob,
    blobUrl = () => {},
    suggest,
    avatar,
    isEditing = false // only used to bar recps editing
  } = opts

  const isValid = computed(state, ({ title, day, time }) => {
    return title && day && time
  })

  const isPrivate = computed(state.recps, recps => recps.length > 0)

  return h('GatheringForm', { className: when(isPrivate, '-private') }, [
    h('div.details', [
      h('label.title', 'Title'),
      h('input.title', {
        'ev-input': ev => state.title.set(ev.target.value),
        value: state.title
      }),
      h('label.time', 'Time'),
      h('div.time-input', [
        DayPicker(state),
        h('div.time-picker', [
          TimePicker(state),
          h('div.timezone', [
            h('label', 'Timezone you\'re seeing times in is'),
            h('div.zone', [
              getTimezone() || '??',
              h('span', ['(UTC ', getTimezoneOffset(), ')'])
            ])
          ])
        ])
      ]),
      h('label.location', 'Location'),
      h('input.location', {
        'ev-input': ev => state.location.set(ev.target.value),
        value: state.location,
        placeholder: '(optional)'
      }),
      h('label.description', 'Description'),
      h('textarea', {
        'ev-input': ev => state.description.set(ev.target.value),
        value: state.description,
        placeholder: '(optional)'
      }),
      isEditing
        ? null
        : [
          h('label', 'Recipients'),
          Recipients({ state, myKey, suggest, avatar })
        ],
      h('label', 'Image'),
      h('div.image-input', [
        imageInput(),
        computed(state.image, image => {
          if (!image) return
          return h('img', { src: blobUrl(imageString(image)) })
        })
      ])
    ]),
    h('div.actions', [
      h('button -subtle', { 'ev-click': onCancel }, 'Cancel'),
      h('button', {
        className: when(isValid, '-primary'),
        disabled: when(isValid, false, true),
        'ev-click': publish
      }, 'Publish')
    ])
  ])

  function imageInput () {
    // NOTE - clear state.image if person makes gathering private **after** attaching public-flavoured blob

    return h('input', {
      type: 'file',
      accept: 'image/*',
      'ev-change': handleFiles
    })

    function handleFiles (ev) {
      const files = ev.target.files
      const isPrivate = resolve(state.recps).length > 0

      scuttleBlob.async.files(files, { stripExif: true, isPrivate }, (err, result) => {
        ev.target.value = ''
        if (err) {
          console.error(err)
          return
        }

        const image = Object.assign(result, parseLink(result.link))
        // if isPrivate, this ensures link is split out into blob & query

        state.image.set(image)
      })
    }
  }
}
