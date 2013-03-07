describe("Bindable Property", function() {
  it("can be instantiated", function() {
    expect(Bindable.Property.create(1)).not.toBeUndefined();
  });

  it("must pass value to be instantiated", function() {
    expect(function(){Bindable.Property.create()}).toThrow("Value cannot be empty");
  });

  it("can get a value", function(){
    var one = Bindable.Property.create(1);
    expect(one.get()).toEqual(1);
  });
  
  it("can set a value", function(){
    var one = Bindable.Property.create(1);
    one.set(10);
    expect(one.get()).toEqual(10);
  });

  it("must pass a value when setting a property", function(){
    var obj = Bindable.Property.create(1);
    expect(function(){obj.set()}).toThrow("Value cannot be empty");
  });
  
});
