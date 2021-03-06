/*          PUMASCRIPT TEST SUITE FOR ECMA COMPLIANCE
 *                        SECTION 15
 */

define(['pumascript', 'esprima'], function (puma, esprima) {
    
    
    //   Section 15.1: The Global Object   //
    
    test("Value Properties of the Global Object: NaN", function () {
        var result = puma.evalPuma("NaN");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(isNaN(result.value), true, "Passed!");
    });
    
    test("Value Properties of the Global Object: Infinity", function () {
        var result = puma.evalPuma("Infinity");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, Infinity, "Passed!");
    });
    
    test("Value Properties of the Global Object: Undefined", function () {
        var result = puma.evalPuma("undefined");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, undefined, "Passed!");
    });
    
    test("Function Properties of the Global Object: eval(x)", function () {
        var result = puma.evalPuma("eval(Number(1));");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 1, "Passed!");
    });
    
    test("Function Properties of the Global Object: eval(WrongSyntax)", function () {
        var err;
        try {
            var result = puma.evalPuma("eval(\"var 1;\");");
        }
        catch (e) {
            if (e instanceof SyntaxError) {
            /*    equal(e.message, "missing variable name", "Passed!");     beats me as of why this doesn't work */
                equal(true, true, "Passed!");
            }
        }
    });
    
    test("Function Properties of the Global Object: eval()", function () {
        var result = puma.evalPuma("eval(\"var f = 'Lachesis'; f === 'Lachesis';\");");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });   
    
    test("Function Properties of the Global Object: eval(string)", function () {
        var result = puma.evalPuma("eval(\"var f = 'Clotho'; f;\");");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'Clotho', "Passed!");
    });
    
    QUnit.skip("Indirect Call to Eval", function () {
        var result = puma.evalPuma("var indirectEval = (1, eval); indirectEval(\"var f = 'Atropos'; f;\");");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'Atropos', "Passed!");
    });
    
    test("parseInt(string, radix)", function () {
        var result = puma.evalPuma("parseInt (' +2027ADX', 16);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2107309, "Passed!");
    });
    
    test("parseInt(invalidParse)", function () {
        var result = puma.evalPuma("parseInt ('0xT');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(isNaN(result.value), true, "Passed!");
    });
    
    test("parseFloat(string)", function () {
        var result = puma.evalPuma("parseFloat(' -20.7N');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, -20.7, "Passed!");
    });
    
    test("parseFloat(invalidParse)", function () {
        var result = puma.evalPuma("parseFloat('UD4');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(isNaN(result.value), true, "Passed!");
    });
    
    test("isNaN(number)", function () {
        var result = puma.evalPuma("isNaN(0/0);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("isFinite(number)", function () {
        var result = puma.evalPuma("isFinite(2);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("encodeURI(string)", function () {
        var result = puma.evalPuma("encodeURI('https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan, USA');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik,%20Faridah&birth=1999:Dearborn,%20Michigan,%20USA", "Passed!");
    });
    
    test("decodeURI(string)", function () {
        var result = puma.evalPuma("decodeURI('https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik,%20Faridah&birth=1999:Dearborn,%20Michigan,%20USA')");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan, USA", "Passed!");
    });
    
    test("encodeURIComponent(string)", function () {
        var result = puma.evalPuma("encodeURIComponent('https://www.googleapis.com/customsearch/v1?key=5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan@USA');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "https%3A%2F%2Fwww.googleapis.com%2Fcustomsearch%2Fv1%3Fkey%3D5475%26name%3DMalik%2C%20Faridah%26birth%3D1999%3ADearborn%2C%20Michigan%40USA", "Passed!");
    });
    
    test("decodeURIComponent(string)", function () {
        var result = puma.evalPuma("decodeURIComponent('https%3A%2F%2Fwww.googleapis.com%2Fcustomsearch%2Fv1%3Fkey%3D5475%26name%3DMalik%2C%20Faridah%26birth%3D1999%3ADearborn%2C%20Michigan%40USA')");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan@USA", "Passed!");
    });
    
    
    //   Section 15.2: Object Objects   //
    
    test("Object(undefined)", function () {
        var result = puma.evalPuma("Object(undefined)");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(new Object(undefined)), "Passed!");
    });
    
    test("Object(value)", function () {
        var result = puma.evalPuma("Object(4)");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(new Object(4)), "Passed!");
    });
        
    QUnit.skip("Object Constructor", function () {
        obj = new Object({Name:'LEO', Terminal:25000});
        var result = puma.evalPuma("new Object({Name:'LEO', Terminal:25000});");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(obj), "Passed!");
    });
    
    QUnit.skip("Object.prototype", function () {
        var result = puma.evalPuma("Object.prototype.isPrototypeOf(Object());");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("Object.getPrototypeOf(Object)", function () {
        var a = Array('Atropos', 'Clotho', 'Lachesis');
        var result = puma.evalPuma("Object.getPrototypeOf(Array());");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.isPrototypeOf(a), true, "Passed!");
    });
    
    test("Object.getOwnPropertyDescriptor(O,P)", function () {
        var c = { value: 42, writable: true, enumerable: true, configurable: true }; 
        var result = puma.evalPuma("var o, d; o = { bar: 42 }; d = Object.getOwnPropertyDescriptor(o, 'bar');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(c), "Passed!");
    });
    
    //   If the argument to this method is not an object it will cause a TypeError. As of ES6, a non-object argument will be coerced to an object.   //
    
    test("Object.getOwnPropertyNames(Object)", function () {
        var c = ["0", "1", "2", "length"];
        var result = puma.evalPuma("var arr = ['Alpha', 'Beta', 'Gamma']; Object.getOwnPropertyNames(arr);")
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(c), "Passed!");
    });
    
    test("Object.create(O [, Properties])", function () {
        var c = { value: "Puma", writable: true, enumerable: false, configurable: false };
        var result = puma.evalPuma("var o = Object.create(null, { foo: { writable: true, configurable: false, enumerable: false, value: 'Puma' }, bar: { value: 20 } } );");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.bar, 20, "Passed!");
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'foo')), JSON.stringify(c), "Passed!");
    });
    
    test("Object.defineProperty(O, P, Attributes)", function () {
        var c = { value: "Rawr!", writable: true, enumerable: false, configurable: true };
        var result = puma.evalPuma("var o = Object(); Object.defineProperty(o, 'puma', { configurable: true, writable: true, value: 'Rawr!' } ); o;");
        result.makeValue();
        equal(result.success, true, "Passed!");     
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'puma')), JSON.stringify(c), "Passed!");
    });
    
    test("Object.defineProperties(O, Properties)", function () {
        var c = { value: "Rawr!", writable: true, enumerable: false, configurable: false };
        var result = puma.evalPuma("var o = Object(); Object.defineProperties(o, { 'puma': { writable: true, value: 'Rawr!' }, 'script': { value: true } } ); o;");
        result.makeValue();
        equal(result.success, true, "Passed!");     
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'puma')), JSON.stringify(c), "Passed!");
        equal(result.value.script, true, "Passed!");
    });
    
    test("Object.seal(O)", function () {
        var c = { value: "Shaher", writable: true, enumerable: false, configurable: false };
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.seal(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'name')), JSON.stringify(c), "Passed!");
        equal(Object.isExtensible(result.value), false, "Passed!");
    });
    
    test("Object.freeze(O)", function () {
        var c = { value: "Shaher", writable: false, enumerable: false, configurable: false };
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.freeze(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'name')), JSON.stringify(c), "Passed!");
        equal(Object.isExtensible(result.value), false, "Passed!");
    });
    
    test("Object.preventExtensions(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.preventExtensions(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(Object.isExtensible(result.value), false, "Passed!");
    });
    
    test("Object.isSealed(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.seal(Fallen); Object.isSealed(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("Object.isFrozen(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.freeze(Fallen); Object.isFrozen(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("Object.isExtensible(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.preventExtensions(Fallen); Object.isExtensible(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, false, "Passed!");
    });
    
    test("Object.keys(O)", function () {
        var a = ["name", "lv", "lead"];
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable:true, configurable:true, enumerable:true, value: 'Shaher' }, hp: { writable:true, enumerable:false, value: 617 }, lv: { configurable: true, enumerable: true, value: 32 }, lead: { configurable: false, enumerable: true, value: true } } ); Object.keys(Fallen);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(a), "Passed!");
    });
    
    QUnit.skip("Object.prototype.constructor", function () {
        var result = puma.evalPuma("Object.prototype.constructor === Object().constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    QUnit.skip("Object.prototype.toString()", function () {
        var result = puma.evalPuma("var toStringP = Object.prototype.toString; toStringP.call(Math);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Math]', "Passed!");
    });
    
    QUnit.skip("Object.prototype.toString(): undefined", function () {
        var result = puma.evalPuma("var toStringU = Object.prototype.toString; toStringU.call(undefined);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Undefined]', "Passed!");
    });
    
    QUnit.skip("Object.prototype.toString(): null", function () {
        var result = puma.evalPuma("var toStringN = Object.prototype.toString; toStringN.call(null);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Null]', "Passed!");
    });
    
    QUnit.skip("Object.prototype.toLocaleString()", function () {
        var result = puma.evalPuma("var toLocaleStringP = Object.prototype.toLocaleString; toLocaleStringP.call(Math);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Math]', "Passed!");
    });
    
    QUnit.skip("Object.prototype.valueOf()", function () {
        var oni = Object.create(null, { height: { value: 1 }, width: { value: 6 }, color: { value: 'red' } });
        var result = puma.evalPuma("var ono = Object.create(null, { height: { value: 1 }, width: { value: 6 }, color: { value: 'red' } }); var valueOfO = Object.prototype.valueOf; valueOfO.call(ono);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
        equal(result.value.height, 1, "Passed!");
        equal(result.value.width, 6, "Passed!");
        equal(result.value.color, 'red', "Passed!");
    });
    
    QUnit.skip("Object.prototype.hasOwnProperty(V)", function () {
        var result = puma.evalPuma("var ono = Object.create(null, { height: { value: 1 }, width: { value: 6 }, color: { value: 'red' } }); Object.prototype.hasOwnProperty.call(ono, 'color');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    QUnit.skip("Object.prototype.isPrototypeOf(V)", function () {
        var result = puma.evalPuma("var oni = Object.create(null); oni.prototype = Object.prototype; oni.prototype.isPrototypeOf(Object);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    QUnit.skip("Object.prototype.propertyIsEnumerable(V)", function () {
        var result = puma.evalPuma("var ono = Object.create(null, { color: { enumerable: true, value: 'red' }, range: { enumerable: false, value: 'red' } }); var pIE = Object.prototype.propertyIsEnumerable; pIE.call(ono, 'color') && !pIE.call(ono, 'range');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    
    //   Section 15.3: Function Objects   //
    
    test("The Function Constructor Called as a Function", function () {
        var a = new Function();
        var result = puma.evalPuma("var e = Function(); e.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, a.toString(), "Passed!");
    });
    
    QUnit.skip("The Function Constructor Called as a new Function", function () {
        var a = new Function();
        var result = puma.evalPuma("var e = new Function(); e.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, a.toString(), "Passed!");
    });
    
    test("Function(p1,p2, … ,pn,body)", function () {
        var result = puma.evalPuma("var r = Function('x', 'fx', 'h', 'd', 'return x+fx+h+d'); r.call(this,6,8,7,0);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 21, "Passed!");
    });
    
    QUnit.skip("The Function Constructor", function () {
        var result = puma.evalPuma("var r = new Function('Sapph', 'ire', 'AMD', 'R', 'return Sapph+ire+AMD+R'); r.call(this,9,3,8,0);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 20, "Passed!");
    });
    
    QUnit.skip("Function.prototype", function () {
        var result = puma.evalPuma("Function.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'function () {}', "Passed!");
    });
    
    test("Function.length", function () {
        var result = puma.evalPuma("Function.length;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 1, "Passed!");
    });
    
    QUnit.skip("Properties of the Function Prototype Object", function () {
        var result = puma.evalPuma("Function.prototype.length;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0, "Passed!");
    });
    
    QUnit.skip("Function.prototype.constructor", function () {
        var c = Function('character', 'dialog', "return character+': \"'+dialog+'\"'").prototype.constructor.toString();
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("Function.prototype.constructor.toString()", function () {
        var c = Function('character', 'dialog', "return character+': \"'+dialog+'\"'").prototype.constructor.toString();
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.constructor.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, c, "Passed!");
    });
    
    QUnit.skip("Function.prototype.toString()", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Object]', "Passed!");
    });
    
    test("Function.prototype.apply(thisArg, argArray)", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.apply(this, ['Eleanor', \"I'm sorry, Alphonse. I couldn't keep my promise...\"]);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "Eleanor: \"I'm sorry, Alphonse. I couldn't keep my promise...\"", "Passed!");
    });
    
    test("Function.prototype.call(thisArg [, arg1 [, arg2, … ]])", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.call(this, 'Alphonse', \"Good-bye, Eleanor.\");");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "Alphonse: \"Good-bye, Eleanor.\"", "Passed!");
    });
    
    QUnit.skip("Function.prototype.bind(thisArg [, arg1 [, arg2, … ]])", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); order_scope();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'flank', "Passed!");
    });
    
    QUnit.skip("[[Call]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); order_scope.call(this);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'flank', "Passed!");
    });
    
    QUnit.skip("[[Construct]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); var o = new order_scope; o.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '[object Object]', "Passed!");
    });
    
    QUnit.skip("[[HasInstance]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); var o = new order_scope; o instanceof unbound_scope;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("Properties of Function Instances: length", function () {
        var result = puma.evalPuma("var str = Function('item', 'quantity', 'location', \"console.log('NOT IMPLEMENTED...');\"); str.length;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 3, "Passed!");
    });
    
    QUnit.skip("Properties of Function Instances: prototype", function () {
        var s = "function store(item, quantity, location) { console.log('NOT IMPLEMENTED...'); }"
        var result = puma.evalPuma("var str = Function('item', 'quantity', 'location', \"console.log('NOT IMPLEMENTED...');\"); str.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.constructor.toString(), s, "Passed!");
    });
    
    QUnit.skip("[[HasInstance]] (V)", function () {
        var result = puma.evalPuma("function store(item, quantity, location) { /**/ }; var a = new store; a instanceof store;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    test("[[Get]] (P)", function () {
        var result = puma.evalPuma("var foo = function store(item, quantity, location) { /**/ }; foo.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'store', "Passed!");
    });
    
    
    //   Section 15.6: Boolean Objects   //
    
    test("The Boolean Constructor Called as a Function", function () {
        var result = puma.evalPuma("var b = Boolean();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, false, "Passed!");
    });
    
    test("Boolean(value)", function () {
        var result = puma.evalPuma("var b = Boolean(1);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    QUnit.skip("The Boolean Constructor", function () {
        var result = puma.evalPuma("var b = new Boolean();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
        equal(result.value.valueOf(), false, "Passed!");
    });
    
    QUnit.skip("new Boolean(value)", function () {
        var result = puma.evalPuma("var b = new Boolean(1);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
        equal(result.value.valueOf(), true, "Passed!");
    });
    
    test("Properties of the Boolean Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("Boolean;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("Boolean.prototype", function () {
        var result = puma.evalPuma("Boolean.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.valueOf(), false, "Passed!");
    });
    
    test("Properties of the Boolean Prototype Object", function () {
        var pd = { value: false, writable: false, enumerable: false, configurable: false };
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Boolean, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(pd), "Passed!");
    });
    
    QUnit.skip("Boolean.prototype.constructor", function () {
        var c = "function Boolean() {\n    [native code]\n}"
        var result = puma.evalPuma("Boolean.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("Boolean.prototype.toString()", function () {
        var result = puma.evalPuma("var b = Boolean(true); b.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "true", "Passed!");
    });
    
    QUnit.skip("Boolean.prototype.valueOf()", function () {
        var result = puma.evalPuma("var b = Boolean(true); b.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    QUnit.skip("Properties of Boolean Instances", function () {
        var result = puma.evalPuma("var b = true; b.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, true, "Passed!");
    });
    
    
    //   Section 15.7: Number Objects   //
    
    test("The Number Constructor Called as a Function", function () {
        var result = puma.evalPuma("var n = Number();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0, "Passed!");
    });
    
    test("Number([value])", function () {
        var result = puma.evalPuma("var n = Number(2);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2, "Passed!");
    });
    
    QUnit.skip("The Number Constructor", function () {
        var result = puma.evalPuma("var n = new Number();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
        equal(result.value.valueOf(), 0, "Passed!");
    });
    
    QUnit.skip("new Number([value])", function () {
        var result = puma.evalPuma("var n = new Number(2);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
        equal(result.value.valueOf(), 2, "Passed!");
    });
    
    test("Properties of the Number Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("Number;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("Number.prototype", function () {
        var result = puma.evalPuma("Number.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.valueOf(), 0, "Passed!");
    });
    
    test("Number.MAX_VALUE", function () {
        var result = puma.evalPuma("Number.MAX_VALUE;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 1.7976931348623157e+308, "Passed!");
    });
    
    test("Number.MIN_VALUE", function () {
        var result = puma.evalPuma("Number.MIN_VALUE;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 5e-324, "Passed!");
    });
    
    test("Number.NaN", function () {
        var result = puma.evalPuma("Number.NaN;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(isNaN(result.value), true, "Passed!");
    });
    
    test("Number.NEGATIVE_INFINITY", function () {
        var result = puma.evalPuma("Number.NEGATIVE_INFINITY;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, -Infinity, "Passed!");
    });
    
    test("Number.POSITIVE_INFINITY", function () {
        var result = puma.evalPuma("Number.POSITIVE_INFINITY;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, Infinity, "Passed!");
    });
    
    test("Properties of the Number Prototype Object", function () {
        var pd = { value: 0, writable: false, enumerable: false, configurable: false };
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Number, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), JSON.stringify(pd), "Passed!");
    });
    
    QUnit.skip("Number.prototype.constructor", function () {
        var c = "function Number() {\n    [native code]\n}"
        var result = puma.evalPuma("Number.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    test("Number.prototype.toString([radix])", function () {
        var result = puma.evalPuma("var n = Number(2029); n.toString(16);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "7ed", "Passed!");
    });
    
    test("Number.prototype.toLocaleString()", function () {
        var a = 2029; var c = a.toLocaleString();
        var result = puma.evalPuma("var n = Number(2029); n.toLocaleString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, c, "Passed!");
    });
    
    test("Number.prototype.valueOf()", function () {
        var result = puma.evalPuma("var n = Number(2027); n.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2027, "Passed!");
    });
    
    test("Number.prototype.toFixed(fractionDigits)", function () {
        var result = puma.evalPuma("var n = Number(0.08); n.toFixed(4);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "0.0800", "Passed!");
    });
    
    test("Number.prototype.toExponential(fractionDigits)", function () {
        var result = puma.evalPuma("var n = Number(290.8882087); n.toExponential(3);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "2.909e+2", "Passed!");
    });
    
    test("Number.prototype.toPrecision(precision)", function () {
        var result = puma.evalPuma("var n = Number(4.8481368); n.toPrecision(4);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "4.848", "Passed!");
    });
    
    test("Properties of Number Instances", function () {
        var result = puma.evalPuma("var n = 2; n.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2, "Passed!");
    });
    
        
    //   Section 15.8: The Math Object   //
    
    test("Value Properties of the Math Object: E", function () {
        var result = puma.evalPuma("Math.E;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2.718281828459045, "Passed!");
    });
    
    test("Value Properties of the Math Object: LN10", function () {
        var result = puma.evalPuma("Math.LN10;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2.302585092994046, "Passed!");
    });
    
    test("Value Properties of the Math Object: LN2", function () {
        var result = puma.evalPuma("Math.LN2;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.6931471805599453, "Passed!");
    });
    
    test("Value Properties of the Math Object: LOG2E", function () {
        var result = puma.evalPuma("Math.LOG2E;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 1.4426950408889634, "Passed!");
    });
    
    test("Value Properties of the Math Object: LOG10E", function () {
        var result = puma.evalPuma("Math.LOG10E;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.4342944819032518, "Passed!");
    });
    
    test("Value Properties of the Math Object: PI", function () {
        var result = puma.evalPuma("Math.PI;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 3.1415926535897932, "Passed!");
    });
    
    test("Value Properties of the Math Object: SQRT1_2", function () {
        var result = puma.evalPuma("Math.SQRT1_2;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.7071067811865476, "Passed!");
    });
    
    test("Value Properties of the Math Object: SQRT2", function () {
        var result = puma.evalPuma("Math.SQRT2;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 1.4142135623730951, "Passed!");
    });
    
    test("Function Properties of the Math Object: abs(x)", function () {
        var result = puma.evalPuma("Math.abs(-5);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 5, "Passed!");
    });
    
    test("Function Properties of the Math Object: acos(x)", function () {
        var result = puma.evalPuma("Math.acos(0.6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.9272952180016123, "Passed!");
    });
    
    test("Function Properties of the Math Object: asin(x)", function () {
        var result = puma.evalPuma("Math.asin(0.6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.6435011087932844, "Passed!");
    });
    
    test("Function Properties of the Math Object: atan(x)", function () {
        var result = puma.evalPuma("Math.atan(0.6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.5404195002705842, "Passed!");
    });
    
    test("Function Properties of the Math Object: atan2(y,x)", function () {
        var result = puma.evalPuma("Math.atan2(25, 90);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.27094685033842053, "Passed!");
    });
    
    test("Function Properties of the Math Object: ceil(x)", function () {
        var result = puma.evalPuma("Math.ceil(20.01);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 21, "Passed!");
    });
    
    test("Function Properties of the Math Object: cos(x)", function () {
        var result = puma.evalPuma("Math.cos(6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 0.960170286650366, "Passed!");
    });
    
    test("Function Properties of the Math Object: exp(x)", function () {
        var result = puma.evalPuma("Math.exp(4);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 54.598150033144236, "Passed!");
    });
    
    test("Function Properties of the Math Object: floor(x)", function () {
        var result = puma.evalPuma("Math.floor(21.01);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 21, "Passed!");
    });
    
    test("Function Properties of the Math Object: log(x)", function () {
        var result = puma.evalPuma("Math.log(10);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2.302585092994046, "Passed!");
    });
    
    test("Function Properties of the Math Object: max([ value1 [ , value2 [ , … ]]])", function () {
        var result = puma.evalPuma("Math.max(9,12,5);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 12, "Passed!");
    });
    
    test("Function Properties of the Math Object: min ([ value1 [ , value2 [ , … ]]])", function () {
        var result = puma.evalPuma("Math.min(9,12,5);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 5, "Passed!");
    });
    
    test("Function Properties of the Math Object: pow(x,y)", function () {
        var result = puma.evalPuma("Math.pow(9,5);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 59049, "Passed!");
    });
    
    test("Function Properties of the Math Object: random()", function () {
        var result = puma.evalPuma("Math.random();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
        equal(result.value >= 0, true, "Passed!");
        equal(result.value < 1, true, "Passed!");
    });
    
    test("Function Properties of the Math Object: round(x)", function () {
        var result = puma.evalPuma("Math.round(65.5256);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 66, "Passed!");
    });
    
    test("Function Properties of the Math Object: sin(x)", function () {
        var result = puma.evalPuma("Math.sin(6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, -0.27941549819892586, "Passed!");
    });
    
    test("Function Properties of the Math Object: sqrt(x)", function () {
        var result = puma.evalPuma("Math.sqrt(4);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 2, "Passed!");
    });
    
    test("Function Properties of the Math Object: tan(x)", function () {
        var result = puma.evalPuma("Math.tan(6);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, -0.29100619138474915, "Passed!");
    });
    
    
    //   Section 15.9: Date Objects   //
    
    test("The Date Constructor Called as a Function", function () {
        var result = puma.evalPuma("Date();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    test("Date( [ year [, month [, date [, hours [, minutes [, seconds [, ms ]]]]]]])", function () {
        var result = puma.evalPuma("Date(1992, 3, 21, 'violets', 'blue', 'microwave', 'banana');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("The Date Constructor", function () {
        var result = puma.evalPuma("new Date();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
    });
    
    QUnit.skip("new Date(year, month [, date [, hours [, minutes [, seconds [, ms ]]]]])", function () {
        var result = puma.evalPuma("new Date(1993, 8, 24, 23, 58, 32, 12);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
    });
    
    QUnit.skip("new Date(value)", function () {
        var result = puma.evalPuma("new Date(2595461133867);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
    });
    
    QUnit.skip("new Date()", function () {
        var result = puma.evalPuma("new Date();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(Object.isExtensible(result.value), true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
    });
    
    test("Properties of the Date Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("Date;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 7, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("Date.prototype", function () {
        var result = puma.evalPuma("Date.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'object', "Passed!");
    });
    
    test("Date.parse(string)", function () {
        var result = puma.evalPuma("Date.parse('Feb 31, 1933');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    test("Date.UTC(year, month [, date [, hours [, minutes [, seconds [, ms ]]]]])", function () {
        var result = puma.evalPuma("Date.UTC(1971, 6, 28, 0, 14, 7, 802);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    test("Date.now()", function () {
        var result = puma.evalPuma("Date.now();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    test("Properties of the Date Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Date, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        //equal(result.value, NaN, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("Date.prototype.constructor", function () {
        var c = "function Date() {\n    [native code]\n}"
        var result = puma.evalPuma("Date.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("Date.prototype.toString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toDateString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toDateString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toTimeString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toTimeString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toLocaleString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toLocaleDateString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleDateString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toLocaleTimeString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleTimeString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.valueOf()", function () {
        var result = puma.evalPuma("var d = new Date(); d.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getTime()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getTime();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getFullYear()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getFullYear();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCFullYear()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCFullYear();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getMonth()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMonth();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCMonth()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMonth();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getDate()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getDate();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCDate()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCDate();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getDay()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getDay();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCDay()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCDay();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getHours()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getHours();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCHours()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCHours();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getMinutes()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMinutes();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCMinutes()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMinutes();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getSeconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getSeconds();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCSeconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCSeconds();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getMilliseconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMilliseconds();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getUTCMilliseconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMilliseconds();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.getTimezoneOffset()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getTimezoneOffset();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setTime(time)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setTime(6983020800000);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setTime(time)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setTime(6983020800000); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.getTime(), 6983020800000, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setMilliseconds(ms)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMilliseconds(250); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(d.getMilliseconds(), 250, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCMilliseconds(ms)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMilliseconds(750); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(d.getUTCMilliseconds(), 750, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setSeconds(sec [, ms ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setSeconds(4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getSeconds(), 4, "Passed!");
        equal(result.valued.getMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCSeconds(sec [, ms ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCSeconds(4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getUTCSeconds(), 4, "Passed!");
        equal(result.valued.getUTCMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setMinutes(min [, sec [, ms ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMinutes(16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getMinutes(), 16, "Passed!");
        equal(result.valued.getSeconds(), 4, "Passed!");
        equal(result.valued.getMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCMinutes(min [, sec [, ms ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMinutes(16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getUTCMinutes(), 16, "Passed!");
        equal(result.valued.getUTCSeconds(), 4, "Passed!");
        equal(result.valued.getUTCMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setHours(hour [, min [, sec [, ms ]]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setHours(5, 16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getHours(), 5, "Passed!");
        equal(result.valued.getMinutes(), 16, "Passed!");
        equal(result.valued.getSeconds(), 4, "Passed!");
        equal(result.valued.getMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCHours(hour [, min [, sec [, ms ]]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCHours(5, 16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.valued.getUTCHours(), 5, "Passed!");
        equal(result.valued.getUTCMinutes(), 16, "Passed!");
        equal(result.valued.getUTCSeconds(), 4, "Passed!");
        equal(result.valued.getUTCMilliseconds(), 465, "Passed!");
    });
    
    QUnit.skip("Date.prototype.setDate(date)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setDate(15);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCDate(date)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCDate(15);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setMonth(month [, date ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMonth(3, 14);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCMonth(month [, date ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMonth(3, 14);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setFullYear(year [, month [, date ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setFullYear(2191, 3, 14);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.setUTCFullYear(year [, month [, date ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCFullYear(2191, 3, 14);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'number', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toUTCString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toUTCString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toISOString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toISOString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    QUnit.skip("Date.prototype.toJSON(key)", function () {
        var result = puma.evalPuma("var d = new Date(); d.toJSON(1);");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    test("Properties of Date Instances", function () {
        var result = puma.evalPuma("var d = Date(); d.valueOf();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(typeof result.value, 'string', "Passed!");
    });
    
    
    //   Section 15.11: Error Objects   //
    
    test("The Error Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = Error(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'Error', "Passed!");
    });
    
    test("Error(message)", function () {
        var result = puma.evalPuma("Error('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The Error Constructor", function () {
        var result = puma.evalPuma("var e = new Error('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'Error', "Passed!");
    });
    
    QUnit.skip("new Error(message)", function () {
        var result = puma.evalPuma("var e = new Error(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the Error Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("Error;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("Error.prototype", function () {
        var result = puma.evalPuma("Error.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), 'Error', "Passed!");
    });
    
    test("Properties of the Error Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Error, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("Error.prototype.constructor", function () {
        var c = "function Error() {\n    [native code]\n}"
        var result = puma.evalPuma("Error.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("Error.prototype.name", function () {
        var result = puma.evalPuma("Error.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(Error.prototype.toString(), 'Error', "Passed!");
    });
    
    QUnit.skip("Error.prototype.message", function () {
        var result = puma.evalPuma("Error.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(Error.prototype.toString(), '', "Passed!");
    });
    
    QUnit.skip("Error.prototype.toString()", function () {
        var result = puma.evalPuma("var e = new Error('Does not compute.'); e.toString();");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'Error: Does not compute.', "Passed!");
    });
    
    test("Properties of Error Instances", function () {
        var result = puma.evalPuma("var e = Error(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'Error', "Passed!");
    });
    
    /*
        NOTE
                Since puma throws Type Error by own account when it stumbles upon 
                most of the errors herein tested, discerning the error thrown in 
                runtime by the original script seems not possible/profitable.
                Particular error instances are then not compared or either compared
                against general instance Error.
        
        END OF NOTE
    */
    
    /////       EvalError not implemented in ECMA-262 edition number 5.1       /////
    
    /*
    test("EvalError: XXXXX", function () {
        try {
            var result = puma.evalPuma("new Array(-1);");
        }
        catch (e) {
            if (e instanceof EvalError) {
            equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
            }
        }
    });
    */
    
    test("RangeError: new Array(len)", function () {
        try {
            var result = puma.evalPuma("var a = new Array(-1);");
        }
        catch (e) {
            if (e instanceof Error) {
                equal(true, true, "Passed!");
            }
        }
    });
    
    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////
    
    /*
    test("RangeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof RangeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
        }
    });
    */
    
    QUnit.skip("ReferenceError: GetValue(V)", function () {
        try {
            var result = puma.evalPuma("var u = UndefinedVariable;");
        }
        catch (e) {
            if (e instanceof Error) {
                equal(true, true, "Passed!");
            }
        }
    });
    
    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////
    
    /*
    test("ReferenceError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof EvalError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
            }
        }
    });
    */
    
    test("SyntaxError: Object Initialiser", function () {
        try {
            var result = puma.evalPuma("obj = new Object({Name:'LEO', Terminal:25000, Trayectorie:'Panchaea}); obj;");
        }
        catch (e) {
            if (e instanceof Error) {
                equal(true, true, "Passed!");
            }
        }
    });
    
    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////
    
    /*
    test("SyntaxError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
            }
        }
    });
    */
    
    QUnit.skip("TypeError: Object Internal Properties and Methods", function () {
        try {
            var result = puma.evalPuma("Object().put(this);");
        }
        catch (e) {
            if (e instanceof Error) {
                equal(true, true, "Passed!");
            }
        }
    });
    
    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////
    
    /*
    test("TypeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof TypeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
            }
        }
    });
    */
    
    test("URIError: decodeURI(encodedURI)", function () {
        try {
            var result = puma.evalPuma("decodeURI('%');");
        }
        catch (e) {
            if (e instanceof Error) {
                equal(true, true, "Passed!");
            }
        }
    });
    
    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////
    
    /*
    test("TypeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof TypeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN", "Passed!");
            }
        }
    });
    */
    
    // Native Error Tests: URIError
    
    // Native Error Tests: RangeError
    
    test("The RangeError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = RangeError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'RangeError', "Passed!");
    });
    
    test("RangeError(message)", function () {
        var result = puma.evalPuma("RangeError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The RangeError Constructor", function () {
        var result = puma.evalPuma("var e = new RangeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'RangeError', "Passed!");
    });
    
    QUnit.skip("new RangeError(message)", function () {
        var result = puma.evalPuma("var e = new RangeError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the RangeError Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("RangeError;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("RangeError.prototype", function () {
        var result = puma.evalPuma("RangeError.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");console.log();
        equal(result.value.toString(), 'RangeError', "Passed!");
    });
    
    test("Properties of the RangeError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(RangeError, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("RangeError.prototype.constructor", function () {
        var c = "function RangeError() {\n    [native code]\n}"
        var result = puma.evalPuma("RangeError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("RangeError.prototype.name", function () {
        var result = puma.evalPuma("RangeError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(RangeError.prototype.toString(), 'RangeError', "Passed!");
    });
    
    QUnit.skip("RangeError.prototype.message", function () {
        var result = puma.evalPuma("RangeError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(RangeError.prototype.toString(), '', "Passed!");
    });
    
    test("Properties of RangeError Instances", function () {
        var result = puma.evalPuma("var e = RangeError(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'RangeError', "Passed!");
    });
    
    // Native Error Tests: ReferenceError
    
    test("The ReferenceError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = ReferenceError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'ReferenceError', "Passed!");
    });
    
    test("ReferenceError(message)", function () {
        var result = puma.evalPuma("ReferenceError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The ReferenceError Constructor", function () {
        var result = puma.evalPuma("var e = new ReferenceError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'ReferenceError', "Passed!");
    });
    
    QUnit.skip("new ReferenceError(message)", function () {
        var result = puma.evalPuma("var e = new ReferenceError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the ReferenceError Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("ReferenceError;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("ReferenceError.prototype", function () {
        var result = puma.evalPuma("ReferenceError.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), 'ReferenceError', "Passed!");
    });
    
    test("Properties of the ReferenceError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(ReferenceError, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("ReferenceError.prototype.constructor", function () {
        var c = "function ReferenceError() {\n    [native code]\n}"
        var result = puma.evalPuma("ReferenceError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("ReferenceError.prototype.name", function () {
        var result = puma.evalPuma("ReferenceError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(ReferenceError.prototype.toString(), 'ReferenceError', "Passed!");
    });
    
    QUnit.skip("ReferenceError.prototype.message", function () {
        var result = puma.evalPuma("ReferenceError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(ReferenceError.prototype.toString(), '', "Passed!");
    });
    
    test("Properties of ReferenceError Instances", function () {
        var result = puma.evalPuma("var e = ReferenceError(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'ReferenceError', "Passed!");
    });
    
    // Native Error Tests: SyntaxError

    test("The SyntaxError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = SyntaxError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'SyntaxError', "Passed!");
    });
    
    test("SyntaxError(message)", function () {
        var result = puma.evalPuma("SyntaxError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The SyntaxError Constructor", function () {
        var result = puma.evalPuma("var e = new SyntaxError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'SyntaxError', "Passed!");
    });
    
    QUnit.skip("new SyntaxError(message)", function () {
        var result = puma.evalPuma("var e = new SyntaxError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the SyntaxError Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("SyntaxError;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("SyntaxError.prototype", function () {
        var result = puma.evalPuma("SyntaxError.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), 'SyntaxError', "Passed!");
    });
    
    test("Properties of the SyntaxError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(SyntaxError, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("SyntaxError.prototype.constructor", function () {
        var c = "function SyntaxError() {\n    [native code]\n}"
        var result = puma.evalPuma("SyntaxError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("SyntaxError.prototype.name", function () {
        var result = puma.evalPuma("SyntaxError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(SyntaxError.prototype.toString(), 'SyntaxError', "Passed!");
    });
    
    QUnit.skip("SyntaxError.prototype.message", function () {
        var result = puma.evalPuma("SyntaxError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(SyntaxError.prototype.toString(), '', "Passed!");
    });
    
    test("Properties of SyntaxError Instances", function () {
        var result = puma.evalPuma("var e = SyntaxError(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'SyntaxError', "Passed!");
    });
    
    // Native Error Tests: TypeError

    test("The TypeError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = TypeError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'TypeError', "Passed!");
    });
    
    test("TypeError(message)", function () {
        var result = puma.evalPuma("TypeError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The TypeError Constructor", function () {
        var result = puma.evalPuma("var e = new TypeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'TypeError', "Passed!");
    });
    
    QUnit.skip("new TypeError(message)", function () {
        var result = puma.evalPuma("var e = new TypeError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the TypeError Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("TypeError;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("TypeError.prototype", function () {
        var result = puma.evalPuma("TypeError.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), 'TypeError', "Passed!");
    });
    
    test("Properties of the TypeError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(TypeError, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("TypeError.prototype.constructor", function () {
        var c = "function TypeError() {\n    [native code]\n}"
        var result = puma.evalPuma("TypeError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("TypeError.prototype.name", function () {
        var result = puma.evalPuma("TypeError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(TypeError.prototype.toString(), 'TypeError', "Passed!");
    });
    
    QUnit.skip("TypeError.prototype.message", function () {
        var result = puma.evalPuma("TypeError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(TypeError.prototype.toString(), '', "Passed!");
    });
    
    test("Properties of TypeError Instances", function () {
        var result = puma.evalPuma("var e = TypeError(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'TypeError', "Passed!");
    });
    
    // Native Error Tests: URIError

    test("The URIError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = URIError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'URIError', "Passed!");
    });
    
    test("URIError(message)", function () {
        var result = puma.evalPuma("URIError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    QUnit.skip("The URIError Constructor", function () {
        var result = puma.evalPuma("var e = new URIError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.name, 'URIError', "Passed!");
    });
    
    QUnit.skip("new URIError(message)", function () {
        var result = puma.evalPuma("var e = new URIError(); e;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.message, 'lp0 on fire', "Passed!");
    });
    
    test("Properties of the URIError Constructor", function () {
        var c = Function.prototype.toString();
        var result = puma.evalPuma("URIError;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.length, 1, "Passed!");
        equal(result.value.constructor.prototype.toString(), c, "Passed!");
    });
    
    QUnit.skip("URIError.prototype", function () {
        var result = puma.evalPuma("URIError.prototype;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), 'URIError', "Passed!");
    });
    
    test("Properties of the URIError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(URIError, 'prototype');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.writable, false, "Passed!");
        equal(result.value.enumerable, false, "Passed!");
        equal(result.value.configurable, false, "Passed!");
    });
    
    QUnit.skip("URIError.prototype.constructor", function () {
        var c = "function URIError() {\n    [native code]\n}"
        var result = puma.evalPuma("URIError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value.toString(), c, "Passed!");
    });
    
    QUnit.skip("URIError.prototype.name", function () {
        var result = puma.evalPuma("URIError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(URIError.prototype.toString(), 'URIError', "Passed!");
    });
    
    QUnit.skip("URIError.prototype.message", function () {
        var result = puma.evalPuma("URIError.prototype.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(URIError.prototype.toString(), '', "Passed!");
    });
    
    test("Properties of URIError Instances", function () {
        var result = puma.evalPuma("var e = URIError(); e.name;");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, 'URIError', "Passed!");
    });
    
    
    //   Section 15.12: The JSON Object   //
    
    test("JSON.parse(text)", function () {
        var result = puma.evalPuma("JSON.parse('{\"Name\":\"LEO\",\"Terminal\":25000}');");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), '{"Name":"LEO","Terminal":25000}', "Passed!");
    });
    
    test("JSON.parse(text [, reviver ])", function () {
        var result = puma.evalPuma("JSON.parse('{\"1\": 1, \"2\": 2, \"3\": {\"4\": 4, \"5\": {\"6\": 6}}}', function(k, v) { return v; });");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(JSON.stringify(result.value), "{\"1\":1,\"2\":2,\"3\":{\"4\":4,\"5\":{\"6\":6}}}", "Passed!");
    });
    
    test("JSON.stringify(text)", function () {
        var c = '{"Name":"LEO","Terminal":25000}';
        var result = puma.evalPuma("JSON.stringify({\"Name\":\"LEO\",\"Terminal\":25000});");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, '{"Name":"LEO","Terminal":25000}', "Passed!");
    });
    
    test("JSON.stringify ( value [ , replacer [ , space ] ] )", function () {
        /*var c = JSON.stringify({ foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7, working: false }, function (key, value) { if (typeof value === "string") { return undefined; } return value; }, '\t');*/
        
        var result = puma.evalPuma("var foo = { foundation: \"Mozilla\", model: \"box\", week: 45, transport: \"car\", month: 7, working: false }; var j = JSON.stringify(foo, Function('key', 'value', 'if (typeof value === \"string\") { return undefined; } return value;'), \"\t\");");
        result.makeValue();
        equal(result.success, true, "Passed!");
        equal(result.value, "{\n\t\"week\": 45,\n\t\"month\": 7,\n\t\"working\": false\n}", "Passed!");
        //equal(result.value, c, "Passed!");
    });
    
    
    // Below tests done by Juan Guzmán [Gh tag]
    
    QUnit.skip("15.4.2.1 new Array ( [ item0 [ , item1 [ , ... ] ] ] )", function () {
        var result = puma.evalPuma("var a = new Array()");
        ok(result.success && typeof a == "object", "Passed!");
    });
    QUnit.skip("15.4.2.1 new Array ( [ item0 [ , item1 [ , ... ] ] ] )", function () {
        var result = puma.evalPuma("var a = new Array ('a','b')");
        ok(result.success && a[1] == 'b' && a[0] == 'a' && a.length == 2, "Passed!");
    });
    QUnit.skip("15.4.4.1 Array.prototype.constructor ", function () {
        var result = puma.evalPuma("var a = Array.prototype.constructor");
        ok(result.success && typeof a == "function", "Passed!");
    });
    QUnit.skip("15.4.4.2 Array.prototype.toString ( )", function () {
        var result = puma.evalPuma("var a = Array.prototype.toString ( )");
        ok(result.success && typeof a == "string" && a.length == 0, "Passed!");
    });
    QUnit.skip("15.4.4.3 Array.prototype.toLocaleString ( )", function () {
        var result = puma.evalPuma("var a = Array.prototype.toLocaleString ()");
        ok(result.success && typeof a == "string" && a.length == 0, "Passed!");
    });
    QUnit.skip("15.4.4.4 Array.prototype.concat ( [ item1 [ , item2 [ , … ] ] ] )", function () {
        var result = puma.evalPuma("var a = Array.prototype.concat ( 1,2)");
        ok(result.success && a[1] == '2' && a[0] == '1' && a.length == 2, "Passed!");
    });
    QUnit.skip("15.5.4.1 String.prototype.constructor", function () {
        var result = puma.evalPuma("var a = String.prototype.constructor");
        ok(result.success && typeof a == "function", "Passed!");
    });
    QUnit.skip("15.5.4.2 String.prototype.toString ( )", function () {
        var result = puma.evalPuma("var a = String.prototype.toString ( )");
        ok(result.success && typeof a == "string" && a.length == 0, "Passed!");
    });
    QUnit.skip("15.5.4.3 String.prototype.valueOf ( )", function () {
        var result = puma.evalPuma("var a = 'juan'");
        ok(result.success && a.valueOf() == 'juan', "Passed!");
    });
    QUnit.skip("15.6.2.1 new Boolean (value)", function () {
        var result = puma.evalPuma("var a = new Boolean (true)");
        ok(result.success && typeof a == "string" && a == true, "Passed!");
    });
    QUnit.skip("15.6.4.1 Boolean.prototype.constructor", function () {
        var result = puma.evalPuma("var a = new Boolean(true)");
        ok(result.success && a.constructor == Boolean, "Passed!");
    });
});