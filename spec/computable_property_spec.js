describe("Computed Property", function() {
  it("can be instantiated", function() {
    var func = function(){};
    expect(Bindable.Computed.create(func)).not.toBeUndefined();
  });
  
  it("must pass value to be instantiated", function() {
    expect(function(){Bindable.Computed.create()}).toThrow("Computed function cannot be empty");
  });

  it("can get a value", function(){
    var one = Bindable.Computed.create(
      function(){
        return 1;
      }
    );
    expect(one.get()).toEqual(1);
  });

  it("cannot set a value", function(){
    var one = Bindable.Computed.create(
      function(){
        return 1;
      }
    );
    expect(function(){one.set()}).toThrow("You cannot set computed properties directly. Use `get` and `set` on the properties instead.");
  });
});
