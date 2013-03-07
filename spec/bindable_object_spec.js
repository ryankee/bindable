describe("Bindable Object", function() {
  it("can be instantiated", function() {
    expect(Bindable.Object.create()).not.toBeUndefined();
  });
  
  it("can get a value", function(){
    var obj = Bindable.Object.create({
      test:1
    });
    var test = obj.get('test');
    expect(test).toEqual(1);
  });
  
  it("can set a value", function(){
    var obj = Bindable.Object.create();
    obj.set('test', 1);
    var out = obj.get('test');
    expect(out).toEqual(1);
  });

  it("must pass a vlue when setting a property", function(){
    var obj = Bindable.Object.create();
    expect(function(){obj.set('test')}).toThrow("Value cannot be empty");
  });

  it("can only retrieve set properties", function(){
    var obj = Bindable.Object.create();
    expect(function(){obj.get('test')}).toThrow("Property does not exist");
  });
  

});
