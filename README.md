# patchbay-gatherings

A plugin for [patchbay](github.com/ssbc/patchbay) which adds gatherings functionality - the ability to create and attend events.

It also has `/views` which are idependant of the patchcore and patchbay, which can be used in other clients (either as references, or directly required).
The API for each of the top level views (`new`, `show`, `edit`, `card`) has been documented in the code itself.

## Usage in patchbay

```js
const { patchbay, patchcore } = require('patchbay/main')
const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')

// polyfills
require('setimmediate')


const sockets = combine(
  require('patchbay-gatherings')
  patchbay,                         // the minimal patchbay components
  patchcore                         // functions patchbay is built on
)
// order matters - modules loaded first can over-ride those loaded later

const api = entry(sockets, nest('app.html.app', 'first'))
document.body.appendChild(api.app.html.app())
```


## License

AGPL-3.0
