# Bindable

Bind live objects to the DOM. The idea for this functionality is borrowed from
[Ember](https://github.com/emberjs/ember.js). Take a look at this
[jsfiddle](http://jsfiddle.net/ryankee/VwQgA/2/) to see it in action.

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

boundObject.set('firstName', 'Maxwell'); // DOM Updates: "<p>Hello, Maxwell</p>"

var fullDOM = "<p>Hello, " + boundObject.bind('fullName') + "</p>";
document.body.innerHTML = fullDOM;

boundObject.set('firstName', 'David'); // DOM Updates: "<p>Hello, David Doe</p>" 
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

setTimeout(function(){
  // note: time has passed but it's still the same
  boundObject.get('time'); // "1362782277645 seconds"
}, 1000);

setTimeout(function(){
  // bust the cache manually
  boundObject.get('time', true); // "1362782412537 seconds"
}, 1000);

setTimeout(function(){
  // bust the cache by manipulating a relied upon property
  boundObject.set('descriptor', 'minutes');
  boundObject.get('time'); // "1362782474713 minutes"
}, 1000);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## License
Copyright (c) 2013 Ryan Kee  
Licensed under the MIT license.
