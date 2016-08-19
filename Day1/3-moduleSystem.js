/*Let's start by creating a function that loads the content of a module, wraps it into a
private scope, and evaluates it:*/
function loadModule(filename, module, require) {
    var wrappedSrc = '(function(module, exports, require) {' + fs.readFileSync(filename, 'utf8') + '})(module, module.exports, require);';
    eval(wrappedSrc);
}
//implementing our require() function
var require = function (moduleName) {
    console.log('Require invoked for module: ' + moduleName);
    var id = require.resolve(moduleName); //[1]
    if (require.cache[id]) { //[2]
        return require.cache[id].exports;
    }
    //module metadata
    var module = { //[3]
        exports: {}
        , id: id
    };
    //Update the cache
    require.cache[id] = module; //[4]
    //load the module
    loadModule(id, module, require); //[5]
    //return exported variables
    return module.exports; //[6]
};
require.cache = {};
require.resolve = function (moduleName) {
    /* resolve a full module id from the moduleName */
}