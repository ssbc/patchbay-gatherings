// run:
// $ npx electro views/new.test.js

const h = require('mutant/h')

const View = require('./show')
require('../lib/styles-inject')()

const view = View({
  gathering: '%fake key',
  scuttle: {
    get: (key, cb) => cb(null, {
      title: 'Ziva\'s Birthday',
      description: 'come celebrate this wonderful little human!',
      location: 'our place in mirimar',
      startDateTime: {
        epoch: Date.now() + 3 * 24 * 60 * 60 * 1e3
      },
      attendees: [
        '@mix', '@alanna', '@mikey'
      ],
      thread: [ // a fake thread
        { author: 'mix', attendee: true },
        { author: 'mix', update: 'our place is in mirimar' },
        { author: 'mix', text: 'just bring yourselves!' },
        { author: 'mikey', attendee: true },
        { author: 'susan', attendee: true },
        { author: 'susan', attendee: false }
      ]
    })
  },
  // avatar: i => i,
  render: msg => h('div', JSON.stringify(msg).replace(/"/g, ' '))
})

document.body.appendChild(view)
document.head.appendChild(
  h('style', `
    body {
      --gradient: linear-gradient(45deg, hsla(0, 100%, 56%, .5), hsla(220, 100%, 46%, 0.3));
      --texture: left top 0 / 3px radial-gradient(white, #de82e6) repeat ;
      background: var(--texture), var(--gradient);
      background-blend-mode: darken;

      height: 100vh;
      padding: 2rem;
    }
  `)
)
