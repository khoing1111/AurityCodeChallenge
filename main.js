//////////////
// REQUIRED

// Core
var http = require('http');
var fileSystem = require('fs');
var httpRequest = require('request');
var url = require('url');

// Mustache
var mu = require('mu2');
mu.root = __dirname + '/assets/templates';


////////////
// GLOBAL
const globalData = {
    apiHost: 'https://timesheet-staging-aurity.herokuapp.com/api/'
}


/////////////
// PROCESS
// Main server
var server = http.createServer(function (request, response) {
    // Parse url
    var requestUrl = url.parse(request.url).pathname;

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // Bind error handler
    var errorHandler = function(err) {
        // Log out error
        console.error(`SYSTEM EXCEPTION: ${err}\n`);

        // Response with 500 status
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write('System error 500. Please try and contact administrator')
        response.end();

        // Unbind error handler
        process.removeListener("uncaughtException", errorHandler);
    };

    process.on("uncaughtException", errorHandler);

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // Serve static file
    if (requestUrl.substr(0, 7) == '/static') {
        var fileUrl = __dirname + requestUrl;
        var readStream = fileSystem.createReadStream(fileUrl);

        // Set content type
        if (requestUrl.substr(7, 3) == '/js') {
            response.writeHead(200, {'Content-Type': 'text/javascript'});
        } else if (requestUrl.substr(7, 4) == '/css') {
            response.writeHead(200, {'Content-Type': 'text/css'});
        } else {
            response.writeHead(200, {'Content-Type': 'text/plain'});
        }

        // Response file
        readStream.pipe(response);
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // Html response
    else if (requestUrl.substr(0, 5) == '/view') {
        var params = requestUrl.substr(6).split('/');
        var userId = params[0] ? params[0] : null;
        var month = params[1] ? params[1] : null;
        var year = params[2] ? params[2] : null;

        // Default date is today
        var validateDate = new Date();
        if (year) {
            validateDate.setFullYear(year);
        }

        if (month) {
            validateDate.setMonth(parseInt(month) - 1);
        }

        // Reset data base on validated date
        year = validateDate.getFullYear();
        month = validateDate.getMonth() + 1;

        // API Request: Get user list
        httpRequest.get(globalData.apiHost + 'users', function(error, apiResponse, body) {
            if (!error && apiResponse.statusCode == 200) {
                var userList = body;
                if (!userId && userList.length > 0) {
                    userId = JSON.parse(userList)[0].id;
                }

                // API Request get user month data
                httpRequest.get(globalData.apiHost + `training/weeks/${month}/${year}/${userId}`, function(error, apiResponse, body) {
                    if (!error && apiResponse.statusCode == 200) {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        var stream = mu.compileAndRender('full.html', {
                            theme:      "default",
                            month:      month - 1,
                            year:       year,
                            userId:     userId,
                            userData:   body,
                            userList:   userList
                        });

                        // Stream template content
                        stream.pipe(response);
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.write('Unable to connect to api server');
                        response.end();
                    }
                });
            } else {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('Unable to connect to api server');
                response.end();
            }
        });
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // Approve action
    else if (requestUrl.substr(0, 8) == '/approve' || requestUrl.substr(0, 7) == '/reject' ) {
        var params = requestUrl.substr(9).split('/');
        var status = 'approved';
        if (requestUrl.substr(0, 7) == '/reject') {
            var params = requestUrl.substr(8).split('/');
            var status = 'rejected';
        }

        var userId = params[0] ? params[0] : null;
        var weekId = params[1] ? params[1] : null;
        if (!userId) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({
                status:     'error',
                message:    'Invalid user id'
            }));

            response.end();
        } else if (!weekId) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({
                status:     'error',
                message:    'Invalid week id'
            }));

            response.end();
        } else {
            // API Request put validation
            httpRequest.put({
                url:globalData.apiHost + `training/weeks/${weekId}/users/${userId}`,
                form: {
                    status: status
                }
            }, function(error, apiResponse, body) {
                if (!error && apiResponse.statusCode == 200) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify({ status: 'success' }));
                    response.end();
                } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify({
                        status:     'error',
                        message:    'API Error: ' + apiResponse.statusCode + ' >> ' + error
                    }));

                    response.end();
                }
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // 404
    else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    // Unbind error handler
    process.removeListener("uncaughtException", errorHandler);
});

server.on('clientError', (error, socket) => {
    console.error(`CLIENT ERROR: ${error}\n`);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('error', (error, socket) => {
    console.error(`SERVER ERROR: ${error}\n`);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(80);
