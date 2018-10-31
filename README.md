# patchbay-gatherings

See patchbay for current require style. This can be used something like:

```js
const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')

// polyfills
require('setimmediate')

const { patchbay, patchcore } = require('patchbay/main')
const gatherings = require('patchbay-gatherings')

// plugings loaded first will over-ride core modules loaded later
  const sockets = combine(gatherings, patchbay, patchcore)

const api = entry(sockets, nest('app.html.app', 'first'))
document.body.appendChild(api.app.html.app())
```

I've also written the `views/` to be as re-useable as I can.
You might like to copy from them, or require them directly

## License

AGPL-3.0
