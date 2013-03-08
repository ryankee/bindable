# bindings

Bind live objects to the DOM.

## Getting Started

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ryankee/bindable/master/dist/bindable.min.js
[max]: https://raw.github.com/ryankee/bindable/master/dist/bindable.js

You can attach bindings's methods to any object.

```javascript
var boundObject = Bindable.Object.create({
  firstName:"Jon",
  lastName:"Doe",
  fullName:function(){
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});

var firstDOM = "<p>Hello, " + boundObject.bind('firstName') + "</p>";
document.body.innerHTML = firstDOM;

boundObject.set('firstName', 'Maxwell'); // DOM Updates: "Hello, Maxwell Doe"

var fullDOM = "<p>Hello, " + boundObject.bind('fullName') + "</p>";
document.body.innerHTML = fullDOM;

boundObject.set('firstName', 'David'); // DOM Updates: "Hello, David Doe"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## License
Copyright (c) 2013 Ryan Kee  
Licensed under the MIT license.
