var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var utilities = require('./utilities');

function errorHandler(err, callback){
	return callback(err);
}

function spider(url, callback) {
    var filename = utilities.urlToFilename(url);
    fs.exists(filename, function (exists) { //[1]
        if (!exists) {
            console.log("Downloading " + url);
            request(url, function (err, response, body) { //[2]
                if (err) {
                   errorHandler(err, callback);
                }
                mkdirp(path.dirname(filename), function (err) { //[3]
					if (err) {
                        errorHandler(err, callback);
                    }
					fs.writeFile(filename, body, function (err) { //[4]
						if (err) {
							errorHandler(err, callback);
						}
						callback(null, filename, true);
							
					});
                        
                });
               
            });
        }
        else {
            callback(null, filename, false);
        }
    });
}
/*To complete our web spider application, we just need to invoke the spider()
function by providing a URL as an input( in our
case, we read it from the command - line arguments):*/
spider(process.argv[2], function (err, filename, downloaded) {
    if (err) {
        console.log(err);
		return;
    }
    if (downloaded) {
        console.log('Completed the download of "' + filename + '"');
    }
    else {
        console.log('"' + filename + '" was already downloaded');
    }
});
/* node Spider http://www.xyz.com */