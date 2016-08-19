var fs = require('fs');
var cache = {};

function consistentReadAsync(filename, callback) {
    if (cache[filename]) {
        process.nextTick(function () {
            callback(cache[filename]);
        });
    }
    else {
        //asynchronous function
        fs.readFile(filename, 'utf8', function (err, data) {
            cache[filename] = data;
            callback(data);
        });
    }
}