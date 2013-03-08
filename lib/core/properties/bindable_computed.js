require('lib/core/util/dom_bindable');
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

