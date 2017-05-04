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

## Code of conduct
Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.  

## Prior art

## Acknowledgments


## See Also


## License

ISC
