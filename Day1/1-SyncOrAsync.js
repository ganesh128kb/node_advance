var fs = require('fs');
var cache = {};

function inconsistentRead(filename, callback) {
    if (cache[filename]) {
        //invoked synchronously
        callback(cache[filename]);
    }
    else {
        //asynchronous function
        fs.readFile(filename, 'utf8', function (err, data) {
            cache[filename] = data;
            callback(data);
        });
    }
}
//-------------Below code will show how it can break an application---
function createFileReader(filename) {
    var listeners = [];
    inconsistentRead(filename, function (value) {
        listeners.forEach(function (listener) {
            listener(value);
        });
    });
    return {
        onDataReady: function (listener) {
            listeners.push(listener);
        }
    };
}
/*When the preceding function is invoked, it creates a new object that acts as a notifier,allowing to set multiple listeners for a file read operation. All the listeners will be invoked at once when the read operation completes and the data is available. The preceding function uses our inconsistentRead() function to implement this functionality. Let's now try to use the createFileReader() function:*/
var reader1 = createFileReader('data.txt');
reader1.onDataReady(function (data) {
    console.log('First call data: ' + data);
    //...sometime later we try to read again from
    //the same file
    var reader2 = createFileReader('data.txt');
    reader2.onDataReady(function (data) {
        console.log('Second call data: ' + data);
    });
});