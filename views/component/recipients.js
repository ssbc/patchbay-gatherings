const { h, map } = require('mutant')
const addSuggest = require('suggest-box')

function Recipients (opts) {
  const {
    state,
    myKey,
    suggest = {},
    avatar = (id, size) => id,
    i18n = (key) => {
      const translations = { 'gathering.action.addMoreRecps': '(optional) private recipients' }
      return translations[key]
    }
  } = opts

  return h('GatheringRecipients', [
    map(state.recps, recp => Recipient({ recp, avatar })),
    RecipientInput({ state, myKey, suggest, i18n })
  ])
}

module.exports = Recipients

const MIN_RECPS = 0

function Recipient ({ recp, avatar }) {
  if (typeof recp === 'string') { // assume it's myId
    return h('div.recp', [ avatar(recp, 2.5) ])
  }

  return h('div.recp', [
    avatar(recp.link, 2.5),
    h('div.name', recp.name)
  ])
}

function RecipientInput ({ state, myKey, suggest, i18n }) {
  const { recps } = state

  const input = h('input.hidden', {
    placeholder: i18n('gathering.action.addMoreRecps')
  })

  suggestify()

  input.addEventListener('keydown', (e) => {
    if (e.target.value.length > 0) return
    // don't pop the previous entry if still entering a name!

    if (e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8) {
      if (recps.getLength() < MIN_RECPS) return

      recps.pop()
    }
  })

  return input

  function suggestify () {
    if (!input.parentElement) return setTimeout(suggestify, 100)

    const { about = i => i } = suggest

    addSuggest(input, (inputText, cb) => {
      if (recps.getLength() >= 6) return
      // NOTE the max is 7 but in this recipients we are auto-adding ourselves

      const searchTerm = inputText.replace(/^@/, '')
      about(searchTerm, cb)
    }, { cls: 'PatchSuggest' }) // TODO note this depends on patch-suggest being present D:

    input.addEventListener('suggestselect', (e) => {
      const { id, title: name } = e.detail

      if (
        (myKey && id !== myKey) && // I'm not adding myself (I'm added later)
        !recps.find(r => r === id || r.link === id) // Isn't already included
      ) recps.push({ link: id, name })
      // NOTE recps need to be stripped down to just ids when

      e.target.value = ''
      e.target.placeholder = ''
    })
  }
}
