# Bindable

Bind live objects to the DOM. The idea for this functionality is borrowed from
[Ember](https://github.com/emberjs/ember.js).

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

boundObject.set('firstName', 'Maxwell'); // DOM Updates: "Hello, Maxwell"

var fullDOM = "<p>Hello, " + boundObject.bind('fullName') + "</p>";
document.body.innerHTML = fullDOM;

boundObject.set('firstName', 'David'); // DOM Updates: "Hello, David Doe"
```

Note: computed properties are cached after their first request and re-cached
upon updating. That means you can't put live data like current timestamps in the
computed property and expect it to update everything you `get` the property.
Luckily you can pass a boolean to `get` to bust the cache:

```javascript
var boundObject = Bindable.Object.create({
  descriptor:"seconds",
  time:function(){
    return new Date().getTime() + ' ' + this.get('descriptor');
  }.property('descriptor')
});

boundObject.get('time'); // "1362782277645 seconds"

// note: time has passed but it's still the same
boundObject.get('time'); // "1362782277645 seconds"

boundObject.get('time', true); // "1362782412537 seconds"

boundObject.set('descriptor', 'minutes');
boundObject.get('time', true); // "1362782474713 seconds"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## License
Copyright (c) 2013 Ryan Kee  
Licensed under the MIT license.
