> Plugs [patch-gatherings]() into [patchbay]() 

`gives` Patchbay style views of patch-gatherings 

## Needs
```js
exports.needs = nest({
  'app.html.tabs': 'first' //provides a default if not given
})
```

## Gives
```js
exports.gives = nest({
  'gatherings.html': ['layout']
})
```


## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install patchbay-gatherings
```

## Prior art

## Acknowledgments


## See Also


## License

ISC
