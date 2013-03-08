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
