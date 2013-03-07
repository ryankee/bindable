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
  
/**
* Bindable properties are low-level structures to build bindings.
*
* @module Bindable
* @class Property
*/
Bindable.Property = (function(){

  /**
    Property Instance
    @param {Object} val A value to assign the property
    @constructor
   */
  function Instance(val){
    var pub = {},
        value;

    pub.id = "bnd-p-" + Math.random().toString(36).substr(2, 36);

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
      updateBindings();
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
      return generateBinding(pub.id, value);
    };

    /**
    Updates DOM bindings for given property
    @private
    **/
    function updateBindings(){
      var bindings = getBindingsForID(pub.id);
      for(var i=0; i<bindings.length; i++){
        replaceBinding(bindings[i], pub.id, value);
      }
    }
    
    pub.set(val);
    return pub;
  }

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
    return new Instance(value);
  };
  
  /**
  Generates DOM binding string
  @param {String} id The property id
  @param {Object} value The property value
  @return {String} DOM binding string
  @private
  **/
  function generateBinding(id, value){
    var open = '<script data-binding-id="'+id+'-start"></script>',
        close = '<script data-binding-id="'+id+'-end"></script>';
    return open + value + close;
  }
  
  /**
  Searches the DOM and updates bindings.
  @param {Node} container The containing node of a bound property
  @param {String} id The property id
  @param {Object} value The property value
  @private
  **/
  function replaceBinding(container, id, value){
    var pattern = '(<script.*'+id+'-start".*/script>).*?(<script.*'+id+'-end".*?/script>)',
        reg = new RegExp(pattern,'g'),
        html = container.innerHTML;
    
    container.innerHTML = html.replace(reg, "$1"+value+"$2");
  }

  /**
  Generates DOM binding string
  @param {String} id The property id
  @return {Array} Array of Nodes that contain matching bindings
  @private
  **/
  function getBindingsForID(id){
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
  }
  
  return klass;
})();

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

})();
