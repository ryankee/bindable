require('lib/core/properties/bindable_property');

/**
* Bindable objects are high-level structures to store and update bindable
* properties. The can be instantiated with values or set with values on the fly.
*
* @module Bindable
* @class Object
*/
Bindable.Object = (function(){

  /**
    Object Instance
    @param {Object} obj An object of values to bind
    @constructor
   */
  function Instance(obj){
    var props = {},
        pub = {};

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
        props[key] = Bindable.Property.create(value);
      }
      return pub;
    };

    /**
    Gets a property
    @param {String} key The name of the property to retrieve
    @return {Object} Current bindable object
    **/
    pub.get = function(key){
      if(props[key] === undefined){
        throw new Error("Property does not exist");
      }
      return props[key].get();
    };

    /**
    Generates a DOM binding string to insert into the DOM via your templating
    engine of choice.
    @param {String} key The name of the property to bind
    @return {String} DOM binding string
    **/
    pub.bind = function(key){
      return props[key].bind();
    };

    for(var key in obj){
      pub.set(key, obj[key]);
    }
    return pub;
  }

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
    return new Instance(obj);
  };
  
  return klass;
})();
