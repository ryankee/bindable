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
