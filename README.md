# react-awesomplete-tagger

![demo](https://media.giphy.com/media/iJPDqHwV0h0S7F3xsQ/giphy.gif)

* Depends on https://leaverou.github.io/awesomplete/
* Debounces completions fetching
* 1.9K minified UMD

## Usage

First:

~~~
<link rel="stylesheet" href="awesomplete.css">
<script src="awesomplete.min.js"></script>
<script src="react-awesomplete-tagger.min.js"></script>
~~~

Second, create an AwesompleteTagger component w/ a 2 predifined
competions:

~~~
<AwesompleteTagger completions={() => Promise.resolve(['foo', 'bar'])} />
~~~

Props:

* `completions`: (required) expects a fn that returns a promise
* `opt`: an options hash that gets passed down to Awesomplete
* `debounce`: default is 200 (ms)

See `demo.*` files.

## Compile an UMD

~~~
# npm i -g rollup terser adieu
$ npm i
$ make
~~~

Results are expected in `dist/`.

## License

MIT.
