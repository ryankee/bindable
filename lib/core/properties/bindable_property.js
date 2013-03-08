require('lib/core/util/dom_bindable');
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
