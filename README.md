# bindings

Bind live objects to the DOM.

## Getting Started

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ryankee/bindings/master/dist/bindings.min.js
[max]: https://raw.github.com/ryankee/bindings/master/dist/bindings.js

You can attach bindings's methods to any object.

```javascript
var boundObject = Bindable.Object.create({
  first:"Jon",
  last:"Doe"
});

var output = "<p>Hello, " + boundObject.bind('first') + "</p>";
document.body.innerHTML = output;

boundObject.set('first', 'Maxwell'); // DOM Updates
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## License
Copyright (c) 2013 Ryan Kee  
Licensed under the MIT license.
