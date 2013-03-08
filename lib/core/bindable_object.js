require('lib/core/util/class');
require('lib/core/properties/bindable_property');
require('lib/core/properties/bindable_computed');

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

