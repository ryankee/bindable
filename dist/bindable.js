/**
 * Bindable
 * https://github.com/ryankee/bindable
 *
 * Copyright (c) 2013 Ryan Kee
 * Licensed under the MIT license.
 *
 * Provides the base Bindable module
 * @module Bindable
 */
(function(){
  this.Bindable = {};
  
/*
 * http://www.ruzee.com/blog/2008/12/javascript-inheritance-via-prototypes-and-closures
 *
 * Modified by Ryan Kee, Flavor
 * http://weareflavor.com
 */
var BindableClass = (function(){
  var klass = function(){};
  klass.create = function(constructor) {
    var k = this;
    var c = function() {
      this._super = k;
      var pubs = constructor.apply(this, arguments), self = this;
      function bindSuper(key, fn, sfn){
        self[key] = typeof fn !== "function" || typeof sfn !== "function" ? fn :
          function() { this._super = sfn; return fn.apply(this, arguments); };
      }
      for (var key in pubs){
        bindSuper(key, pubs[key], self[key]);
      }
    }; 
    var BC = this;
    c.prototype = new BC();
    c.prototype.constructor = c;
    c.extend = this.extend || this.create;
    return c;
  };
  return klass;
})();

/**
* Defines an object that can be bound to the dom
*
* @class DOMBindable
*/
var DOMBindable = BindableClass.create(function(val){
  var pub = {};
  pub.id = "bnd-p-" + Math.random().toString(36).substr(2, 36);

  /**
  Updates DOM bindings for given property
  @private
  **/
  pub.updateBindings = function(value){
    var bindings = pub.getBindingsForID(pub.id);
    for(var i=0; i<bindings.length; i++){
      this.replaceBinding(bindings[i], pub.id, value);
    }
  };

  /**
  Generates DOM binding string
  @param {String} id The property id
  @param {Object} value The property value
  @return {String} DOM binding string
  @private
  **/
  pub.generateBinding = function(id, value){
    var open = '<script data-binding-id="'+id+'-start"></script>',
        close = '<script data-binding-id="'+id+'-end"></script>';
    return open + value + close;
  };
  
  /**
  Searches the DOM and updates bindings.
  @param {Node} container The containing node of a bound property
  @param {String} id The property id
  @param {Object} value The property value
  @private
  **/
  pub.replaceBinding = function(container, id, value){
    var pattern = '(<script.*'+id+'-start".*/script>).*?(<script.*'+id+'-end".*?/script>)',
        reg = new RegExp(pattern,'g'),
        html = container.innerHTML;
    
    container.innerHTML = html.replace(reg, "$1"+value+"$2");
  };

  /**
  Generates DOM binding string
  @param {String} id The property id
  @return {Array} Array of Nodes that contain matching bindings
  @private
  **/
  pub.getBindingsForID = function(id){
    var matchingElements = [];
    var allElements = document.getElementsByTagName('script');
    for (var i = 0; i < allElements.length; i++){
      if (allElements[i].getAttribute('data-binding-id') === id+'-start'){
        if(matchingElements.indexOf(allElements[i].parentNode) === -1){
          matchingElements.push(allElements[i].parentNode);
        }
      }
    }
    return matchingElements;
  };
  
  return pub;
});

/**
* Bindable properties are low-level structures to build bindings.
*
* @module Bindable
* @class Property
*/
var Property = DOMBindable.extend(function(val){
  this._super();
  var pub = this,
      value;

  /**
  Sets a property
  @param {Object} val A value to assign the property
  @return {Property} Current bindable property
  **/
  pub.set = function(val){
    if(!val){
      throw new Error("Value cannot be empty");
    }
    value = val;
    pub.updateBindings(value);
    return pub;
  };

  /**
  Gets a value
  @return {Object} Property value
  **/
  pub.get = function(){
    return value;
  };
  
  /**
  Generates a DOM binding string to insert into the DOM via your templating
  engine of choice.
  @return {String} DOM binding string
  **/
  pub.bind = function(){
    return pub.generateBinding(pub.id, value);
  };

  
  pub.set(val);
  return pub;
});

/**
  Exposed bindable property wrapper
  @constructor
 */
Bindable.Property = (function(){
  /**
   Class methods
   **/
  var klass = {};

  /**
  Creates a new instance of a bindable property
  @param {Object} value A value to assign the property
  @return {Property} Bindable property instance
  **/
  klass.create = function(value){
    if(!value){
      throw new Error("Value cannot be empty");
    }
    return new Property(value);
  };
  
  return klass;
})();

/**
* Computed properties take advantage of other bindable properties in a bindable
* object and allow processed properties.
*
* @module Bindable
* @class Property
*/
var Computed = DOMBindable.extend(function(func){
  this._super();
  var pub = this;
  pub.dependentKeys = [];
  pub.cached = undefined;

  /**
  Reminds folks you can't set a computed property directly
  **/
  pub.set = function(){
    throw new Error(
      "You cannot set computed properties directly. Use `get` and `set` on the properties instead."
    );
  };
  
  /**
  Updates a property
  **/
  pub.update = function(){
    pub.updateBindings(pub.get.call(this, true));
  };

  /**
  Gets a property
  @param {String} key The name of the property to retrieve
  @return {Object} Current bindable object
  **/
  pub.get = function(bustCache){
    if(bustCache === true || pub.cached === undefined){
      pub.cached = func.call(this);
    }
    return pub.cached;
  };

  /**
  Generates a DOM binding string to insert into the DOM via your templating
  engine of choice.
  @return {String} DOM binding string
  **/
  pub.bind = function(){
    return pub.generateBinding(pub.id, pub.get.call(this));
  };
  
  /**
  Binds properties to watch on a computed property
  @return {Computed} Computed property
  **/
  pub.property = function(){
    var args = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
      pub.dependentKeys.push(arguments[i]);
    }
    return pub;
  };
  
  return pub;
});

/**
Adds `.property` method to functions
@return {Computed} Computed property
**/
Function.prototype.property = function(){
  var ret = new Computed(this);
  return ret.property.apply(ret, arguments);
};

/**
  Exposed computed property wrapper
  @constructor
 */
Bindable.Computed = (function(func){
  /**
   Class methods
   **/
  var klass = {};

  /**
  Creates a new instance of a computed property
  @param {Object} value A value to assign the property
  @return {Property} Bindable property instance
  **/
  klass.create = function(func){
    if(!func){
      throw new Error("Computed function cannot be empty");
    }
    return new Computed(func);
  };
  
  return klass;
})();


/**
* Bindable objects are high-level structures to store and update bindable
* properties. The can be instantiated with values or set with values on the fly.
*
* @module Bindable
* @class Object
*/
var BindableObject = BindableClass.create(function(obj){
  var props = {},
      pub = {},
      registers = {};

  /**
  Sets a property
  @param {String} key The name of the property to assign
  @param {Object} value A value to assign the property
  @return {Object} Current bindable object
  **/
  pub.set = function(key, value){
    if(!value){
      throw new Error("Value cannot be empty");
    }
    if(props[key] !== undefined){
      props[key].set(value);
    }else{
      if(value instanceof DOMBindable){
        props[key] = value;

        // add computed properties' watched values to a register
        for(var i=0; i<value.dependentKeys.length; i++){
          var watchKey = value.dependentKeys[i];
          if(registers[watchKey] === undefined){
            registers[watchKey] = [];
          }
          registers[watchKey].push(value);
        }
      }else{
        props[key] = Bindable.Property.create(value);
      }
    }

    // check if we have any listening computed properties
    if(registers[key] !== undefined){
      for(var obj in registers[key]){
        registers[key][obj].update.call(this);
      }
    }
    return pub;
  };

  /**
  Gets a property
  @param {String} key The name of the property to retrieve
  @return {Object} Current bindable object
  **/
  pub.get = function(key, bustCache){
    var ret;
    if(props[key] === undefined){
      throw new Error("Property does not exist");
    }
    return props[key].get.call(this, bustCache);
  };

  /**
  Generates a DOM binding string to insert into the DOM via your templating
  engine of choice.
  @param {String} key The name of the property to bind
  @return {String} DOM binding string
  **/
  pub.bind = function(key){
    return props[key].bind.call(this);
  };

  for(var key in obj){
    pub.set(key, obj[key]);
  }

  return pub;
});

/**
  Exposed bindable object wrapper
  @constructor
 */
Bindable.Object = (function(){
  /*
   Class methods
   */
  var klass = {};

  /**
  Creates a new instance of a bindable object
  @param {Object} obj An object of values to bind
  @return {Object} Bindable object instance
  **/
  klass.create = function(obj){
    return new BindableObject(obj);
  };
  
  return klass;
})();


})();
