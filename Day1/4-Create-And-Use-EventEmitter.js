var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function findPattern(files, regex) {
    var emitter = new EventEmitter();
    files.forEach(function (file) {
        fs.readFile(file, 'utf8', function (err, content) {
            if (err) {
                return emitter.emit('error', err);
            }
            emitter.emit('fileread', file);
            var match = null;
            if (match = content.match(regex)) match.forEach(function (elem) {
                emitter.emit('found', file, elem);
            });
        });
    });
    return emitter;
}
findPattern(['fileA.txt', 'fileB.json'], /hello \w+/g).on('fileread', function (file) {
    console.log(file + ' was read');
}).on('found', function (file, match) {
    console.log('Matched "' + match + '" in file ' + file);
}).on('error', function (err) {
    console.log('Error emitted: ' + err.message);
});
/* 1)The EventEmitter - as it happens for callbacks - cannot just throw exceptions
when an error condition occurs, as they would be lost in the event loop if the
event is emitted asynchronously. Instead, the convention is to emit a special event,
called error, and to pass an Error object as an argument. That's exactly what we
are doing in the findPattern() function that we defined earlier.
  2)It is always a good practice to register a listener for the
error event, as Node.js will treat it in a special way and will
automatically throw an exception and exit from the program if
no associated listener is found.*/