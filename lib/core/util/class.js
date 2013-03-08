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
